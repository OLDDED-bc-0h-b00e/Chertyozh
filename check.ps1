param([switch]$Quiet, [switch]$Hook)
[Console]::OutputEncoding = [Text.Encoding]::UTF8

# Быстрая проверка site/ без браузера. Код выхода 0 = ок, 1 = есть ошибки.
# Проверяет каждый site/**/*.html:
#   1. Пути только относительные (сайт работает в подпапке GitHub Pages).
#   2. Каждый ключ data-i18n / data-i18n-attr есть и в ru, и в en словарей,
#      подключённых этой страницей (<script src="...i18n*.js">).
#   3. В каждом словаре ключи ru и en совпадают, без дублей.
#   4. У каждого <img> есть alt.
#   5. Локальные ссылки href/src указывают на существующие файлы.
# Плюс JS в site/: нет путей от корня, ключи t('a.b') есть в js/i18n.js.

# -Hook: вызов из PostToolUse-хука Claude Code. Читает JSON из stdin,
# проверяет только правки внутри site/, при ошибках выходит с кодом 2.
if ($Hook) {
  $Quiet = $true
  try {
    $in = [Console]::In.ReadToEnd() | ConvertFrom-Json
    $file = [string]$in.tool_input.file_path
  } catch { $file = '' }
  if ($file -notmatch '[\\/]site[\\/]') { exit 0 }
}

