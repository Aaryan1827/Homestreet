// Coordinates and scores are approximate demo data, to be verified.
const pune = {
  id: 'pune',
  name: 'Pune',
  tagline: 'The Oxford of the East',
  comingSoon: false,
  center: [18.5204, 73.8567],
  zoom: 13,
  heroImage: '/images/pune/hero-shaniwar-wada.jpg',
  photoCredits: [],
  areas: [
    { name: 'Koregaon Park', lat: 18.5362, lng: 73.8969, scores: { safety: 85, cleanliness: 80, affordability: 40, rating: 90, accessibility: 85 } },
    { name: 'Kothrud', lat: 18.5074, lng: 73.8077, scores: { safety: 88, cleanliness: 75, affordability: 70, rating: 85, accessibility: 80 } },
    { name: 'Deccan Gymkhana', lat: 18.5156, lng: 73.8415, scores: { safety: 82, cleanliness: 70, affordability: 60, rating: 88, accessibility: 90 } },
    { name: 'Camp', lat: 18.5126, lng: 73.8778, scores: { safety: 78, cleanliness: 65, affordability: 65, rating: 92, accessibility: 85 } },
    { name: 'Shivajinagar', lat: 18.5314, lng: 73.8446, scores: { safety: 80, cleanliness: 68, affordability: 60, rating: 85, accessibility: 95 } },
    { name: 'Baner', lat: 18.5590, lng: 73.7868, scores: { safety: 85, cleanliness: 78, affordability: 50, rating: 82, accessibility: 75 } },
    { name: 'Viman Nagar', lat: 18.5665, lng: 73.9122, scores: { safety: 80, cleanliness: 75, affordability: 55, rating: 85, accessibility: 88 } },
    { name: 'Hadapsar', lat: 18.5089, lng: 73.9259, scores: { safety: 70, cleanliness: 60, affordability: 80, rating: 75, accessibility: 75 } },
    { name: 'Peth Area', lat: 18.5168, lng: 73.8553, scores: { safety: 75, cleanliness: 55, affordability: 90, rating: 88, accessibility: 65 } },
    { name: 'Hinjewadi', lat: 18.5913, lng: 73.7389, scores: { safety: 82, cleanliness: 80, affordability: 60, rating: 75, accessibility: 70 } },
  ],
  culture: {
    festivals: [
      { name: 'Ganeshotsav', month: 'August/September', description: 'Pune\'s most iconic 10-day festival with grand processions and dhol-tasha.' },
      { name: 'Pune Festival', month: 'September', description: 'A cultural extravaganza held during Ganesh festival featuring music, dance, and arts.' },
      { name: 'Sawai Gandharva Bhimsen Mahotsav', month: 'December', description: 'One of the largest Indian classical music festivals in the world.' },
      { name: 'Diwali Pahat', month: 'October/November', description: 'Early morning musical concerts organized during Diwali.' },
      { name: 'Gudi Padwa', month: 'March/April', description: 'Traditional Maharashtrian New Year celebrated with colorful processions.' }
    ],
    traditions: [
      { name: 'Puneri Pagdi', description: 'A traditional turban considered a symbol of pride and honor in Pune.' },
      { name: 'Puneri Patya', description: 'Witty, often sarcastic signboards found outside homes and shops, a hallmark of Pune humor.' },
      { name: 'Peth Culture', description: 'The historic heart of Pune, organized into neighborhoods named after days of the week.' },
      { name: 'Marathi Theatre', description: 'Pune is a vibrant hub for experimental and traditional Marathi stage plays.' },
      { name: 'Lavani', description: 'A traditional song and dance performance known for its powerful rhythm and expressiveness.' }
    ]
  },
  dishes: [
    { id: 'misal-pav', name: 'Misal Pav', description: 'Spicy curry made of sprouted lentils, topped with farsan and served with bread.', whereToTry: 'bedekar-misal', image: '/images/pune/dishes/misal-pav.jpg' },
    { id: 'mastani', name: 'Mastani', description: 'A thick, rich milkshake mixed with ice cream and garnished with dry fruits.', whereToTry: 'sujata-mastani', image: '/images/pune/dishes/mastani.jpg' },
    { id: 'bakarwadi', name: 'Bakarwadi', description: 'A crispy, spiral snack stuffed with a spicy, tangy, and sweet mixture.', whereToTry: 'chitale-bandhu', image: '/images/pune/dishes/bakarwadi.jpg' },
    { id: 'shrewsbury-biscuit', name: 'Shrewsbury Biscuit', description: 'Buttery, crumbly biscuits that melt in your mouth, a Pune legacy.', whereToTry: 'kayani-bakery', image: '/images/pune/dishes/shrewsbury.jpg' },
    { id: 'bun-maska', name: 'Bun Maska', description: 'Soft sweet bun slathered with butter, best dipped in Irani chai.', whereToTry: 'vohuman-cafe', image: '/images/pune/dishes/bun-maska.jpg' },
    { id: 'maharashtrian-thali', name: 'Maharashtrian Thali', description: 'An authentic feast featuring puran poli, amti, bhakri, and local veg preparations.', whereToTry: 'shreyas', image: '/images/pune/dishes/thali.jpg' },
  ],
  heritage: [
    {
      id: 'shaniwar-wada',
      name: 'Shaniwar Wada',
      image: '/images/pune/hero-shaniwar-wada.jpg',
      lat: 18.5195,
      lng: 73.8553,
      description: 'A fortification in the city of Pune, built in 1732, seat of the Peshwa rulers of the Maratha Empire until 1818.',
      history: 'Built by Peshwa Bajirao I in 1732, Shaniwar Wada was the seat of Peshwa power and the centre of Maratha Empire politics for nearly a century. The grand palace complex once housed thousands and featured elaborate gardens and fountains before a mysterious fire devastated it in 1828.',
    },
    {
      id: 'aga-khan-palace',
      name: 'Aga Khan Palace',
      image: '/images/pune/aga-khan-palace.jpg',
      lat: 18.5533,
      lng: 73.9014,
      description: 'A grand palace built in 1892 by Sultan Mohammed Shah Aga Khan III, now a memorial to Mahatma Gandhi.',
      history: 'Constructed in 1892 as an act of charity by Aga Khan III, the palace served as a prison for Mahatma Gandhi and his wife Kasturba during India\'s independence movement. Today it stands as a national memorial with a museum dedicated to Gandhi\'s life.',
    },
    {
      id: 'sinhagad-fort',
      name: 'Sinhagad Fort',
      image: '/images/pune/sinhagad-fort.jpg',
      lat: 18.3667,
      lng: 73.7555,
      description: 'An ancient hill fortress on a cliff, famous for the Battle of Sinhagad in 1670 where Tanaji Malusare fell.',
      history: 'Originally called Kondhana, this 2,000-year-old fort gained the name Sinhagad ("Lion Fort") after the legendary night battle of 1670 where Maratha commander Tanaji Malusare recaptured it from the Mughals at the cost of his own life. The fort commands sweeping views of the Sahyadri mountains.',
    },
    {
      id: 'parvati-hill',
      name: 'Parvati Hill',
      image: '/images/pune/parvati-hill.jpg',
      lat: 18.4968,
      lng: 73.8470,
      description: 'A sacred hill with a cluster of 18th-century temples dedicated to Parvati, Devdeveshwar, Vishnumaya, and others.',
      history: 'Rising 2,100 feet above sea level, Parvati Hill was developed by the Peshwas in the 18th century as a place of worship and leisure. The Devdeveshwar temple at the top is one of the oldest in Pune and the hilltop museum houses rare Peshwa-era artifacts.',
    },
    {
      id: 'dagdusheth-ganpati',
      name: 'Dagdusheth Ganpati',
      image: '/images/pune/dagdusheth-ganpati.jpg',
      lat: 18.5168,
      lng: 73.8553,
      description: 'One of the most visited Ganesh temples in India, established in 1893 by Seth Dagdusheth Halwai.',
      history: 'Founded in 1893 by the confectioner Seth Dagdusheth Halwai after he lost his son to plague, the temple became a powerful spiritual and civic centre during Lokmanya Tilak\'s revival of public Ganesh celebrations. The idol is adorned daily with gold and precious ornaments worth crores.',
    },
    {
      id: 'lal-mahal',
      name: 'Lal Mahal',
      image: '/images/pune/lal-mahal.jpg',
      lat: 18.5191,
      lng: 73.8561,
      description: 'Reconstructed red brick palace, originally built in 1630 by Shahaji Bhosale for his wife Jijabai and son Shivaji.',
      history: 'This is where Chhatrapati Shivaji Maharaj spent his childhood. It is famous for the incident where Shivaji attacked the Mughal commander Shaista Khan, severing his fingers as he tried to escape through a window.',
    },
  ],
  places: [
    // --- FOOD ---
    { id: 'vaishali', name: 'Vaishali', category: 'food', subcategory: 'restaurant', area: 'FC Road', lat: 18.5205, lng: 73.8398, priceLevel: 2, avgCost: 300, tags: ['South Indian', 'Iconic', 'Crowded'], description: 'Pune\'s most beloved South Indian restaurant. Known for its SPDP and bustling student crowd.', bestTime: 'Morning for breakfast', openHours: '7:00 AM - 11:00 PM', image: '/images/pune/places/vaishali.jpg', scores: { safety: 90, cleanliness: 85, affordability: 75, rating: 95, accessibility: 80 }, verified: true },
    { id: 'roopali', name: 'Roopali', category: 'food', subcategory: 'restaurant', area: 'FC Road', lat: 18.5190, lng: 73.8406, priceLevel: 2, avgCost: 250, tags: ['South Indian', 'Filter Coffee'], description: 'A classic Udupi joint, sister restaurant to Vaishali, famous for filter coffee and dosas.', bestTime: 'Late evening', openHours: '7:00 AM - 11:00 PM', image: '/images/pune/places/roopali.jpg', scores: { safety: 90, cleanliness: 80, affordability: 80, rating: 88, accessibility: 80 }, verified: true },
    { id: 'kayani-bakery', name: 'Kayani Bakery', category: 'food', subcategory: 'sweets-bakery', area: 'Camp', lat: 18.5147, lng: 73.8762, priceLevel: 1, avgCost: 150, tags: ['Bakery', 'Historic', 'Shrewsbury'], description: 'An old-world Parsi bakery legendary for its Shrewsbury biscuits and mawa cakes.', bestTime: 'Early afternoon (items sell out fast)', openHours: '3:30 PM - 7:00 PM (Closed Sundays)', image: '/images/pune/places/kayani.jpg', scores: { safety: 85, cleanliness: 80, affordability: 90, rating: 96, accessibility: 70 }, verified: true },
    { id: 'cafe-goodluck', name: 'Cafe Goodluck', category: 'food', subcategory: 'cafe', area: 'Deccan', lat: 18.5165, lng: 73.8407, priceLevel: 1, avgCost: 200, tags: ['Irani Cafe', 'Bun Maska', 'Keema Pav'], description: 'One of the oldest Irani cafes in Pune, famous for bun maska, chai, and keema pav.', bestTime: 'Morning or late night', openHours: '7:00 AM - 11:30 PM', image: '/images/pune/places/goodluck.jpg', scores: { safety: 85, cleanliness: 70, affordability: 85, rating: 92, accessibility: 85 }, verified: true },
    { id: 'bedekar-misal', name: 'Bedekar Misal', category: 'food', subcategory: 'street-food', area: 'Narayan Peth', lat: 18.5137, lng: 73.8502, priceLevel: 1, avgCost: 100, tags: ['Misal', 'Spicy', 'Maharashtrian'], description: 'Iconic spot serving a slightly sweeter, highly flavorful Pune-style misal pav.', bestTime: 'Sunday morning', openHours: '8:00 AM - 2:00 PM', image: '/images/pune/places/bedekar.jpg', scores: { safety: 80, cleanliness: 65, affordability: 95, rating: 88, accessibility: 70 }, verified: true },
    { id: 'katakirrr', name: 'Katakirrr', category: 'food', subcategory: 'street-food', area: 'Erandwane', lat: 18.5085, lng: 73.8340, priceLevel: 1, avgCost: 120, tags: ['Misal', 'Extra Spicy'], description: 'Known for its fiery hot Kolhapuri-style misal. Not for the faint-hearted!', bestTime: 'Morning', openHours: '8:00 AM - 4:00 PM', image: '/images/pune/places/katakirrr.jpg', scores: { safety: 80, cleanliness: 70, affordability: 90, rating: 85, accessibility: 75 }, verified: false },
    { id: 'sujata-mastani', name: 'Sujata Mastani', category: 'food', subcategory: 'sweets-bakery', area: 'Sadashiv Peth', lat: 18.5098, lng: 73.8523, priceLevel: 1, avgCost: 120, tags: ['Dessert', 'Mango Mastani'], description: 'The birthplace of Mastani, a rich local dessert drink made of milk, ice cream, and fruits.', bestTime: 'Evening', openHours: '11:00 AM - 11:30 PM', image: '/images/pune/places/sujata.jpg', scores: { safety: 85, cleanliness: 75, affordability: 85, rating: 90, accessibility: 80 }, verified: true },
    { id: 'chitale-bandhu', name: 'Chitale Bandhu Mithaiwale', category: 'food', subcategory: 'sweets-bakery', area: 'Deccan', lat: 18.5144, lng: 73.8441, priceLevel: 1, avgCost: 200, tags: ['Sweets', 'Bakarwadi'], description: 'The absolute authority on Maharashtrian sweets and the globally famous Bakarwadi.', bestTime: 'Afternoon', openHours: '8:30 AM - 8:30 PM', image: '/images/pune/places/chitale.jpg', scores: { safety: 90, cleanliness: 90, affordability: 80, rating: 94, accessibility: 90 }, verified: true },
    { id: 'shreyas', name: 'Hotel Shreyas', category: 'food', subcategory: 'restaurant', area: 'Deccan', lat: 18.5132, lng: 73.8398, priceLevel: 2, avgCost: 350, tags: ['Thali', 'Maharashtrian', 'Family'], description: 'A beloved institution serving authentic, unlimited Maharashtrian vegetarian thalis.', bestTime: 'Lunch', openHours: '11:30 AM - 3:00 PM, 7:30 PM - 10:30 PM', image: '/images/pune/places/shreyas.jpg', scores: { safety: 90, cleanliness: 85, affordability: 70, rating: 88, accessibility: 85 }, verified: true },
    { id: 'vohuman-cafe', name: 'Vohuman Cafe', category: 'food', subcategory: 'cafe', area: 'Sangamvadi', lat: 18.5348, lng: 73.8767, priceLevel: 1, avgCost: 150, tags: ['Irani Cafe', 'Breakfast', 'Cheese Omelette'], description: 'Classic Irani cafe loved for its double cheese omelette and cheerful morning vibe.', bestTime: 'Early morning', openHours: '6:00 AM - 6:00 PM', image: '/images/pune/places/vohuman.jpg', scores: { safety: 80, cleanliness: 65, affordability: 95, rating: 90, accessibility: 70 }, verified: true },

    // --- HOTELS ---
    { id: 'jw-marriott-pune', name: 'JW Marriott Hotel', category: 'hotels', subcategory: 'luxury', area: 'Senapati Bapat Road', lat: 18.5323, lng: 73.8298, priceLevel: 3, avgCost: 12000, tags: ['Luxury', 'Business', 'Spa'], description: 'A 5-star luxury hotel offering premium amenities, multiple dining options, and a central location.', bestTime: 'Anytime', openHours: '24 Hours', image: '/images/pune/places/marriott.jpg', scores: { safety: 98, cleanliness: 98, affordability: 30, rating: 94, accessibility: 95 }, verified: true },
    { id: 'conrad-pune', name: 'Conrad Pune', category: 'hotels', subcategory: 'luxury', area: 'Koregaon Park', lat: 18.5365, lng: 73.8967, priceLevel: 3, avgCost: 14000, tags: ['Luxury', 'Hilton', 'Art Deco'], description: 'An art deco inspired luxury hotel in the heart of upscale Koregaon Park.', bestTime: 'Anytime', openHours: '24 Hours', image: '/images/pune/places/conrad.jpg', scores: { safety: 98, cleanliness: 99, affordability: 25, rating: 95, accessibility: 95 }, verified: true },
    { id: 'o-hotel', name: 'The O Hotel', category: 'hotels', subcategory: 'mid-range', area: 'Koregaon Park', lat: 18.5383, lng: 73.8929, priceLevel: 2, avgCost: 6500, tags: ['Boutique', 'Nightlife', 'Couples'], description: 'A chic boutique hotel known for its striking red and black decor and vibrant nightlife venues.', bestTime: 'Anytime', openHours: '24 Hours', image: '/images/pune/places/ohotel.jpg', scores: { safety: 90, cleanliness: 88, affordability: 60, rating: 84, accessibility: 85 }, verified: true },
    { id: 'lemon-tree-premier', name: 'Lemon Tree Premier', category: 'hotels', subcategory: 'mid-range', area: 'City Center', lat: 18.5284, lng: 73.8765, priceLevel: 2, avgCost: 5500, tags: ['Business', 'Pool'], description: 'A vibrant mid-range business hotel with quirky decor and good service.', bestTime: 'Anytime', openHours: '24 Hours', image: '/images/pune/places/lemontree.jpg', scores: { safety: 90, cleanliness: 90, affordability: 65, rating: 85, accessibility: 90 }, verified: false },
    { id: 'zostel-pune', name: 'Zostel Pune', category: 'hotels', subcategory: 'budget', area: 'Koregaon Park', lat: 18.5390, lng: 73.9015, priceLevel: 1, avgCost: 800, tags: ['Hostel', 'Backpackers', 'Social'], description: 'A lively backpacker hostel in KP offering dorms, common areas, and a social vibe.', bestTime: 'Anytime', openHours: '24 Hours', image: '/images/pune/places/zostel.jpg', scores: { safety: 85, cleanliness: 80, affordability: 95, rating: 88, accessibility: 75 }, verified: true },
    
    // --- ATTRACTIONS ---
    { id: 'tulshibaug', name: 'Tulshibaug', category: 'attractions', subcategory: 'market', area: 'Peth Area', lat: 18.5140, lng: 73.8550, priceLevel: 1, avgCost: 500, tags: ['Shopping', 'Bargaining', 'Crowded'], description: 'A bustling, historic street market selling everything from utensils to traditional jewelry.', bestTime: 'Late morning', openHours: '10:00 AM - 9:00 PM', image: '/images/pune/places/tulshibaug.jpg', scores: { safety: 70, cleanliness: 50, affordability: 98, rating: 85, accessibility: 40 }, verified: true },
    { id: 'pashan-lake', name: 'Pashan Lake', category: 'attractions', subcategory: 'park', area: 'Pashan', lat: 18.5376, lng: 73.7915, priceLevel: 1, avgCost: 0, tags: ['Nature', 'Bird Watching', 'Quiet'], description: 'A man-made lake built in the British era, now a haven for migratory birds and nature lovers.', bestTime: 'Early morning or sunset', openHours: '6:00 AM - 7:00 PM', image: '/images/pune/places/pashan-lake.jpg', scores: { safety: 80, cleanliness: 75, affordability: 100, rating: 82, accessibility: 70 }, verified: true },
    { id: 'osho-garden', name: 'Osho Teerth Park', category: 'attractions', subcategory: 'park', area: 'Koregaon Park', lat: 18.5378, lng: 73.8943, priceLevel: 1, avgCost: 0, tags: ['Zen', 'Nature', 'Quiet'], description: 'A beautifully landscaped Japanese-style Zen garden created out of a former wasteland.', bestTime: 'Early morning', openHours: '6:00 AM - 9:00 PM', image: '/images/pune/places/osho.jpg', scores: { safety: 90, cleanliness: 95, affordability: 100, rating: 90, accessibility: 85 }, verified: true },
    { id: 'kelkar-museum', name: 'Raja Dinkar Kelkar Museum', category: 'attractions', subcategory: 'culture', area: 'Shukrawar Peth', lat: 18.5100, lng: 73.8532, priceLevel: 1, avgCost: 100, tags: ['Museum', 'Artifacts', 'History'], description: 'Houses a mesmerizing one-man collection of over 20,000 everyday Indian artifacts.', bestTime: 'Afternoon', openHours: '10:00 AM - 5:30 PM', image: '/images/pune/places/kelkar.jpg', scores: { safety: 85, cleanliness: 80, affordability: 90, rating: 88, accessibility: 75 }, verified: true },
    { id: 'pataleshwar', name: 'Pataleshwar Cave Temple', category: 'attractions', subcategory: 'heritage', area: 'Shivajinagar', lat: 18.5273, lng: 73.8504, priceLevel: 1, avgCost: 0, tags: ['Caves', 'Ancient', 'Temple'], description: 'An 8th-century rock-cut cave temple carved out of a single basalt rock, dedicated to Lord Shiva.', bestTime: 'Morning', openHours: '8:00 AM - 5:30 PM', image: '/images/pune/places/pataleshwar.jpg', scores: { safety: 85, cleanliness: 75, affordability: 100, rating: 85, accessibility: 80 }, verified: true },
    { id: 'fc-road', name: 'Fergusson College Road', category: 'attractions', subcategory: 'market', area: 'Deccan', lat: 18.5205, lng: 73.8390, priceLevel: 2, avgCost: 1000, tags: ['Shopping', 'Street Food', 'Youth'], description: 'Pune\'s most famous high street, lined with shops, cafes, and packed with students.', bestTime: 'Evening', openHours: '10:00 AM - 10:00 PM', image: '/images/pune/places/fcroad.jpg', scores: { safety: 85, cleanliness: 70, affordability: 80, rating: 92, accessibility: 90 }, verified: true }
  ],
  incidents: [],
}

// Convert heritage items into Places for the map
pune.heritage.forEach(h => {
  pune.places.push({
    id: h.id,
    name: h.name,
    category: 'heritage',
    subcategory: 'historic',
    area: 'Pune',
    lat: h.lat,
    lng: h.lng,
    priceLevel: 1,
    avgCost: 50,
    tags: ['Heritage', 'Tourism'],
    description: h.description,
    bestTime: 'Morning',
    openHours: '8:00 AM - 6:00 PM',
    image: h.image,
    scores: { safety: 90, cleanliness: 80, affordability: 95, rating: 92, accessibility: 75 },
    verified: true
  });
});

export default pune
