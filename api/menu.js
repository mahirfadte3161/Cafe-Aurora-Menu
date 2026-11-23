import { google } from 'googleapis';

// Fallback sample data in case environment variables are missing during local dev
const FALLBACK_CATEGORIES = [
  { Category_ID: 'CAT_RICE', Name_EN: 'Biryani & Pulav', Name_HI: 'बिरयानी और पुलाव', Name_KOK_DEV: 'बिर्याणी आनी पुलाव', Name_KOK_ROM: 'Biryani ani Pulav', Display_Order: 1 },
  { Category_ID: 'CAT_THALI', Name_EN: 'Goan Thali & Rice', Name_HI: 'गोवा थाली और चावल', Name_KOK_DEV: 'गोंयचें थाळी आनी शीत', Name_KOK_ROM: 'Goenchim Thali ani Xit', Display_Order: 2 },
  { Category_ID: 'CAT_SEAFOOD', Name_EN: 'Goan Seafood', Name_HI: 'गोवा समुद्री भोजन', Name_KOK_DEV: 'गोंयचें नुस्ते', Name_KOK_ROM: 'Goenchem Nuste', Display_Order: 3 },
  { Category_ID: 'CAT_MEAT_SPECIALS', Name_EN: 'Curries & Cafreal', Name_HI: 'कढ़ी और काफ्रियल', Name_KOK_DEV: 'कडी आनी काफ्रयाल', Name_KOK_ROM: 'Kodi ani Cafreal', Display_Order: 4 },
  { Category_ID: 'CAT_PORK_BEEF', Name_EN: 'Pork & Beef Delights', Name_HI: 'पोर्क और बीफ विशेषताएं', Name_KOK_DEV: 'डुकराचे आनी बीफ रुचिक जेवण', Name_KOK_ROM: 'Dukrachem ani Beef Ruchik Jevon', Display_Order: 5 },
  { Category_ID: 'CAT_BITES', Name_EN: 'Chilly Fry & Bites', Name_HI: 'चिली फ्राई और स्नैक्स', Name_KOK_DEV: 'मिरसांग फ्राय आनी खावचें', Name_KOK_ROM: 'Mirsang Fry ani Khawchem', Display_Order: 6 }
];