$site = Join-Path $PSScriptRoot 'site'
$utf8 = New-Object System.Text.UTF8Encoding($false)
$errors = New-Object System.Collections.Generic.List[string]
$rel = { param($p) $p.Substring($site.Length + 1).Replace('\', '/') }
$opt = [Text.RegularExpressions.RegexOptions]::Multiline

# Словарь: путь -> @{ ru = [keys]; en = [keys] }
$dicts = @{}
function Get-Dict([string]$path) {
  if ($dicts.ContainsKey($path)) { return $dicts[$path] }
  $src = [IO.File]::ReadAllText($path, $utf8)
  $ruStart = $src.IndexOf('ru:'); $enStart = $src.IndexOf('en:')
  $d = @{ ru = @(); en = @() }
  $name = & $rel $path
  if ($ruStart -lt 0 -or $enStart -lt 0) { $errors.Add("${name}: не найдены блоки ru: / en:") }
  else {
    $keyRe = '[''"]([^''"\r\n]+)[''"]\s*:'
    if ($ruStart -lt $enStart) { $ruPart = $src.Substring($ruStart, $enStart - $ruStart); $enPart = $src.Substring($enStart) }
    else { $enPart = $src.Substring($enStart, $ruStart - $enStart); $ruPart = $src.Substring($ruStart) }
    $d.ru = @([regex]::Matches($ruPart, $keyRe, $opt) | ForEach-Object { $_.Groups[1].Value })
    $d.en = @([regex]::Matches($enPart, $keyRe, $opt) | ForEach-Object { $_.Groups[1].Value })
    foreach ($k in $d.ru) { if ($d.en -notcontains $k) { $errors.Add("${name}: ключ '$k' есть в ru, нет в en") } }
    foreach ($k in $d.en) { if ($d.ru -notcontains $k) { $errors.Add("${name}: ключ '$k' есть в en, нет в ru") } }
    foreach ($g in ($d.ru | Group-Object | Where-Object Count -gt 1)) { $errors.Add("${name}: дубль ключа '$($g.Name)' в ru") }
    foreach ($g in ($d.en | Group-Object | Where-Object Count -gt 1)) { $errors.Add("${name}: дубль ключа '$($g.Name)' в en") }
  }
  $dicts[$path] = $d
  return $d
}

foreach ($f in Get-ChildItem $site -Recurse -Filter *.html) {
  $html = [IO.File]::ReadAllText($f.FullName, $utf8)
  $name = & $rel $f.FullName
  $dir = $f.DirectoryName

  # 1. Пути от корня
  foreach ($m in [regex]::Matches($html, '(?:href|src|action)\s*=\s*["'']/(?!/)')) { $errors.Add("${name}: путь от корня '$($m.Value)...' (нужен относительный)") }

  # 4. alt
  foreach ($m in [regex]::Matches($html, '<img\b[^>]*>')) {
    if ($m.Value -notmatch '\balt\s*=') { $errors.Add("${name}: <img> без alt: $($m.Value)") }
  }

  # 5. Локальные файлы
  foreach ($m in [regex]::Matches($html, '(?:href|src)\s*=\s*"([^"]*)"')) {
    $p = ($m.Groups[1].Value -split '[?#]')[0]
    if ($p -eq '' -or $p -match '^(?:[a-z]+:|//)' -or $p -match '^\.?/?$') { continue }
    $target = Join-Path $dir $p
    if (-not (Test-Path $target)) { $errors.Add("${name}: файл не найден '$($m.Groups[1].Value)'") }
  }

  # 2. Ключи i18n
  $ru = @(); $en = @(); $hasDict = $false
  foreach ($m in [regex]::Matches($html, '<script[^>]+src\s*=\s*"([^"]*i18n[^"]*\.js)"')) {
    $p = Join-Path $dir $m.Groups[1].Value
    if (Test-Path $p) { $d = Get-Dict ([IO.Path]::GetFullPath($p)); $ru += $d.ru; $en += $d.en; $hasDict = $true }
  }
  $used = New-Object System.Collections.Generic.HashSet[string]
  foreach ($m in [regex]::Matches($html, 'data-i18n="([^"]+)"')) { [void]$used.Add($m.Groups[1].Value) }
  foreach ($m in [regex]::Matches($html, 'data-i18n-attr="([^"]+)"')) {
    foreach ($pair in $m.Groups[1].Value.Split(';')) { $k = $pair.Split(':')[1]; if ($k) { [void]$used.Add($k) } }
  }
  if ($used.Count -and -not $hasDict) { $errors.Add("${name}: есть data-i18n, но не подключён ни один i18n*.js") }
  foreach ($k in $used) {
    if ($ru -notcontains $k) { $errors.Add("${name}: ключ '$k' нет в ru") }
    if ($en -notcontains $k) { $errors.Add("${name}: ключ '$k' нет в en") }
  }
}

# JS: пути от корня и ключи t('...') главного словаря
$mainDict = Join-Path $site 'js\i18n.js'
foreach ($f in Get-ChildItem $site -Recurse -Filter *.js) {
  $src = [IO.File]::ReadAllText($f.FullName, $utf8)
  $name = & $rel $f.FullName
  foreach ($m in [regex]::Matches($src, '["''`]/(?:css|js|assets|img|templates)/')) { $errors.Add("${name}: путь от корня $($m.Value)") }
  if ($f.FullName -like "$site\js\*" -and (Test-Path $mainDict)) {
    $d = Get-Dict ([IO.Path]::GetFullPath($mainDict))
    foreach ($m in [regex]::Matches($src, "\bt\('([a-zA-Z0-9_-]+\.[a-zA-Z0-9_.-]+)'\)")) {
      $k = $m.Groups[1].Value
      if ($d.ru -notcontains $k) { $errors.Add("${name}: t('$k') нет в ru") }
      if ($d.en -notcontains $k) { $errors.Add("${name}: t('$k') нет в en") }
    }
  }
}

# CSS: url() от корня
foreach ($f in Get-ChildItem $site -Recurse -Filter *.css) {
  $css = [IO.File]::ReadAllText($f.FullName, $utf8)
  foreach ($m in [regex]::Matches($css, 'url\(\s*["'']?/(?!/)')) { $errors.Add("$(& $rel $f.FullName): url() от корня '$($m.Value)'") }
}

if ($errors.Count) {
  [Console]::Error.WriteLine("check.ps1: ошибок $($errors.Count)")
  $errors | ForEach-Object { [Console]::Error.WriteLine(" - $_") }
  if ($Hook) { exit 2 }
  exit 1
}
if (-not $Quiet) { Write-Host 'check.ps1: OK' }
exit 0