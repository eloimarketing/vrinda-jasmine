export const PRODUCT_CATEGORIES = [
  {
    name: 'Refrigeration',
    subcategories: [
      { 
        id: 'glass-door-refrigeration',
        name: 'Glass Door Refrigeration', 
        formFields: ['Product Name', 'Brand', 'Model', 'Temperature Range', 'Capacity (Litres)', 'Glass Type', 'Lighting', 'Shelves', 'Dimensions', 'Power Supply', 'Warranty', 'Price', 'Product Image', 'Description'] 
      },
      { 
        id: 'ice-cream-freezers',
        name: 'Ice Cream Freezers', 
        formFields: ['Product Name', 'Brand', 'Capacity', 'Temperature Range', 'Lid Type', 'Defrost Type', 'Interior Lighting', 'Power', 'Dimensions', 'Warranty', 'Price', 'Product Image', 'Description'] 
      },
      { 
        id: 'drinks-fridges-bottle-coolers',
        name: 'Drinks Fridges & Bottle Coolers', 
        formFields: ['Product Name', 'Brand', 'Bottle Capacity', 'Temperature Control', 'Door Type', 'Number of Shelves', 'Dimensions', 'Power Supply', 'Warranty', 'Price', 'Product Image', 'Description'] 
      },
      { 
        id: 'serve-over-counters',
        name: 'Serve Over Counters', 
        formFields: ['Product Name', 'Brand', 'Display Length', 'Cooling Type', 'Storage Capacity', 'Lighting', 'Glass Shape', 'Power', 'Warranty', 'Price', 'Product Image', 'Description'] 
      },
      { 
        id: 'multideck-displays',
        name: 'Multideck Displays', 
        formFields: ['Product Name', 'Brand', 'Number of Shelves', 'Internal Lighting', 'Cooling Type', 'Door Style', 'Dimensions', 'Power', 'Warranty', 'Price', 'Product Image', 'Description'] 
      },
      { 
        id: 'upright-undercounter-fridges',
        name: 'Upright & Undercounter Fridges', 
        formFields: ['Product Name', 'Brand', 'Type', 'Number of Doors', 'Cooling Range', 'Shelves', 'Capacity', 'Lock Feature', 'Power', 'Dimensions', 'Warranty', 'Price', 'Product Image', 'Description'] 
      },
      { 
        id: 'freezers-chest-upright',
        name: 'Freezers (Chest & Upright)', 
        formFields: ['Product Name', 'Brand', 'Freezer Type', 'Capacity', 'Temperature Control', 'Number of Compartments', 'Power', 'Dimensions', 'Warranty', 'Price', 'Product Image', 'Description'] 
      },
    ]
  },
  {
    name: 'Cooking Appliances',
    subcategories: [
      { 
        id: 'range-cookers',
        name: 'Range Cookers / Induction Cookers / Hobs', 
        formFields: ['Product Name', 'Brand', 'Type', 'Number of Burners', 'Oven Capacity', 'Control Type', 'Power', 'Dimensions', 'Warranty', 'Price', 'Product Image', 'Description'] 
      },
      { 
        id: 'ovens',
        name: 'Ovens', 
        formFields: ['Product Name', 'Brand', 'Type', 'Internal Capacity', 'Power Rating', 'Cooking Modes', 'Chamber Material', 'Timer Features', 'Dimensions', 'Warranty', 'Price', 'Product Image', 'Description'] 
      },
      { 
        id: 'gn-pans',
        name: 'GN Pans & Accessories', 
        formFields: ['Product Name', 'Type', 'GN Size', 'Depth', 'Material', 'Dishwasher Safe', 'Brand', 'Price', 'Product Image', 'Description'] 
      },
      { 
        id: 'cookware',
        name: 'Cookware', 
        formFields: ['Product Name', 'Material', 'Diameter', 'Handle Type', 'Oven Safe Temp', 'Non-Stick Coating', 'Brand', 'Price', 'Product Image', 'Description'] 
      },
      { 
        id: 'beverage-machines',
        name: 'Beverage Machines', 
        formFields: ['Product Name', 'Brand', 'Machine Type', 'Capacity', 'Heating Type', 'Controls', 'Power', 'Dimensions', 'Warranty', 'Price', 'Product Image', 'Description'] 
      },
      { 
        id: 'blenders-mixers',
        name: 'Blenders & Mixers', 
        formFields: ['Product Name', 'Brand', 'Capacity', 'Speed Settings', 'Motor Power', 'Jar Material', 'Blade Type', 'Power', 'Dimensions', 'Warranty', 'Price', 'Product Image', 'Description'] 
      },
      { 
        id: 'slush-machines',
        name: 'Slush Machines', 
        formFields: ['Product Name', 'Brand', 'Number of Tanks', 'Tank Capacity', 'Cooling System', 'Operating Temp', 'Dimensions', 'Power', 'Warranty', 'Price', 'Product Image', 'Description'] 
      },
    ]
  },
  {
    name: 'Appliances',
    subcategories: [
      { 
        id: 'all-appliances',
        name: 'All Appliances', 
        formFields: ['Product Name', 'Brand', 'Appliance Type', 'Power', 'Capacity', 'Features', 'Material', 'Dimensions', 'Warranty', 'Price', 'Product Image', 'Description'] 
      },
    ]
  },
  {
    name: 'Kitchenware & Equipment',
    subcategories: [
      { 
        id: 'general-equipment',
        name: 'General Equipment', 
        formFields: ['Product Name', 'Type', 'Material', 'Size/Capacity', 'Dishwasher Safe', 'Heat Resistance', 'Brand', 'Price', 'Product Image', 'Description'] 
      },
    ]
  },
  {
    name: 'Consumables',
    subcategories: [
      { 
        id: 'general-consumables',
        name: 'General Consumables', 
        formFields: ['Product Name', 'Type', 'Material', 'Pack Size', 'Colour/Print', 'Compostable/Biodegradable', 'Brand', 'Price', 'Product Image', 'Description'] 
      },
    ]
  },
  {
    name: 'Kitchen Furniture',
    subcategories: [
      { 
        id: 'all-furniture',
        name: 'All Furniture', 
        formFields: ['Product Name', 'Furniture Type', 'Material', 'Dimensions', 'Weight Capacity', 'Number of Shelves/Sections', 'Wheels', 'Brand', 'Warranty', 'Price', 'Product Image', 'Description'] 
      },
    ]
  },
  {
    name: 'Cleaning',
    subcategories: [
      { 
        id: 'dishwashers-glasswashers',
        name: 'Dishwashers & Glasswashers', 
        formFields: ['Product Name', 'Brand', 'Type', 'Capacity', 'Wash Cycles', 'Power Rating', 'Water Softener', 'Dimensions', 'Warranty', 'Price', 'Product Image', 'Description'] 
      },
      { 
        id: 'hygiene-accessories',
        name: 'Hygiene & Accessories', 
        formFields: ['Product Name', 'Type', 'Material', 'Power Supply', 'Usage Area', 'Refillable', 'Brand', 'Price', 'Product Image', 'Description'] 
      },
      { 
        id: 'laundry-machines',
        name: 'Laundry Machines', 
        formFields: ['Product Name', 'Brand', 'Type', 'Capacity', 'Programs', 'Energy Rating', 'Power', 'Warranty', 'Price', 'Product Image', 'Description'] 
      },
    ]
  },
  {
    name: 'Graded Equipment',
    subcategories: [
      { 
        id: 'all-graded-products',
        name: 'All Graded Products', 
        formFields: ['Product Name', 'Grade Type', 'Condition Notes', 'Warranty', 'Images of Actual Unit', 'Dimensions', 'Power', 'Price', 'Description'] 
      },
    ]
  },
  // Enhanced Barware Categories based on BarBits analysis
  {
    name: 'Barware',
    subcategories: [
      // Cocktail Equipment (from the dropdown)
      { 
        id: 'cocktail-strainers',
        name: 'Cocktail Strainers', 
        formFields: ['Product Name', 'Brand', 'Material', 'Type', 'Size', 'Finish', 'Dishwasher Safe', 'Dimensions', 'Weight', 'Price', 'Product Image', 'Description'] 
      },
      { 
        id: 'cocktail-shakers',
        name: 'Cocktail Shakers', 
        formFields: ['Product Name', 'Brand', 'Material', 'Capacity', 'Type', 'Finish', 'Dishwasher Safe', 'Dimensions', 'Weight', 'Price', 'Product Image', 'Description'] 
      },
      { 
        id: 'cocktail-muddlers',
        name: 'Cocktail Muddlers', 
        formFields: ['Product Name', 'Brand', 'Material', 'Type', 'Length', 'Finish', 'Dishwasher Safe', 'Dimensions', 'Weight', 'Price', 'Product Image', 'Description'] 
      },
      { 
        id: 'cocktail-spoons',
        name: 'Cocktail Spoons', 
        formFields: ['Product Name', 'Brand', 'Material', 'Length', 'Type', 'Finish', 'Dishwasher Safe', 'Dimensions', 'Weight', 'Price', 'Product Image', 'Description'] 
      },
      { 
        id: 'jigger-measures',
        name: 'Jigger Measures', 
        formFields: ['Product Name', 'Brand', 'Material', 'Capacity', 'Type', 'Finish', 'Dishwasher Safe', 'Dimensions', 'Weight', 'Price', 'Product Image', 'Description'] 
      },
      { 
        id: 'garnishing-tools',
        name: 'Garnishing Tools', 
        formFields: ['Product Name', 'Brand', 'Material', 'Type', 'Length', 'Finish', 'Dishwasher Safe', 'Dimensions', 'Weight', 'Price', 'Product Image', 'Description'] 
      },
      { 
        id: 'garnish-picks',
        name: 'Garnish Picks', 
        formFields: ['Product Name', 'Brand', 'Material', 'Length', 'Type', 'Finish', 'Dishwasher Safe', 'Dimensions', 'Weight', 'Price', 'Product Image', 'Description'] 
      },
      { 
        id: 'cocktail-mixing-glass',
        name: 'Cocktail Mixing Glass', 
        formFields: ['Product Name', 'Brand', 'Material', 'Capacity', 'Type', 'Finish', 'Dishwasher Safe', 'Dimensions', 'Weight', 'Price', 'Product Image', 'Description'] 
      },
      { 
        id: 'syrup-bitter-bottles',
        name: 'Syrup & Bitter Bottles', 
        formFields: ['Product Name', 'Brand', 'Material', 'Capacity', 'Type', 'Finish', 'Dishwasher Safe', 'Dimensions', 'Weight', 'Price', 'Product Image', 'Description'] 
      },
      { 
        id: 'ice-crushers-trays',
        name: 'Ice Crushers & Ice Cube Trays', 
        formFields: ['Product Name', 'Brand', 'Material', 'Type', 'Capacity', 'Finish', 'Dishwasher Safe', 'Dimensions', 'Weight', 'Price', 'Product Image', 'Description'] 
      },
      // Bar Tools & Equipment
      { 
        id: 'bar-measures',
        name: 'Bar Measures', 
        formFields: ['Product Name', 'Brand', 'Material', 'Capacity', 'Type', 'Finish', 'Dishwasher Safe', 'Dimensions', 'Weight', 'Price', 'Product Image', 'Description'] 
      },
      { 
        id: 'bottle-openers',
        name: 'Bottle Openers', 
        formFields: ['Product Name', 'Brand', 'Material', 'Type', 'Finish', 'Dishwasher Safe', 'Dimensions', 'Weight', 'Price', 'Product Image', 'Description'] 
      },
      { 
        id: 'pour-bottles',
        name: 'Pour Bottles', 
        formFields: ['Product Name', 'Brand', 'Material', 'Capacity', 'Type', 'Finish', 'Dishwasher Safe', 'Dimensions', 'Weight', 'Price', 'Product Image', 'Description'] 
      },
      { 
        id: 'speed-pourers',
        name: 'Speed Pourers', 
        formFields: ['Product Name', 'Brand', 'Material', 'Type', 'Finish', 'Dishwasher Safe', 'Dimensions', 'Weight', 'Price', 'Product Image', 'Description'] 
      },
      { 
        id: 'spirit-measures',
        name: 'Spirit Measures', 
        formFields: ['Product Name', 'Brand', 'Material', 'Capacity', 'Type', 'Finish', 'Dishwasher Safe', 'Dimensions', 'Weight', 'Price', 'Product Image', 'Description'] 
      },
      // Bar Service & Essentials
      { 
        id: 'bar-mats-drip-trays',
        name: 'Bar Mats & Drip Trays', 
        formFields: ['Product Name', 'Brand', 'Material', 'Size', 'Type', 'Finish', 'Dishwasher Safe', 'Dimensions', 'Weight', 'Price', 'Product Image', 'Description'] 
      },
      { 
        id: 'caddies-napkins',
        name: 'Caddies & Napkins', 
        formFields: ['Product Name', 'Brand', 'Material', 'Type', 'Size', 'Finish', 'Dishwasher Safe', 'Dimensions', 'Weight', 'Price', 'Product Image', 'Description'] 
      },
      { 
        id: 'condiment-dispensers',
        name: 'Condiment Dispensers', 
        formFields: ['Product Name', 'Brand', 'Material', 'Capacity', 'Type', 'Finish', 'Dishwasher Safe', 'Dimensions', 'Weight', 'Price', 'Product Image', 'Description'] 
      },
      { 
        id: 'serving-trays',
        name: 'Serving Trays', 
        formFields: ['Product Name', 'Brand', 'Material', 'Size', 'Type', 'Finish', 'Dishwasher Safe', 'Dimensions', 'Weight', 'Price', 'Product Image', 'Description'] 
      },
      { 
        id: 'straws-disposables',
        name: 'Straws & Disposables', 
        formFields: ['Product Name', 'Brand', 'Material', 'Type', 'Size', 'Quantity', 'Disposable', 'Compostable', 'Dimensions', 'Price', 'Product Image', 'Description'] 
      },
      // Wine Tools & Accessories
      { 
        id: 'wine-glass-hangers',
        name: 'Wine Glass Hangers', 
        formFields: ['Product Name', 'Brand', 'Material', 'Type', 'Size', 'Finish', 'Dishwasher Safe', 'Dimensions', 'Weight', 'Price', 'Product Image', 'Description'] 
      },
      { 
        id: 'champagne-wine-buckets',
        name: 'Champagne & Wine Buckets', 
        formFields: ['Product Name', 'Brand', 'Material', 'Capacity', 'Type', 'Finish', 'Dishwasher Safe', 'Dimensions', 'Weight', 'Price', 'Product Image', 'Description'] 
      },
      { 
        id: 'corkscrews-sealers',
        name: 'Corkscrews & Sealers', 
        formFields: ['Product Name', 'Brand', 'Material', 'Type', 'Finish', 'Dishwasher Safe', 'Dimensions', 'Weight', 'Price', 'Product Image', 'Description'] 
      },
      { 
        id: 'ice-buckets-tools',
        name: 'Ice Buckets & Tools', 
        formFields: ['Product Name', 'Brand', 'Material', 'Capacity', 'Type', 'Finish', 'Dishwasher Safe', 'Dimensions', 'Weight', 'Price', 'Product Image', 'Description'] 
      },
      { 
        id: 'wine-gift-sets',
        name: 'Wine Gift Sets', 
        formFields: ['Product Name', 'Brand', 'Material', 'Type', 'Contents', 'Finish', 'Dishwasher Safe', 'Dimensions', 'Weight', 'Price', 'Product Image', 'Description'] 
      },
      // Bar Gifts & Specials
      { 
        id: 'bar-games',
        name: 'Bar Games', 
        formFields: ['Product Name', 'Brand', 'Material', 'Type', 'Players', 'Finish', 'Dimensions', 'Weight', 'Price', 'Product Image', 'Description'] 
      },
      { 
        id: 'cocktail-gifts',
        name: 'Cocktail Gifts', 
        formFields: ['Product Name', 'Brand', 'Material', 'Type', 'Contents', 'Finish', 'Dimensions', 'Weight', 'Price', 'Product Image', 'Description'] 
      },
      { 
        id: 'cellar-cleaning',
        name: 'Cellar & Cleaning', 
        formFields: ['Product Name', 'Brand', 'Material', 'Type', 'Size', 'Finish', 'Dishwasher Safe', 'Dimensions', 'Weight', 'Price', 'Product Image', 'Description'] 
      },
    ]
  },
  {
    name: 'Tableware',
    subcategories: [
      { 
        id: 'plates-bowls',
        name: 'Plates & Bowls', 
        formFields: ['Product Name', 'Brand', 'Material', 'Pattern/Design', 'Size', 'Pieces in Set', 'Microwave Safe', 'Dishwasher Safe', 'Dimensions', 'Price', 'Product Image', 'Description'] 
      },
      { 
        id: 'cutlery',
        name: 'Cutlery', 
        formFields: ['Product Name', 'Brand', 'Material', 'Pattern/Design', 'Type', 'Pieces in Set', 'Dishwasher Safe', 'Dimensions', 'Price', 'Product Image', 'Description'] 
      },
      { 
        id: 'glassware',
        name: 'Glassware', 
        formFields: ['Product Name', 'Brand', 'Material', 'Capacity', 'Type', 'Dishwasher Safe', 'Dimensions', 'Price', 'Product Image', 'Description'] 
      },
      { 
        id: 'serving-ware',
        name: 'Serving Ware', 
        formFields: ['Product Name', 'Brand', 'Material', 'Type', 'Capacity', 'Microwave Safe', 'Dishwasher Safe', 'Dimensions', 'Price', 'Product Image', 'Description'] 
      },
    ]
  },
  {
    name: 'Kitchen Accessories',
    subcategories: [
      { 
        id: 'utensils',
        name: 'Utensils', 
        formFields: ['Product Name', 'Brand', 'Material', 'Type', 'Heat Resistance', 'Non-Stick Safe', 'Dishwasher Safe', 'Pieces in Set', 'Dimensions', 'Storage Type', 'Price', 'Product Image', 'Description'] 
      },
      { 
        id: 'storage',
        name: 'Storage', 
        formFields: ['Product Name', 'Brand', 'Material', 'Type', 'Capacity', 'Microwave Safe', 'Dishwasher Safe', 'Dimensions', 'Storage Type', 'Price', 'Product Image', 'Description'] 
      },
      { 
        id: 'gadgets',
        name: 'Gadgets', 
        formFields: ['Product Name', 'Brand', 'Material', 'Type', 'Power Supply', 'Features', 'Dimensions', 'Price', 'Product Image', 'Description'] 
      },
    ]
  },
  {
    name: 'Catering Supplies',
    subcategories: [
      { 
        id: 'disposables',
        name: 'Disposables', 
        formFields: ['Product Name', 'Brand', 'Material', 'Capacity', 'Quantity per Pack', 'Disposable', 'Compostable', 'Temperature Rating', 'Dimensions', 'Price', 'Product Image', 'Description'] 
      },
      { 
        id: 'serving-equipment',
        name: 'Serving Equipment', 
        formFields: ['Product Name', 'Brand', 'Material', 'Type', 'Capacity', 'Dishwasher Safe', 'Dimensions', 'Price', 'Product Image', 'Description'] 
      },
    ]
  },
]; 