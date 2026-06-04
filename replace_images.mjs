import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const mapping = [
  ['https://cdn.shopify.com/s/files/1/0950/7392/7538/collections/Chat-GPT-Image-Apr-15-2026-03-58-42-PM_4b5fd768-7cd5-41d5-95bf-a8e2aa58523e.png', '/images/collections/chat-gpt-image-apr-15-2026.png'],
  ['https://cdn.shopify.com/s/files/1/0950/7392/7538/collections/ChatGPT_20Image_20Apr_2016_202026_2005_27_27_20PM_5590c39d-3612-44eb-9dc9-00a747f7a593.png', '/images/collections/cabinet-humidors-hero.png'],
  ['https://cdn.shopify.com/s/files/1/0950/7392/7538/collections/ChatGPT_20Image_20Apr_2016_202026_2005_27_27_20PM_a49256d8-5931-453f-be44-8d33853ae843.png', '/images/collections/electronic-humidors-hero.png'],
  ['https://cdn.shopify.com/s/files/1/0950/7392/7538/collections/Gemini_Generated_Image_kb1oj6kb1oj6kb1o_0c77e364-831a-459f-9d43-be7b388ae4dc.png', '/images/collections/accessories-hero.png'],
  ['https://cdn.shopify.com/s/files/1/0950/7392/7538/files/1_1.jpg', '/images/products/1_1.jpg'],
  ['https://cdn.shopify.com/s/files/1/0950/7392/7538/files/CT48A-silver.jpg', '/images/products/CT48A-silver.jpg'],
  ['https://cdn.shopify.com/s/files/1/0950/7392/7538/files/ChatGPT_Image_Apr_24_2026_01_29_33_PM.png', '/images/collections/collections-banner.png'],
  ['https://cdn.shopify.com/s/files/1/0950/7392/7538/files/Franklin_acrylic_display_cigar_humidor_with_clear_body_and_humidifier.jpg', '/images/products/franklin-acrylic-display-humidor.jpg'],
  ['https://cdn.shopify.com/s/files/1/0950/7392/7538/files/Humidor_Supreme_Traveler_5_travel_cigar_humidor_holding_8_12_cigars.png', '/images/products/humidor-supreme-traveler-5.png'],
  ['https://cdn.shopify.com/s/files/1/0950/7392/7538/files/Humidor_Supreme_Traveller_20_Slim_travel_cigar_case_with_XIKAR_Boveda_60G_RH_packs.png', '/images/products/humidor-supreme-traveller-20.png'],
  ['https://cdn.shopify.com/s/files/1/0950/7392/7538/files/Manhattan_brown_leather_humidor_with_zipper_closure_for_cigars_up_to_7_inches.jpg', '/images/products/manhattan-brown-leather-humidor.jpg'],
  ['https://cdn.shopify.com/s/files/1/0950/7392/7538/files/Marciano_250-cigar_countertop_display_humidor_with_Spanish_cedar_trays.jpg', '/images/products/marciano-250-countertop-display.jpg'],
  ['https://cdn.shopify.com/s/files/1/0950/7392/7538/files/Modena_cherry_finish_humidor_21.5x10x7_inches_perfect_for_countertop_display.jpg', '/images/products/modena-cherry-finish-humidor.jpg'],
  ['https://cdn.shopify.com/s/files/1/0950/7392/7538/files/Novelist_brown_leather_book_style_travel_cigar_humidor_with_cutter_and_hygrometer.jpg', '/images/products/novelist-brown-leather-book-style-humidor.jpg'],
  ['https://cdn.shopify.com/s/files/1/0950/7392/7538/files/Portable_Manhattan_travel_humidor_holding_4_8_cigars_up_to_7_inches.jpg', '/images/products/portable-manhattan-travel-humidor.jpg'],
  ['https://cdn.shopify.com/s/files/1/0950/7392/7538/files/Portable_cigar_humidor_with_built_in_humidifier_and_XIKAR_Boveda_60G_RH_packs.png', '/images/products/portable-cigar-humidor-boveda.png'],
  ['https://cdn.shopify.com/s/files/1/0950/7392/7538/files/Santiago_700_cigar_end_table_humidor_with_walnut_finish_and_beveled_glass_top.jpg', '/images/products/santiago-700-end-table-humidor.jpg'],
  ['https://cdn.shopify.com/s/files/1/0950/7392/7538/files/Traveler_10_cigar_humidor_with_Spanish_cedar_interior_and_Boveda_60G_RH_seasoning_packs.png', '/images/products/traveler-10-cigar-humidor.png'],
  ['https://cdn.shopify.com/s/files/1/0950/7392/7538/files/c28eff7e15a7f40ecba3853c6731fb2c.jpg', '/images/products/c28eff7e15a7f40ecba3853c6731fb2c.jpg'],
  ['https://cdn.shopify.com/s/files/1/0950/7392/7538/files/chalet-black-glass-top-cigar-humidor.jpg', '/images/products/chalet-black-glass-top-humidor.jpg'],
  ['https://cdn.shopify.com/s/files/1/0950/7392/7538/files/chalet-cherry-desktop-cigar-humidor.jpg', '/images/products/chalet-cherry-desktop-humidor.jpg'],
  ['https://cdn.shopify.com/s/files/1/0950/7392/7538/files/chalet-glasstop-black-desktop-cigar-humidor.jpg', '/images/products/chalet-glasstop-black-desktop-humidor.jpg'],
  ['https://cdn.shopify.com/s/files/1/0950/7392/7538/files/chalet-glasstop-cherry-desktop-cigar-humidor.jpg', '/images/products/chalet-glasstop-cherry-desktop-humidor.jpg'],
  ['https://cdn.shopify.com/s/files/1/0950/7392/7538/files/chateau-glasstop-cherry-cigar-humidor.jpg', '/images/products/chateau-glasstop-cherry-humidor.jpg'],
  ['https://cdn.shopify.com/s/files/1/0950/7392/7538/files/duke-routed-edge-desktop-cigar-humidor.jpg', '/images/products/duke-routed-edge-desktop-humidor.jpg'],
  ['https://cdn.shopify.com/s/files/1/0950/7392/7538/files/e1c939f2e749e72ea7323ff5cf6f9c1f.jpg', '/images/products/e1c939f2e749e72ea7323ff5cf6f9c1f.jpg'],
  ['https://cdn.shopify.com/s/files/1/0950/7392/7538/files/portable_6-cigar_PVC_leather_travel_humidor_with_slide-out_beds.jpg', '/images/products/portable-6-cigar-pvc-leather-humidor.jpg'],
  ['https://cdn.shopify.com/s/files/1/0950/7392/7538/files/raching-cs600-luxury-cigar-humidor-cabinet.jpg', '/images/products/raching-cs600-luxury-cigar-humidor-cabinet.jpg'],
  ['https://cdn.shopify.com/s/files/1/0950/7392/7538/files/raching-sd800-dual-zone-cigar-wine-cabinet.jpg', '/images/products/raching-sd800-dual-zone-cigar-wine-cabinet.jpg'],
  ['https://cdn.shopify.com/s/files/1/0950/7392/7538/files/vizcaya-ebony-desktop-cigar-humidor.jpg', '/images/products/vizcaya-ebony-desktop-humidor.jpg'],
  ['https://cdn.shopify.com/s/files/1/0950/7392/7538/files/vizcaya-makorem-pommele-desktop-cigar-humidor.jpg', '/images/products/vizcaya-makorem-pommele-desktop-humidor.jpg'],
];

function walk(dir) {
  const results = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) results.push(...walk(full));
    else if (item.name.endsWith('.tsx')) results.push(full);
  }
  return results;
}

const files = walk(path.join(__dirname, 'src'));
let totalReplacements = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let modified = false;
  for (const [from, to] of mapping) {
    let idx = content.indexOf(from);
    while (idx !== -1) {
      content = content.substring(0, idx) + to + content.substring(idx + from.length);
      totalReplacements++;
      modified = true;
      idx = content.indexOf(from);
    }
  }
  if (modified) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated: ' + file);
  }
}

console.log('Total replacements: ' + totalReplacements);

// Create placeholder .gitkeep in image directories
const dirs = [...new Set(mapping.map(([,to]) => to).map(p => path.dirname(path.join(__dirname, 'public', p.replace(/^\/images\//, 'images/')))))];
for (const d of dirs) {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  fs.writeFileSync(path.join(d, '.gitkeep'), '', 'utf8');
  console.log('Created: ' + d);
}
