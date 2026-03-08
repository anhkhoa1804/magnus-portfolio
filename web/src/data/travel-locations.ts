export type GeoJSONFeature = {
  type: 'Feature';
  properties: {
    name: string;
    trips: number;
    highlights?: string[];
    emoji?: string;
    description?: string;
  };
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
};

export const travelLocations: GeoJSONFeature[] = [
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [13.4050, 52.5200] },
    "properties": { "name": "Berlin", "description": "Germany (North/East)", "emoji": "🇩🇪", "trips": 1 }
  },
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [9.9937, 53.5511] },
    "properties": { "name": "Hamburg", "description": "Germany (North/East)", "emoji": "🇩🇪", "trips": 1 }
  },
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [10.6865, 53.8655] },
    "properties": { "name": "Lübeck", "description": "Germany (North/East)", "emoji": "🧱", "trips": 1 }
  },
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [8.8017, 53.0793] },
    "properties": { "name": "Bremen", "description": "Germany (North/East)", "emoji": "🎹", "trips": 1 }
  },
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [9.7320, 52.3759] },
    "properties": { "name": "Hannover", "description": "Germany (North/East)", "emoji": "🌳", "trips": 1 }
  },
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [10.4266, 51.9072] },
    "properties": { "name": "Goslar", "description": "Germany (North/East)", "emoji": "⛏️", "trips": 1 }
  },
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [9.9323, 51.5413] },
    "properties": { "name": "Göttingen", "description": "Germany (North/East)", "emoji": "🎓", "trips": 1 }
  },
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [12.3731, 51.3397] },
    "properties": { "name": "Leipzig", "description": "Germany (North/East)", "emoji": "🎼", "trips": 1 }
  },
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [13.7373, 51.0504] },
    "properties": { "name": "Dresden", "description": "Germany (North/East)", "emoji": "🏛️", "trips": 1 }
  },
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [13.0645, 52.3963] },
    "properties": { "name": "Potsdam", "description": "Germany (North/East)", "emoji": "🏞️", "trips": 1 }
  },
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [11.0292, 50.9848] },
    "properties": { "name": "Erfurt", "description": "Germany (North/East)", "emoji": "⛪", "trips": 1 }
  },
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [11.3235, 50.9795] },
    "properties": { "name": "Weimar", "description": "Germany (North/East)", "emoji": "📜", "trips": 1 }
  },
  
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [6.7735, 51.2277] },
    "properties": { "name": "Düsseldorf", "description": "Germany (Ruhr/West)", "emoji": "👠", "trips": 1 }
  },
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [7.4653, 51.5136] },
    "properties": { "name": "Dortmund", "description": "Germany (Ruhr/West)", "emoji": "⚽", "trips": 1 }
  },
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [6.9603, 50.9375] },
    "properties": { "name": "Cologne", "description": "Germany (Ruhr/West)", "emoji": "⛪", "trips": 1 }
  },
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [8.6821, 50.1109] },
    "properties": { "name": "Frankfurt", "description": "Germany (Ruhr/West)", "emoji": "✈️", "trips": 1 }
  },
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [8.2711, 49.9929] },
    "properties": { "name": "Mainz", "description": "Germany (Ruhr/West)", "emoji": "🍇", "trips": 1 }
  },
  
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [11.5820, 48.1351] },
    "properties": { "name": "Munich", "description": "Germany (South)", "emoji": "🍻", "trips": 1 }
  },
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [8.6724, 49.3988] },
    "properties": { "name": "Heidelberg", "description": "Germany (South)", "emoji": "🏰", "trips": 1 }
  },
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [7.8421, 47.9990] },
    "properties": { "name": "Freiburg im Breisgau", "description": "Germany (South)", "emoji": "🌲", "trips": 1 }
  },
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [9.9510, 49.7913] },
    "properties": { "name": "Würzburg", "description": "Germany (South)", "emoji": "🍷", "trips": 1 }
  },
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [10.1867, 49.3774] },
    "properties": { "name": "Rothenburg ob der Tauber", "description": "Germany (South)", "emoji": "🏘️", "trips": 1 }
  },
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [10.8916, 49.8922] },
    "properties": { "name": "Bamberg", "description": "Germany (South)", "emoji": "🍺", "trips": 1 }
  },
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [12.0956, 49.0134] },
    "properties": { "name": "Regensburg", "description": "Germany (South)", "emoji": "🌉", "trips": 1 }
  },
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [10.6999, 47.5696] },
    "properties": { "name": "Füssen", "description": "Germany (South)", "emoji": "🏰", "trips": 1 }
  },
  
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [8.5417, 47.3769] },
    "properties": { "name": "Zurich", "description": "Switzerland", "emoji": "🇨🇭", "trips": 1 }
  },
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [6.1432, 46.2044] },
    "properties": { "name": "Geneva", "description": "Switzerland", "emoji": "⛲", "trips": 1 }
  },
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [7.4474, 46.9480] },
    "properties": { "name": "Bern", "description": "Switzerland", "emoji": "🐻", "trips": 1 }
  },
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [7.5886, 47.5596] },
    "properties": { "name": "Basel", "description": "Switzerland", "emoji": "🖼️", "trips": 1 }
  },

  
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [9.1900, 45.4642] },
    "properties": { "name": "Milan", "description": "Italy & Vatican", "emoji": "🇮🇹", "trips": 1 }
  },
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [12.3155, 45.4408] },
    "properties": { "name": "Venice", "description": "Italy & Vatican", "emoji": "🎭", "trips": 1 }
  },
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [11.2558, 43.7696] },
    "properties": { "name": "Florence", "description": "Italy & Vatican", "emoji": "🎨", "trips": 1 }
  },
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [10.4017, 43.7228] },
    "properties": { "name": "Pisa", "description": "Italy & Vatican", "emoji": "🏺", "trips": 1 }
  },
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [12.4964, 41.9028] },
    "properties": { "name": "Rome", "description": "Italy & Vatican", "emoji": "🏛️", "trips": 1 }
  },
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [12.4534, 41.9029] },
    "properties": { "name": "Vatican City", "description": "Italy & Vatican", "emoji": "🇻🇦", "trips": 1 }
  },
  
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [4.9041, 52.3676] },
    "properties": { "name": "Amsterdam", "description": "Netherlands", "emoji": "🇳🇱", "trips": 1 }
  },
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [4.4777, 51.9244] },
    "properties": { "name": "Rotterdam", "description": "Netherlands", "emoji": "🚢", "trips": 1 }
  },
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [4.3007, 52.0705] },
    "properties": { "name": "The Hague", "description": "Netherlands", "emoji": "⚖️", "trips": 1 }
  },
  
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [4.3517, 50.8503] },
    "properties": { "name": "Brussels", "description": "Belgium", "emoji": "🇧🇪", "trips": 1 }
  },
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [3.2247, 51.2093] },
    "properties": { "name": "Bruges", "description": "Belgium", "emoji": "🍫", "trips": 1 }
  },
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [3.7174, 51.0543] },
    "properties": { "name": "Ghent", "description": "Belgium", "emoji": "🏘️", "trips": 1 }
  },
  
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [2.3522, 48.8566] },
    "properties": { "name": "Paris", "description": "France", "emoji": "🇫🇷", "trips": 1 }
  },
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [7.7521, 48.5734] },
    "properties": { "name": "Strasbourg", "description": "France", "emoji": "🥨", "trips": 1 }
  },
  
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [16.3738, 48.2082] },
    "properties": { "name": "Vienna", "description": "Austria", "emoji": "🇦🇹", "trips": 1 }
  },
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [13.0550, 47.8095] },
    "properties": { "name": "Salzburg", "description": "Austria", "emoji": "🎼", "trips": 1 }
  },
  
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [14.4378, 50.0755] },
    "properties": { "name": "Prague", "description": "Czechia", "emoji": "🇨🇿", "trips": 1 }
  },
  
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [19.0402, 47.4979] },
    "properties": { "name": "Budapest", "description": "Hungary", "emoji": "🇭🇺", "trips": 1 }
  },
  
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [18.0686, 59.3293] },
    "properties": { "name": "Stockholm", "description": "Sweden", "emoji": "🇸🇪", "trips": 1 }
  },
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [11.9746, 57.7089] },
    "properties": { "name": "Gothenburg", "description": "Sweden", "emoji": "🐟", "trips": 1 }
  },
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [13.0038, 55.6050] },
    "properties": { "name": "Malmö", "description": "Sweden", "emoji": "🌉", "trips": 1 }
  },
  
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [12.5683, 55.6761] },
    "properties": { "name": "Copenhagen", "description": "Denmark", "emoji": "🇩🇰", "trips": 1 }
  },
  
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [10.7522, 59.9139] },
    "properties": { "name": "Oslo", "description": "Norway", "emoji": "🇳🇴", "trips": 1 }
  },
  
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [104.9705, 22.8233] },
    "properties": { "name": "Ha Giang", "description": "Vietnam (North)", "emoji": "🏍️", "trips": 1 }
  },
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [106.2575, 22.6667] },
    "properties": { "name": "Cao Bang", "description": "Vietnam (North)", "emoji": "🏞️", "trips": 1 }
  },
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [105.2155, 21.3168] },
    "properties": { "name": "Phu Tho", "description": "Vietnam (North)", "emoji": "🤴", "trips": 1 }
  },
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [105.8544, 21.0285] },
    "properties": { "name": "Hanoi", "description": "Vietnam (North)", "emoji": "🇻🇳", "trips": 1 }
  },
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [107.0371, 20.7276] },
    "properties": { "name": "Hai Phong (Cat Ba)", "description": "Vietnam (North)", "emoji": "🚢", "trips": 1 }
  },
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [107.0843, 20.9599] },
    "properties": { "name": "Quang Ninh (Ha Long, Yen Tu)", "description": "Vietnam (North)", "emoji": "🐉", "trips": 1 }
  },
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [106.3366, 20.4468] },
    "properties": { "name": "Thai Binh", "description": "Vietnam (North)", "emoji": "🌾", "trips": 1 }
  },
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [105.9744, 20.2541] },
    "properties": { "name": "Ninh Binh", "description": "Vietnam (North)", "emoji": "🐐", "trips": 1 }
  },
  
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [107.5909, 16.4637] },
    "properties": { "name": "Hue", "description": "Vietnam (Central Coast)", "emoji": "🏯", "trips": 1 }
  },
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [108.2022, 16.0544] },
    "properties": { "name": "Da Nang", "description": "Vietnam (Central Coast)", "emoji": "🎆", "trips": 1 }
  },
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [108.3380, 15.8801] },
    "properties": { "name": "Quang Nam (Hoi An)", "description": "Vietnam (Central Coast)", "emoji": "🏮", "trips": 1 }
  },
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [108.8028, 15.1205] },
    "properties": { "name": "Quang Ngai (Ly Son)", "description": "Vietnam (Central Coast)", "emoji": "🧄", "trips": 1 }
  },
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [109.2197, 13.7830] },
    "properties": { "name": "Binh Dinh (Quy Nhon)", "description": "Vietnam (Central Coast)", "emoji": "⛱️", "trips": 1 }
  },
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [109.2831, 13.0886] },
    "properties": { "name": "Phu Yen", "description": "Vietnam (Central Coast)", "emoji": "🌵", "trips": 1 }
  },
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [109.1967, 12.2388] },
    "properties": { "name": "Khanh Hoa (Nha Trang)", "description": "Vietnam (Central Coast)", "emoji": "🏝️", "trips": 1 }
  },
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [108.9897, 11.5658] },
    "properties": { "name": "Ninh Thuan", "description": "Vietnam (Central Coast)", "emoji": "🍇", "trips": 1 }
  },
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [108.2868, 10.9250] },
    "properties": { "name": "Binh Thuan (Mui Ne)", "description": "Vietnam (Central Coast)", "emoji": "🏜️", "trips": 1 }
  },
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [106.6343, 8.6830] },
    "properties": { "name": "Ba Ria - Vung Tau (Con Dao)", "description": "Vietnam (Central Coast)", "emoji": "🐢", "trips": 1 }
  },
  
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [108.0076, 14.3524] },
    "properties": { "name": "Kon Tum", "description": "Vietnam (Central Highlands)", "emoji": "🪵", "trips": 1 }
  },
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [108.0378, 12.6662] },
    "properties": { "name": "Dak Lak", "description": "Vietnam (Central Highlands)", "emoji": "☕", "trips": 1 }
  },
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [108.4583, 11.9404] },
    "properties": { "name": "Lam Dong (Da Lat)", "description": "Vietnam (Central Highlands)", "emoji": "🌸", "trips": 1 }
  },
  
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [106.6297, 10.8231] },
    "properties": { "name": "Ho Chi Minh City", "description": "Vietnam (Southeast)", "emoji": "🌆", "trips": 1 }
  },
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [106.9113, 11.7588] },
    "properties": { "name": "Binh Phuoc", "description": "Vietnam (Southeast)", "emoji": "🌰", "trips": 1 }
  },
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [107.0315, 11.0287] },
    "properties": { "name": "Dong Nai", "description": "Vietnam (Southeast)", "emoji": "🏭", "trips": 1 }
  },
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [106.1265, 11.3323] },
    "properties": { "name": "Tay Ninh", "description": "Vietnam (Southeast)", "emoji": "⛰️", "trips": 1 }
  },
  
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [105.6263, 10.4907] },
    "properties": { "name": "Dong Thap", "description": "Vietnam (Mekong Delta)", "emoji": "🪷", "trips": 1 }
  },
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [105.7796, 10.0452] },
    "properties": { "name": "Can Tho", "description": "Vietnam (Mekong Delta)", "emoji": "🚤", "trips": 1 }
  },
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [105.9760, 9.5997] },
    "properties": { "name": "Soc Trang", "description": "Vietnam (Mekong Delta)", "emoji": "🥣", "trips": 1 }
  },
  
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [103.8198, 1.3521] },
    "properties": { "name": "Singapore", "description": "Transit Hub", "emoji": "🇸🇬", "trips": 1 }
  },
  {
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [51.5310, 25.2854] },
    "properties": { "name": "Doha", "description": "Transit Hub", "emoji": "🇶🇦", "trips": 1 }
  }
];
