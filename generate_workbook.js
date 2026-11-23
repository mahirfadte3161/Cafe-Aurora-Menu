const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

async function createCafeAuroraWorkbook() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Cafe Aurora Technical Team';
  workbook.lastModifiedBy = 'Cafe Aurora Digital Menu System';
  workbook.created = new Date();
  workbook.modified = new Date();

  // Color Palette constants
  const TERRACOTTA = 'FFC05621'; // Warm Terracotta accent (#C05621)
  const MUTED_GREEN = 'FF4A7C59'; // Muted Green secondary (#4A7C59)
  const DARK_BROWN = 'FF382314'; // Dark Brown text (#382314)
  const CREAM_LIGHT = 'FFFDF8F3'; // Warm Cream tint
  const CREAM_ROW_ALT = 'FFF9F3EC'; // Subtle alternate row
  const WHITE = 'FFFFFFFF';
  const BORDER_GRAY = 'FFD4C5B9';

  // ==========================================
  // SHEET 1: READ ME / INSTRUCTIONS
  // ==========================================
  const readmeSheet = workbook.addWorksheet('Read Me', {
    properties: { tabColor: { argb: TERRACOTTA } },
    views: [{ showGridLines: true }]
  });

  readmeSheet.columns = [
    { width: 5 },
    { width: 28 },
    { width: 85 }
  ];

  // Title Block
  readmeSheet.mergeCells('B2:C2');
  const titleCell = readmeSheet.getCell('B2');
  titleCell.value = '☕ CAFÉ AURORA – DIGITAL MENU DATABASE SPECIFICATION';
  titleCell.font = { name: 'Arial', size: 16, bold: true, color: { argb: WHITE } };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: TERRACOTTA } };
  titleCell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
  readmeSheet.getRow(2).height = 40;

  // Subtitle / Overview
  readmeSheet.mergeCells('B3:C3');
  const subCell = readmeSheet.getCell('B3');
  subCell.value = 'Instructions, Data Structure & Owner Verification Guide for the QR Code Digital Menu';
  subCell.font = { name: 'Arial', size: 11, italic: true, color: { argb: DARK_BROWN } };
  subCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: CREAM_LIGHT } };
  subCell.alignment = { vertical: 'middle', indent: 1 };
  readmeSheet.getRow(3).height = 24;

  const readmeSections = [
    {
      section: '1. PURPOSE & ARCHITECTURE',
      rows: [
        ['System Role', 'This Google Sheets workbook is the Single Source of Truth for the Cafe Aurora Digital Menu website.'],
        ['Workflow', 'Owner edits this private spreadsheet → Vercel Serverless API reads data via Google Service Account (cached 30 mins) → Customer browses live menu by scanning QR code in the café.'],
        ['Display-Only Scope', 'This website is display-only (names, photos, descriptions, prices, availability). No online ordering, cart, or payments are included.'],
        ['Security Guarantee', 'Customers never see or edit this spreadsheet. Private URLs and credentials stay encrypted on the backend server.']
      ]
    },
    {
      section: '2. SPREADSHEET SHEETS (TABS)',
      rows: [
        ['Menu Tab', 'Contains all food items with multilingual names, descriptions, prices, image URLs, dietary indicators, availability, and display order.'],
        ['Categories Tab', 'Defines the menu sections (e.g., Rice & Biryani, Seafood, Meat Curries) with multilingual titles and display order.'],
        ['Read Me Tab', 'This reference guide for owner, chefs, translators, and developer operations.']
      ]
    },
    {
      section: '3. MENU SHEET COLUMNS GUIDE',
      rows: [
        ['Item_ID', 'Unique identifier (e.g., ITEM_001). Do not change once created as it tracks item identity.'],
        ['Category_ID', 'Must match an existing Category_ID from the Categories tab.'],
        ['Name_EN', 'English item name (Primary / Default).'],
        ['Name_HI', 'Hindi translation in Devanagari script (e.g., चिकन बिरयानी). Leave blank to fall back to English.'],
        ['Name_KOK_DEV', 'Konkani translation in Devanagari script (e.g., कोंकणी देवनागरी नांव). Leave blank to fall back to English.'],
        ['Name_KOK_ROM', 'Konkani translation in Roman script (e.g., Konkani Romi). Leave blank to fall back to English.'],
        ['Description_EN/HI/etc.', 'Short appetizing descriptions in each language. Leave blank if not yet written.'],
        ['Half_Price', 'Price for Half portion in ₹ (e.g., 220). Leave blank if item only has a Single price.'],
        ['Full_Price', 'Price for Full portion in ₹ (e.g., 350). Leave blank if item only has a Single price.'],
        ['Single_Price', 'Price for Standard/Single portion in ₹ (e.g., 200). Leave blank if item has Half/Full portions.'],
        ['Image_URL', 'Direct URL to food photo hosted on Cloudinary (e.g., https://res.cloudinary.com/...). Leave blank for auto placeholder.'],
        ['Availability', 'TRUE = In stock and ready to order; FALSE = Marked as "Currently Unavailable" with dimmed card (never removed).'],
        ['Food_Type', 'Dietary classification: Veg or Non-Veg. Enables the green/red indicator dot.'],
        ['Popular', 'TRUE = Highlighted in the top "Popular / Recommended" section on homepage; FALSE = Normal menu listing.'],
        ['Display_Order', 'Controls the sorting order of items inside their category on mobile screens (1, 2, 3...).'],
        ['Source_Notes', 'Editorial / transcription remarks and items awaiting owner confirmation.']
      ]
    },
    {
      section: '4. ITEMS EXTRACTED FROM MENU PHOTO – OWNER VERIFICATION REQUIRED',
      rows: [
        ['Item 5: Pork Vindalo', 'Photo has two price stickers: 220 and 450, but "(H/F)" is NOT explicitly printed next to the name. We inferred Half=220, Full=450. Please confirm if this is Half/Full or regular vs large portion.'],
        ['Item 10: Mackarel Recheado', 'Preserved verbatim photo spelling "Mackarel" (standard English is "Mackerel"). Confirm if preferred as spelled on board or standard spelling.'],
        ['Item 7: Chilly Fry', 'Listed on board as "Chilly Fry - Beef/ Chicken/ Sausage" for ₹400. Confirm if customers select meat type at table, or if you prefer 3 distinct menu items with their own photos.'],
        ['Item 15: Xacuti (H/F)', 'Listed as "Xacuti - Chicken/ Beef (H/F)" (220/400). Confirm if Chicken and Beef are both available at same price, or if they should be separate cards.'],
        ['Currency & Location', 'Prices are in Indian Rupees (₹). Default location Fontainhas, Panaji, Goa.'],
        ['Translations & Images', 'Hindi and Konkani fields, descriptions, and Cloudinary image URLs are currently blank and ready to be populated.']
      ]
    }
  ];

  let currentRow = 5;

  readmeSections.forEach((sec) => {
    readmeSheet.mergeCells(`B${currentRow}:C${currentRow}`);
    const secCell = readmeSheet.getCell(`B${currentRow}`);
    secCell.value = sec.section;
    secCell.font = { name: 'Arial', size: 12, bold: true, color: { argb: WHITE } };
    secCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: MUTED_GREEN } };
    secCell.alignment = { vertical: 'middle', indent: 1 };
    readmeSheet.getRow(currentRow).height = 28;
    currentRow++;

    sec.rows.forEach(([label, desc], idx) => {
      const row = readmeSheet.getRow(currentRow);
      row.getCell(2).value = label;
      row.getCell(3).value = desc;

      row.getCell(2).font = { name: 'Arial', size: 10, bold: true, color: { argb: DARK_BROWN } };
      row.getCell(3).font = { name: 'Arial', size: 10, color: { argb: DARK_BROWN } };

      const bg = idx % 2 === 0 ? CREAM_LIGHT : CREAM_ROW_ALT;
      row.getCell(2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
      row.getCell(3).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };

      row.getCell(2).alignment = { vertical: 'top', wrapText: true, indent: 1 };
      row.getCell(3).alignment = { vertical: 'top', wrapText: true };

      row.getCell(2).border = {
        top: { style: 'thin', color: { argb: BORDER_GRAY } },
        bottom: { style: 'thin', color: { argb: BORDER_GRAY } },
        left: { style: 'thin', color: { argb: BORDER_GRAY } },
        right: { style: 'thin', color: { argb: BORDER_GRAY } }
      };
      row.getCell(3).border = {
        top: { style: 'thin', color: { argb: BORDER_GRAY } },
        bottom: { style: 'thin', color: { argb: BORDER_GRAY } },
        left: { style: 'thin', color: { argb: BORDER_GRAY } },
        right: { style: 'thin', color: { argb: BORDER_GRAY } }
      };

      row.height = desc.length > 80 ? 34 : 24;
      currentRow++;
    });

    currentRow++; // spacing
  });


  // ==========================================
  // SHEET 2: MENU (15 Items from Photo)
  // ==========================================
  const menuSheet = workbook.addWorksheet('Menu', {
    properties: { tabColor: { argb: TERRACOTTA } },
    views: [{ state: 'frozen', ySplit: 1, showGridLines: true }]
  });

  const menuHeaders = [
    { key: 'Item_ID', header: 'Item_ID', width: 14 },
    { key: 'Category_ID', header: 'Category_ID', width: 20 },
    { key: 'Name_EN', header: 'Name_EN', width: 34 },
    { key: 'Name_HI', header: 'Name_HI', width: 24 },
    { key: 'Name_KOK_DEV', header: 'Name_KOK_DEV', width: 24 },
    { key: 'Name_KOK_ROM', header: 'Name_KOK_ROM', width: 24 },
    { key: 'Description_EN', header: 'Description_EN', width: 40 },
    { key: 'Description_HI', header: 'Description_HI', width: 30 },
    { key: 'Description_KOK_DEV', header: 'Description_KOK_DEV', width: 30 },
    { key: 'Description_KOK_ROM', header: 'Description_KOK_ROM', width: 30 },
    { key: 'Half_Price', header: 'Half_Price', width: 13 },
    { key: 'Full_Price', header: 'Full_Price', width: 13 },
    { key: 'Single_Price', header: 'Single_Price', width: 14 },
    { key: 'Image_URL', header: 'Image_URL', width: 32 },
    { key: 'Availability', header: 'Availability', width: 15 },
    { key: 'Food_Type', header: 'Food_Type', width: 14 },
    { key: 'Popular', header: 'Popular', width: 12 },
    { key: 'Display_Order', header: 'Display_Order', width: 15 },
    { key: 'Source_Notes', header: 'Source_Notes', width: 55 }
  ];

  menuSheet.columns = menuHeaders;
  menuSheet.getRow(1).height = 32;

  // Header styling
  menuSheet.getRow(1).eachCell((cell) => {
    cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: WHITE } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: TERRACOTTA } };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = {
      top: { style: 'medium', color: { argb: DARK_BROWN } },
      bottom: { style: 'medium', color: { argb: DARK_BROWN } },
      left: { style: 'thin', color: { argb: BORDER_GRAY } },
      right: { style: 'thin', color: { argb: BORDER_GRAY } }
    };
  });

  const menuItems = [
    {
      Item_ID: 'ITEM_001',
      Category_ID: 'CAT_RICE',
      Name_EN: 'Chicken Biryani (H/F)',
      Name_HI: '',
      Name_KOK_DEV: '',
      Name_KOK_ROM: '',
      Description_EN: '',
      Description_HI: '',
      Description_KOK_DEV: '',
      Description_KOK_ROM: '',
      Half_Price: 220,
      Full_Price: 350,
      Single_Price: null,
      Image_URL: '',
      Availability: true,
      Food_Type: 'Non-Veg',
      Popular: false,
      Display_Order: 1,
      Source_Notes: 'From photo. Explicit (H/F) label with stickers ₹220 / ₹350.'
    },
    {
      Item_ID: 'ITEM_002',
      Category_ID: 'CAT_RICE',
      Name_EN: 'Beef Biryani (H/F)',
      Name_HI: '',
      Name_KOK_DEV: '',
      Name_KOK_ROM: '',
      Description_EN: '',
      Description_HI: '',
      Description_KOK_DEV: '',
      Description_KOK_ROM: '',
      Half_Price: 220,
      Full_Price: 350,
      Single_Price: null,
      Image_URL: '',
      Availability: true,
      Food_Type: 'Non-Veg',
      Popular: false,
      Display_Order: 2,
      Source_Notes: 'From photo. Explicit (H/F) label with stickers ₹220 / ₹350.'
    },
    {
      Item_ID: 'ITEM_003',
      Category_ID: 'CAT_RICE',
      Name_EN: 'Plain Pulav (H/F)',
      Name_HI: '',
      Name_KOK_DEV: '',
      Name_KOK_ROM: '',
      Description_EN: '',
      Description_HI: '',
      Description_KOK_DEV: '',
      Description_KOK_ROM: '',
      Half_Price: 100,
      Full_Price: 200,
      Single_Price: null,
      Image_URL: '',
      Availability: true,
      Food_Type: 'Veg',
      Popular: false,
      Display_Order: 3,
      Source_Notes: 'From photo. Explicit (H/F) label with stickers ₹100 / ₹200. Classified as Veg.'
    },
    {
      Item_ID: 'ITEM_004',
      Category_ID: 'CAT_THALI',
      Name_EN: 'Fish Curry Rice',
      Name_HI: '',
      Name_KOK_DEV: '',
      Name_KOK_ROM: '',
      Description_EN: '',
      Description_HI: '',
      Description_KOK_DEV: '',
      Description_KOK_ROM: '',
      Half_Price: null,
      Full_Price: null,
      Single_Price: 200,
      Image_URL: '',
      Availability: true,
      Food_Type: 'Non-Veg',
      Popular: false,
      Display_Order: 4,
      Source_Notes: 'From photo. Single price sticker ₹200. Traditional Goan seafood staple.'
    },
    {
      Item_ID: 'ITEM_005',
      Category_ID: 'CAT_PORK_BEEF',
      Name_EN: 'Pork Vindalo',
      Name_HI: '',
      Name_KOK_DEV: '',
      Name_KOK_ROM: '',
      Description_EN: '',
      Description_HI: '',
      Description_KOK_DEV: '',
      Description_KOK_ROM: '',
      Half_Price: 220,
      Full_Price: 450,
      Single_Price: null,
      Image_URL: '',
      Availability: true,
      Food_Type: 'Non-Veg',
      Popular: false,
      Display_Order: 5,
      Source_Notes: 'Spelled "Pork Vindalo" on board. Two stickers: 220 & 450 without printed "(H/F)". Half/Full inferred; awaits owner verification.'
    },
    {
      Item_ID: 'ITEM_006',
      Category_ID: 'CAT_PORK_BEEF',
      Name_EN: 'Pork Sorpotel (H/F)',
      Name_HI: '',
      Name_KOK_DEV: '',
      Name_KOK_ROM: '',
      Description_EN: '',
      Description_HI: '',
      Description_KOK_DEV: '',
      Description_KOK_ROM: '',
      Half_Price: 220,
      Full_Price: 450,
      Single_Price: null,
      Image_URL: '',
      Availability: true,
      Food_Type: 'Non-Veg',
      Popular: false,
      Display_Order: 6,
      Source_Notes: 'From photo. Explicit (H/F) label with stickers ₹220 / ₹450. Classic Goan heritage delicacy.'
    },
    {
      Item_ID: 'ITEM_007',
      Category_ID: 'CAT_BITES',
      Name_EN: 'Chilly Fry - Beef/ Chicken/ Sausage',
      Name_HI: '',
      Name_KOK_DEV: '',
      Name_KOK_ROM: '',
      Description_EN: '',
      Description_HI: '',
      Description_KOK_DEV: '',
      Description_KOK_ROM: '',
      Half_Price: null,
      Full_Price: null,
      Single_Price: 400,
      Image_URL: '',
      Availability: true,
      Food_Type: 'Non-Veg',
      Popular: false,
      Display_Order: 7,
      Source_Notes: 'Single sticker ₹400. Board lists Beef / Chicken / Sausage choices. Awaits owner clarification if items should split.'
    },
    {
      Item_ID: 'ITEM_008',
      Category_ID: 'CAT_MEAT_SPECIALS',
      Name_EN: 'Chicken Liver Masala',
      Name_HI: '',
      Name_KOK_DEV: '',
      Name_KOK_ROM: '',
      Description_EN: '',
      Description_HI: '',
      Description_KOK_DEV: '',
      Description_KOK_ROM: '',
      Half_Price: null,
      Full_Price: null,
      Single_Price: 300,
      Image_URL: '',
      Availability: true,
      Food_Type: 'Non-Veg',
      Popular: false,
      Display_Order: 8,
      Source_Notes: 'From photo. Single price sticker ₹300.'
    },
    {
      Item_ID: 'ITEM_009',
      Category_ID: 'CAT_MEAT_SPECIALS',
      Name_EN: 'Chicken Cafreal',
      Name_HI: '',
      Name_KOK_DEV: '',
      Name_KOK_ROM: '',
      Description_EN: '',
      Description_HI: '',
      Description_KOK_DEV: '',
      Description_KOK_ROM: '',
      Half_Price: null,
      Full_Price: null,
      Single_Price: 320,
      Image_URL: '',
      Availability: true,
      Food_Type: 'Non-Veg',
      Popular: false,
      Display_Order: 9,
      Source_Notes: 'From photo. Single price sticker ₹320. Iconic Goan spiced green masala preparation.'
    },
    {
      Item_ID: 'ITEM_010',
      Category_ID: 'CAT_SEAFOOD',
      Name_EN: 'Mackarel Recheado',
      Name_HI: '',
      Name_KOK_DEV: '',
      Name_KOK_ROM: '',
      Description_EN: '',
      Description_HI: '',
      Description_KOK_DEV: '',
      Description_KOK_ROM: '',
      Half_Price: null,
      Full_Price: null,
      Single_Price: 150,
      Image_URL: '',
      Availability: true,
      Food_Type: 'Non-Veg',
      Popular: false,
      Display_Order: 10,
      Source_Notes: 'Spelled "Mackarel Recheado" on board (standard is Mackerel). Preserved until verified. Single price sticker ₹150.'
    },
    {
      Item_ID: 'ITEM_011',
      Category_ID: 'CAT_SEAFOOD',
      Name_EN: 'Prawns Masala/ Chilly/ Rawa',
      Name_HI: '',
      Name_KOK_DEV: '',
      Name_KOK_ROM: '',
      Description_EN: '',
      Description_HI: '',
      Description_KOK_DEV: '',
      Description_KOK_ROM: '',
      Half_Price: null,
      Full_Price: null,
      Single_Price: 400,
      Image_URL: '',
      Availability: true,
      Food_Type: 'Non-Veg',
      Popular: false,
      Display_Order: 11,
      Source_Notes: 'From photo. Single price sticker ₹400. Board lists choices of Masala, Chilly, or Rawa fry.'
    },
    {
      Item_ID: 'ITEM_012',
      Category_ID: 'CAT_SEAFOOD',
      Name_EN: 'Squids Masala / Chilly',
      Name_HI: '',
      Name_KOK_DEV: '',
      Name_KOK_ROM: '',
      Description_EN: '',
      Description_HI: '',
      Description_KOK_DEV: '',
      Description_KOK_ROM: '',
      Half_Price: null,
      Full_Price: null,
      Single_Price: 250,
      Image_URL: '',
      Availability: true,
      Food_Type: 'Non-Veg',
      Popular: false,
      Display_Order: 12,
      Source_Notes: 'From photo. Single price sticker ₹250 (bold black numeral). Listed with Masala / Chilly options.'
    },
    {
      Item_ID: 'ITEM_013',
      Category_ID: 'CAT_RICE',
      Name_EN: 'Sausage Pulav',
      Name_HI: '',
      Name_KOK_DEV: '',
      Name_KOK_ROM: '',
      Description_EN: '',
      Description_HI: '',
      Description_KOK_DEV: '',
      Description_KOK_ROM: '',
      Half_Price: null,
      Full_Price: null,
      Single_Price: 350,
      Image_URL: '',
      Availability: true,
      Food_Type: 'Non-Veg',
      Popular: false,
      Display_Order: 13,
      Source_Notes: 'From photo. Single price sticker ₹350. Authentic Goan Chouriço sausage pulav.'
    },
    {
      Item_ID: 'ITEM_014',
      Category_ID: 'CAT_PORK_BEEF',
      Name_EN: 'Roast Beef',
      Name_HI: '',
      Name_KOK_DEV: '',
      Name_KOK_ROM: '',
      Description_EN: '',
      Description_HI: '',
      Description_KOK_DEV: '',
      Description_KOK_ROM: '',
      Half_Price: null,
      Full_Price: null,
      Single_Price: 400,
      Image_URL: '',
      Availability: true,
      Food_Type: 'Non-Veg',
      Popular: false,
      Display_Order: 14,
      Source_Notes: 'From photo. Single price sticker ₹400.'
    },
    {
      Item_ID: 'ITEM_015',
      Category_ID: 'CAT_MEAT_SPECIALS',
      Name_EN: 'Xacuti - Chicken/ Beef (H/F)',
      Name_HI: '',
      Name_KOK_DEV: '',
      Name_KOK_ROM: '',
      Description_EN: '',
      Description_HI: '',
      Description_KOK_DEV: '',
      Description_KOK_ROM: '',
      Half_Price: 220,
      Full_Price: 400,
      Single_Price: null,
      Image_URL: '',
      Availability: true,
      Food_Type: 'Non-Veg',
      Popular: false,
      Display_Order: 15,
      Source_Notes: 'From photo. Explicit (H/F) label with stickers ₹220 / ₹400. Listed with choice of Chicken or Beef.'
    }
  ];

  menuItems.forEach((item, index) => {
    const row = menuSheet.addRow(item);
    row.height = 24;
    const bg = index % 2 === 0 ? CREAM_LIGHT : CREAM_ROW_ALT;

    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      cell.font = { name: 'Arial', size: 9.5, color: { argb: DARK_BROWN } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
      cell.border = {
        top: { style: 'thin', color: { argb: BORDER_GRAY } },
        bottom: { style: 'thin', color: { argb: BORDER_GRAY } },
        left: { style: 'thin', color: { argb: BORDER_GRAY } },
        right: { style: 'thin', color: { argb: BORDER_GRAY } }
      };

      // Alignment rules
      const headerKey = menuHeaders[colNumber - 1].key;
      if (['Half_Price', 'Full_Price', 'Single_Price', 'Display_Order'].includes(headerKey)) {
        cell.alignment = { vertical: 'middle', horizontal: 'right' };
        if (typeof cell.value === 'number') {
          cell.numFmt = headerKey === 'Display_Order' ? '#,##0' : '₹#,##0';
        }
      } else if (['Item_ID', 'Category_ID', 'Availability', 'Food_Type', 'Popular'].includes(headerKey)) {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      } else {
        cell.alignment = { vertical: 'middle', horizontal: 'left' };
      }
    });
  });


  // ==========================================
  // SHEET 3: CATEGORIES
  // ==========================================
  const catSheet = workbook.addWorksheet('Categories', {
    properties: { tabColor: { argb: MUTED_GREEN } },
    views: [{ state: 'frozen', ySplit: 1, showGridLines: true }]
  });

  const catHeaders = [
    { key: 'Category_ID', header: 'Category_ID', width: 22 },
    { key: 'Name_EN', header: 'Name_EN', width: 34 },
    { key: 'Name_HI', header: 'Name_HI', width: 26 },
    { key: 'Name_KOK_DEV', header: 'Name_KOK_DEV', width: 26 },
    { key: 'Name_KOK_ROM', header: 'Name_KOK_ROM', width: 26 },
    { key: 'Display_Order', header: 'Display_Order', width: 16 }
  ];

  catSheet.columns = catHeaders;
  catSheet.getRow(1).height = 32;

  catSheet.getRow(1).eachCell((cell) => {
    cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: WHITE } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: MUTED_GREEN } };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = {
      top: { style: 'medium', color: { argb: DARK_BROWN } },
      bottom: { style: 'medium', color: { argb: DARK_BROWN } },
      left: { style: 'thin', color: { argb: BORDER_GRAY } },
      right: { style: 'thin', color: { argb: BORDER_GRAY } }
    };
  });

  const categories = [
    {
      Category_ID: 'CAT_RICE',
      Name_EN: 'Biryani & Pulav',
      Name_HI: '',
      Name_KOK_DEV: '',
      Name_KOK_ROM: '',
      Display_Order: 1
    },
    {
      Category_ID: 'CAT_THALI',
      Name_EN: 'Goan Thali & Rice Meals',
      Name_HI: '',
      Name_KOK_DEV: '',
      Name_KOK_ROM: '',
      Display_Order: 2
    },
    {
      Category_ID: 'CAT_SEAFOOD',
      Name_EN: 'Goan Seafood Specials',
      Name_HI: '',
      Name_KOK_DEV: '',
      Name_KOK_ROM: '',
      Display_Order: 3
    },
    {
      Category_ID: 'CAT_MEAT_SPECIALS',
      Name_EN: 'Goan Curries & Cafreal',
      Name_HI: '',
      Name_KOK_DEV: '',
      Name_KOK_ROM: '',
      Display_Order: 4
    },
    {
      Category_ID: 'CAT_PORK_BEEF',
      Name_EN: 'Pork & Beef Delicacies',
      Name_HI: '',
      Name_KOK_DEV: '',
      Name_KOK_ROM: '',
      Display_Order: 5
    },
    {
      Category_ID: 'CAT_BITES',
      Name_EN: 'Chilly Fry & Quick Bites',
      Name_HI: '',
      Name_KOK_DEV: '',
      Name_KOK_ROM: '',
      Display_Order: 6
    }
  ];

  categories.forEach((cat, index) => {
    const row = catSheet.addRow(cat);
    row.height = 24;
    const bg = index % 2 === 0 ? CREAM_LIGHT : CREAM_ROW_ALT;

    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      cell.font = { name: 'Arial', size: 9.5, color: { argb: DARK_BROWN } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
      cell.border = {
        top: { style: 'thin', color: { argb: BORDER_GRAY } },
        bottom: { style: 'thin', color: { argb: BORDER_GRAY } },
        left: { style: 'thin', color: { argb: BORDER_GRAY } },
        right: { style: 'thin', color: { argb: BORDER_GRAY } }
      };

      const headerKey = catHeaders[colNumber - 1].key;
      if (headerKey === 'Display_Order') {
        cell.alignment = { vertical: 'middle', horizontal: 'right' };
        cell.numFmt = '#,##0';
      } else if (headerKey === 'Category_ID') {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      } else {
        cell.alignment = { vertical: 'middle', horizontal: 'left' };
      }
    });
  });

  // Target paths
  const outputPath = path.resolve(__dirname, 'Cafe_Aurora_Menu_Database.xlsx');
  const artifactDir = 'C:\\Users\\mahir\\.gemini\\antigravity\\brain\\8510ae93-de26-4709-82e3-48a8fb4eb9f4';
  const artifactPath = path.join(artifactDir, 'Cafe_Aurora_Menu_Database.xlsx');

  await workbook.xlsx.writeFile(outputPath);
  console.log(`Saved workbook to project root: ${outputPath}`);

  if (fs.existsSync(artifactDir)) {
    await workbook.xlsx.writeFile(artifactPath);
    console.log(`Saved workbook copy to artifact directory: ${artifactPath}`);
  }

  return { outputPath, artifactPath };
}

createCafeAuroraWorkbook()
  .then(() => console.log('Workbook created successfully!'))
  .catch((err) => {
    console.error('Error creating workbook:', err);
    process.exit(1);
  });
