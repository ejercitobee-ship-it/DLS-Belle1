# extract_urls.ps1
$files = Get-ChildItem -Path src -Recurse -Filter *.tsx
$urls = [System.Collections.Generic.List[string]]::new()
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $matches = [regex]::Matches($content, 'https://cdn\.shopify\.com/s/files/1/0950/7392/7538/(?:files|collections)/(?<f>[^\s\'"\)]+)')
    foreach ($m in $matches) {
        $url = $m.Value
        if (-not $urls.Contains($url)) {
            $urls.Add($url)
        }
    }
}
$urls | Sort-Object | ForEach-Object { $_ }
