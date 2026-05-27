# Script to update collection pages to link to product pages
# This updates: DesktopHumidors, ElectronicHumidors, TravelHumidors, Accessories

$files = @(
  'src/components/DesktopHumidors.tsx',
  'src/components/ElectronicHumidors.tsx',
  'src/components/TravelHumidors.tsx',
  'src/components/Accessories.tsx'
)

foreach ($file in $files) {
  $path = Join-Path 'C:\Users\ejerc\DLS-Belle1' $file
  if (-not (Test-Path $path)) { Write-Host "SKIP: $file"; continue }
  
  $content = Get-Content $path -Raw
  $original = $content
  
  # 1. Add handle to DisplayProduct type
  $content = $content -replace '(type DisplayProduct = \{[\s\S]*?)(id: string;)', "`$1`$2`n  handle: string;"
  
  # 2. Add handle to fromShopify return
  $content = $content -replace '(return \{[\s\S]*?)(id: `shopify-\$\{p\.id\}`)', "`$1`$2,`n    handle: p.handle,"
  
  # 3. Add handle to static products (add after id line in each product)
  # This is tricky with regex — we'll do a simpler approach
  
  # 4. Remove selected state and ProductDetail check
  $content = $content -replace 'const \[selected, setSelected\] = useState<DisplayProduct \| null>\(null\);\s*', ''
  $content = $content -replace 'if \(selected\) return <ProductDetail product=\{selected\} onBack=\{\(\) => setSelected\(null\)\} />;\s*', ''
  
  # 5. Change div onClick to a href for product cards
  $content = $content -replace 'onClick=\{\(\) => setSelected\(product\)\}', ''
  $content = $content -replace '<div\s+\n\s+key=\{product\.id\}\s*\n', "<a`n                key={product.id}`n                href={`/product/${product.handle}`}`n"
  $content = $content -replace '</div>\s*\n\s*\)\}\s*\n\s*</div>\s*\n\s*\)\}\s*\n\s*</div>\s*\n\s*\{loading \? \(', "</a>`n            ))}`n          </div>`n        ) : sorted.length === 0 ? ("
  
  if ($content -ne $original) {
    Set-Content $path $content -NoNewline
    Write-Host "UPDATED: $file"
  } else {
    Write-Host "NO CHANGES: $file"
  }
}