const FALLBACK_MENU = [
  { Item_ID: 'ITEM_001', Category_ID: 'CAT_RICE', Name_EN: 'Chicken Biryani (H/F)', Name_HI: 'चिकन बिरयानी', Name_KOK_DEV: 'कोंबयेची बिर्याणी', Name_KOK_ROM: 'Kombiyechi Biryani', Description_EN: 'Fragrant basmati rice slow-cooked with tender chicken and coastal spices.', Half_Price: 220, Full_Price: 350, Single_Price: null, Image_URL: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80', Availability: true, Food_Type: 'Non-Veg', Popular: true, Display_Order: 1 },
  { Item_ID: 'ITEM_002', Category_ID: 'CAT_RICE', Name_EN: 'Beef Biryani (H/F)', Name_HI: 'बीफ बिरयानी', Name_KOK_DEV: 'बीफ बिर्याणी', Name_KOK_ROM: 'Beef Biryani', Description_EN: 'Traditional Goan spiced beef layered with caramelized onions and aromatic rice.', Half_Price: 220, Full_Price: 350, Single_Price: null, Image_URL: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80', Availability: true, Food_Type: 'Non-Veg', Popular: false, Display_Order: 2 },
  { Item_ID: 'ITEM_003', Category_ID: 'CAT_RICE', Name_EN: 'Plain Pulav (H/F)', Name_HI: 'सादा पुलाव', Name_KOK_DEV: 'सादो पुलाव', Name_KOK_ROM: 'Sado Pulav', Description_EN: 'Delicately tempered basmati rice with whole Goan spices, bay leaf, and ghee.', Half_Price: 100, Full_Price: 200, Single_Price: null, Image_URL: 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?auto=format&fit=crop&w=600&q=80', Availability: true, Food_Type: 'Veg', Popular: false, Display_Order: 3 },
  { Item_ID: 'ITEM_004', Category_ID: 'CAT_THALI', Name_EN: 'Fish Curry Rice', Name_HI: 'फिश करी राइस', Name_KOK_DEV: 'नुस्ते कडी शीत', Name_KOK_ROM: 'Nustem Kodi Xit', Description_EN: 'The quintessential Goan staple: fresh fish in tangy coconut and kokum curry with steaming rice.', Half_Price: null, Full_Price: null, Single_Price: 200, Image_URL: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80', Availability: true, Food_Type: 'Non-Veg', Popular: true, Display_Order: 4 },
  { Item_ID: 'ITEM_005', Category_ID: 'CAT_PORK_BEEF', Name_EN: 'Pork Vindalo', Name_HI: 'पोर्क विंदालू', Name_KOK_DEV: 'डुकराचें विंदालू', Name_KOK_ROM: 'Dukrachem Vindalho', Description_EN: 'Portuguese-influenced pork braised in fiery Kashmiri chilies, garlic, and toddy vinegar.', Half_Price: 220, Full_Price: 450, Single_Price: null, Image_URL: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80', Availability: true, Food_Type: 'Non-Veg', Popular: true, Display_Order: 5 },
  { Item_ID: 'ITEM_006', Category_ID: 'CAT_PORK_BEEF', Name_EN: 'Pork Sorpotel (H/F)', Name_HI: 'पोर्क सोरपोतेल', Name_KOK_DEV: 'डुकराचें सोरपोतेल', Name_KOK_ROM: 'Dukrachem Sorpotel', Description_EN: 'Celebratory Goan Catholic stew simmered with local spices, vinegar, and deep rich flavors.', Half_Price: 220, Full_Price: 450, Single_Price: null, Image_URL: 'https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=600&q=80', Availability: true, Food_Type: 'Non-Veg', Popular: true, Display_Order: 6 },
  { Item_ID: 'ITEM_007', Category_ID: 'CAT_BITES', Name_EN: 'Chilly Fry - Beef/ Chicken/ Sausage', Name_HI: 'चिली फ्राई', Name_KOK_DEV: 'मिरसांग फ्राय', Name_KOK_ROM: 'Chilly Fry', Description_EN: 'Wok-tossed with crisp onions, crunchy capsicum, and green chilies. Choose meat at table.', Half_Price: null, Full_Price: null, Single_Price: 400, Image_URL: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80', Availability: true, Food_Type: 'Non-Veg', Popular: false, Display_Order: 7 },
  { Item_ID: 'ITEM_008', Category_ID: 'CAT_MEAT_SPECIALS', Name_EN: 'Chicken Liver Masala', Name_HI: 'चिकन लिवर मसाला', Name_KOK_DEV: 'चिकन काळीज मसाला', Name_KOK_ROM: 'Chicken Kaliz Masala', Description_EN: 'Tender chicken liver in a thick brown gravy of roasted onions and pepper.', Half_Price: null, Full_Price: null, Single_Price: 300, Image_URL: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80', Availability: true, Food_Type: 'Non-Veg', Popular: false, Display_Order: 8 },
  { Item_ID: 'ITEM_009', Category_ID: 'CAT_MEAT_SPECIALS', Name_EN: 'Chicken Cafreal', Name_HI: 'चिकन काफ्रियल', Name_KOK_DEV: 'चिकन काफ्रयाल', Name_KOK_ROM: 'Chicken Cafreal', Description_EN: 'Legendary green roast: chicken marinated in coriander, mint, green chilies, and rum.', Half_Price: null, Full_Price: null, Single_Price: 320, Image_URL: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=600&q=80', Availability: true, Food_Type: 'Non-Veg', Popular: true, Display_Order: 9 },
  { Item_ID: 'ITEM_010', Category_ID: 'CAT_SEAFOOD', Name_EN: 'Mackarel Recheado', Name_HI: 'मैकरेल रेचेयाडो', Name_KOK_DEV: 'बांगडो रेचेयाद', Name_KOK_ROM: 'Bangdo Recheado', Description_EN: 'Whole fresh mackerel stuffed with fiery red chili, garlic and toddy vinegar Recheado paste.', Half_Price: null, Full_Price: null, Single_Price: 150, Image_URL: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80', Availability: true, Food_Type: 'Non-Veg', Popular: true, Display_Order: 10 },
  { Item_ID: 'ITEM_011', Category_ID: 'CAT_SEAFOOD', Name_EN: 'Prawns Masala/ Chilly/ Rawa', Name_HI: 'प्रॉन्स मसाला/ चिली/ रवा फ्राई', Name_KOK_DEV: 'सुंगटां मसाला/ मिरसांग/ रवा', Name_KOK_ROM: 'Sungtam Masala/ Chilly/ Rawa', Description_EN: 'Local ocean prawns cooked your way: thick spicy coconut masala, chilly fry, or rawa crusted.', Half_Price: null, Full_Price: null, Single_Price: 400, Image_URL: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=600&q=80', Availability: true, Food_Type: 'Non-Veg', Popular: true, Display_Order: 11 },
  { Item_ID: 'ITEM_012', Category_ID: 'CAT_SEAFOOD', Name_EN: 'Squids Masala / Chilly', Name_HI: 'स्क्विड मसाला / चिली', Name_KOK_DEV: 'मांक्यो मसाला / मिरसांग', Name_KOK_ROM: 'Mankyo Masala / Chilly', Description_EN: 'Ocean squids simmered in piquant red Goan masala or stir-fried with onion & chili rings.', Half_Price: null, Full_Price: null, Single_Price: 250, Image_URL: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=600&q=80', Availability: true, Food_Type: 'Non-Veg', Popular: false, Display_Order: 12 },
  { Item_ID: 'ITEM_013', Category_ID: 'CAT_RICE', Name_EN: 'Sausage Pulav', Name_HI: 'सॉसेज पुलाव', Name_KOK_DEV: 'गोंयच्या सोसेजाचो पुलाव', Name_KOK_ROM: 'Goan Sausage Pulav', Description_EN: 'Spicy, tangy cured Goan pork sausages (chouriço) cooked with onions, potatoes, and rice.', Half_Price: null, Full_Price: null, Single_Price: 350, Image_URL: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80', Availability: true, Food_Type: 'Non-Veg', Popular: true, Display_Order: 13 },
  { Item_ID: 'ITEM_014', Category_ID: 'CAT_PORK_BEEF', Name_EN: 'Roast Beef', Name_HI: 'रोस्ट बीफ', Name_KOK_DEV: 'भाजिल्लें बीफ', Name_KOK_ROM: 'Bhojlolo Beef Roast', Description_EN: 'Slow-roasted beef sliced and served with a rich caramelized onion pepper gravy.', Half_Price: null, Full_Price: null, Single_Price: 400, Image_URL: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=600&q=80', Availability: true, Food_Type: 'Non-Veg', Popular: false, Display_Order: 14 },
  { Item_ID: 'ITEM_015', Category_ID: 'CAT_MEAT_SPECIALS', Name_EN: 'Xacuti - Chicken/ Beef (H/F)', Name_HI: 'शाकूती - चिकन/ बीफ', Name_KOK_DEV: 'शाकुती - चिकन/ बीफ', Name_KOK_ROM: 'Xacuti - Chicken/ Beef', Description_EN: 'Complex Goan curry featuring freshly roasted grated coconut, poppy seeds, and toasted spices.', Half_Price: 220, Full_Price: 400, Single_Price: null, Image_URL: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=600&q=80', Availability: true, Food_Type: 'Non-Veg', Popular: true, Display_Order: 15 }
];

function parseRows(rows) {
  if (!rows || rows.length < 2) return [];
  const headers = rows[0].map(h => String(h || '').trim());
  return rows.slice(1).map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index] !== undefined ? String(row[index]).trim() : '';
    });
    return obj;
  });
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 30 minutes cache header for Vercel Edge/Serverless CDN
  res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=300');

  const sheetsId = process.env.GOOGLE_SHEETS_ID;
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;

  // Check if Google credentials are configured
  if (!sheetsId || !clientEmail || !privateKey) {
    return res.status(200).json({
      success: true,
      menu: FALLBACK_MENU,
      categories: FALLBACK_CATEGORIES,
      timestamp: Date.now(),
      source: 'development_fallback',
      message: 'Running in development preview mode. Provide GOOGLE_SHEETS_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY in .env.local or Vercel dashboard to synchronize live Google Sheets data.'
    });
  }

  try {
    // Unescape newlines in private key if passed as single-line string
    if (privateKey.includes('\\n')) {
      privateKey = privateKey.replace(/\\n/g, '\n');
    }

    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Fetch both tabs in parallel
    const [menuResponse, categoriesResponse] = await Promise.all([
      sheets.spreadsheets.values.get({
        spreadsheetId: sheetsId,
        range: 'Menu!A1:S',
      }),
      sheets.spreadsheets.values.get({
        spreadsheetId: sheetsId,
        range: 'Categories!A1:F',
      })
    ]);

    const rawMenu = parseRows(menuResponse.data.values);
    const rawCategories = parseRows(categoriesResponse.data.values);

    // Normalize Menu
    const normalizedMenu = rawMenu.map(item => ({
      Item_ID: item.Item_ID || '',
      Category_ID: item.Category_ID || '',
      Name_EN: item.Name_EN || '',
      Name_HI: item.Name_HI || '',
      Name_KOK_DEV: item.Name_KOK_DEV || '',
      Name_KOK_ROM: item.Name_KOK_ROM || '',
      Description_EN: item.Description_EN || '',
      Description_HI: item.Description_HI || '',
      Description_KOK_DEV: item.Description_KOK_DEV || '',
      Description_KOK_ROM: item.Description_KOK_ROM || '',
      Half_Price: item.Half_Price ? parseFloat(item.Half_Price.replace(/[^0-9.]/g, '')) : null,
      Full_Price: item.Full_Price ? parseFloat(item.Full_Price.replace(/[^0-9.]/g, '')) : null,
      Single_Price: item.Single_Price ? parseFloat(item.Single_Price.replace(/[^0-9.]/g, '')) : null,
      Image_URL: item.Image_URL || '',
      Availability: String(item.Availability).toUpperCase() !== 'FALSE',
      Food_Type: item.Food_Type || 'Non-Veg',
      Popular: String(item.Popular).toUpperCase() === 'TRUE',
      Display_Order: item.Display_Order ? parseInt(item.Display_Order, 10) : 999,
      Source_Notes: item.Source_Notes || ''
    }));

    // Normalize Categories
    const normalizedCategories = rawCategories.map(cat => ({
      Category_ID: cat.Category_ID || '',
      Name_EN: cat.Name_EN || '',
      Name_HI: cat.Name_HI || '',
      Name_KOK_DEV: cat.Name_KOK_DEV || '',
      Name_KOK_ROM: cat.Name_KOK_ROM || '',
      Display_Order: cat.Display_Order ? parseInt(cat.Display_Order, 10) : 999
    }));

    return res.status(200).json({
      success: true,
      menu: normalizedMenu,
      categories: normalizedCategories,
      timestamp: Date.now(),
      source: 'google_sheets'
    });

  } catch (error) {
    console.error('Google Sheets API Fetch Error:', error.message);

    // Graceful fallback: return fallback data with status 200 so diners still see a menu
    return res.status(200).json({
      success: true,
      menu: FALLBACK_MENU,
      categories: FALLBACK_CATEGORIES,
      timestamp: Date.now(),
      source: 'error_fallback',
      error: error.message
    });
  }
}
