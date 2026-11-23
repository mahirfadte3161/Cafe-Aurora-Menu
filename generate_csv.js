const fs = require('fs');
const path = require('path');

const dataDir = path.resolve(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Menu CSV
const menuHeaders = [
  'Item_ID', 'Category_ID',
  'Name_EN', 'Name_HI', 'Name_KOK_DEV', 'Name_KOK_ROM',
  'Description_EN', 'Description_HI', 'Description_KOK_DEV', 'Description_KOK_ROM',
  'Half_Price', 'Full_Price', 'Single_Price',
  'Image_URL', 'Availability', 'Food_Type', 'Popular', 'Display_Order'
];

const menuRows = [
  ['ITEM_001', 'CAT_RICE', 'Chicken Biryani (H/F)', '', '', '', '', '', '', '', '220', '350', '', '', 'TRUE', 'Non-Veg', 'FALSE', '1'],
  ['ITEM_002', 'CAT_RICE', 'Beef Biryani (H/F)', '', '', '', '', '', '', '', '220', '350', '', '', 'TRUE', 'Non-Veg', 'FALSE', '2'],
  ['ITEM_003', 'CAT_RICE', 'Plain Pulav (H/F)', '', '', '', '', '', '', '', '100', '200', '', '', 'TRUE', 'Veg', 'FALSE', '3'],
  ['ITEM_004', 'CAT_THALI', 'Fish Curry Rice', '', '', '', '', '', '', '', '', '', '200', '', 'TRUE', 'Non-Veg', 'FALSE', '4'],
  ['ITEM_005', 'CAT_PORK_BEEF', 'Pork Vindalo', '', '', '', '', '', '', '', '220', '450', '', '', 'TRUE', 'Non-Veg', 'FALSE', '5'],
  ['ITEM_006', 'CAT_PORK_BEEF', 'Pork Sorpotel (H/F)', '', '', '', '', '', '', '', '220', '450', '', '', 'TRUE', 'Non-Veg', 'FALSE', '6'],
  ['ITEM_007', 'CAT_BITES', 'Chilly Fry - Beef/ Chicken/ Sausage', '', '', '', '', '', '', '', '', '', '400', '', 'TRUE', 'Non-Veg', 'FALSE', '7'],
  ['ITEM_008', 'CAT_MEAT_SPECIALS', 'Chicken Liver Masala', '', '', '', '', '', '', '', '', '', '300', '', 'TRUE', 'Non-Veg', 'FALSE', '8'],
  ['ITEM_009', 'CAT_MEAT_SPECIALS', 'Chicken Cafreal', '', '', '', '', '', '', '', '', '', '320', '', 'TRUE', 'Non-Veg', 'FALSE', '9'],
  ['ITEM_010', 'CAT_SEAFOOD', 'Mackarel Recheado', '', '', '', '', '', '', '', '', '', '150', '', 'TRUE', 'Non-Veg', 'FALSE', '10'],
  ['ITEM_011', 'CAT_SEAFOOD', 'Prawns Masala/ Chilly/ Rawa', '', '', '', '', '', '', '', '', '', '400', '', 'TRUE', 'Non-Veg', 'FALSE', '11'],
  ['ITEM_012', 'CAT_SEAFOOD', 'Squids Masala / Chilly', '', '', '', '', '', '', '', '', '', '250', '', 'TRUE', 'Non-Veg', 'FALSE', '12'],
  ['ITEM_013', 'CAT_RICE', 'Sausage Pulav', '', '', '', '', '', '', '', '', '', '350', '', 'TRUE', 'Non-Veg', 'FALSE', '13'],
  ['ITEM_014', 'CAT_PORK_BEEF', 'Roast Beef', '', '', '', '', '', '', '', '', '', '400', '', 'TRUE', 'Non-Veg', 'FALSE', '14'],
  ['ITEM_015', 'CAT_MEAT_SPECIALS', 'Xacuti - Chicken/ Beef (H/F)', '', '', '', '', '', '', '', '220', '400', '', '', 'TRUE', 'Non-Veg', 'FALSE', '15']
];

const menuCsvContent = [
  menuHeaders.join(','),
  ...menuRows.map(row => row.map(val => `"${val.replace(/"/g, '""')}"`).join(','))
].join('\n');

fs.writeFileSync(path.join(dataDir, 'menu.csv'), menuCsvContent, 'utf8');

// Categories CSV
const catHeaders = ['Category_ID', 'Name_EN', 'Name_HI', 'Name_KOK_DEV', 'Name_KOK_ROM', 'Display_Order'];
const catRows = [
  ['CAT_RICE', 'Biryani & Pulav', '', '', '', '1'],
  ['CAT_THALI', 'Goan Thali & Rice Meals', '', '', '', '2'],
  ['CAT_SEAFOOD', 'Goan Seafood Specials', '', '', '', '3'],
  ['CAT_MEAT_SPECIALS', 'Goan Curries & Cafreal', '', '', '', '4'],
  ['CAT_PORK_BEEF', 'Pork & Beef Delicacies', '', '', '', '5'],
  ['CAT_BITES', 'Chilly Fry & Quick Bites', '', '', '', '6']
];

const catCsvContent = [
  catHeaders.join(','),
  ...catRows.map(row => row.map(val => `"${val.replace(/"/g, '""')}"`).join(','))
].join('\n');

fs.writeFileSync(path.join(dataDir, 'categories.csv'), catCsvContent, 'utf8');

console.log('CSVs generated in data/ folder successfully.');
