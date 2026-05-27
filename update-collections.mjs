import fs from 'fs';
import path from 'path';

const files = [
  'src/components/ElectronicHumidors.tsx',
  'src/components/TravelHumidors.tsx', 
  'src/components/Accessories.tsx',
];

for (const file of files) {
  const filepath = path.join(process.cwd(), file);
  if (!fs.existsSync(filepath)) {
    console.log('SKIP: ' + file);
    continue;
  }

  let content = fs.readFileSync(filepath, 'utf8');
  const original = content;

  // 1. Add handle to DisplayProduct type (after key: string;)
  if (!content.includes('handle: string;')) {
    content = content.replace(
      /(type DisplayProduct = \{[\s\S]*?)(key: string;)/,
      '$1$2\n  handle: string;'
    );
  }

  // 2. Add handle to fromShopify return
  if (!content.includes('handle: p.handle,')) {
    content = content.replace(
      /return \{\s*key: p\.id,/g,
      'return {\n    key: p.id,\n    handle: p.handle,'
    );
  }

  // 3. Add handle to fromStatic return  
  if (!content.includes('handle: p.name.toLowerCase()')) {
    content = content.replace(
      /return \{\s*key: `static-\$\{p\.id\}`/g,
      "return {\n    key: `static-${p.id}`,\n    handle: p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),"
    );
  }

  // 4. Remove selected state
  content = content.replace(/const \[selected, setSelected\] = useState<DisplayProduct \| null>\(null\);\s*\n/, '');

  // 5. Remove ProductDetail check
  content = content.replace(/if \(selected\) return <ProductDetail product=\{selected\} onBack=\{\(\) => setSelected\(null\)\} \/>;\s*\n/, '');

  // 6. Change div onClick to a href for product cards
  content = content.replace(
    /onClick=\{\(\) => setSelected\(product\)\}/g,
    'href={`/product/${product.handle}`}'
  );

  // 7. Change opening div to opening a for product cards
  content = content.replace(
    /<div\s+\n\s+key=\{product\.key\}\s*\n\s+href=/g,
    '<a\n                  key={product.key}\n                  href='
  );

  // 8. Change closing div to closing a for product cards (the one after View →)
  content = content.replace(
    /View →\s*\n\s+<\/span\u003e\s*\n\s+<\/div\u003e\s*\n\s+<\/div\u003e\s*\n\s+<\/div\u003e\s*\n\s+\)\)\}\s*\n\s+<\/div\u003e/g,
    "View →\n                  </span>\n                </div>\n              </a>\n            ))}\n          </div>"
  );

  // 9. Add e.preventDefault() to handleAddToCart
  content = content.replace(
    /const handleAddToCart = \(e: React\.MouseEvent, product: DisplayProduct\) => \{\s*\n\s+e\.stopPropagation\(\);/g,
    'const handleAddToCart = (e: React.MouseEvent, product: DisplayProduct) => {\n    e.preventDefault();\n    e.stopPropagation();'
  );

  if (content !== original) {
    fs.writeFileSync(filepath, content, 'utf8');
    console.log('UPDATED: ' + file);
  } else {
    console.log('NO CHANGES: ' + file);
  }
}
