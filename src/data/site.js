/* Gokarna Darshana Holidays â€” shared site data (contact, imagery, fleet, packages). */

export const PHONE_DISPLAY = '+91 94492 03403';
export const PHONE_RAW = '919449203403';
export const ADDRESS = 'Gokarna Darshana Holidays, Main Road, Gokarna, Uttara Kannada, Karnataka 581326';

export const inr = (n) => 'â‚¹' + Number(n || 0).toLocaleString('en-IN');

/* Wikimedia Commons helper â€” Special:FilePath always resolves to a live, resized image. */
export const wm = (file, width = 1600) =>
  'https://commons.wikimedia.org/wiki/Special:FilePath/' + encodeURIComponent(file) + '?width=' + width;

/* High-resolution photography of the real destinations (Wikimedia Commons + Unsplash). */
export const IMG = {
  omBeach: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/PXL_20260103_101009613_People_and_Beach_Om_Beach_Gokarna%2C_Karnataka_13.jpg/1920px-PXL_20260103_101009613_People_and_Beach_Om_Beach_Gokarna%2C_Karnataka_13.jpg',
  omBeachWide: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/PXL_20260103_101009613_People_and_Beach_Om_Beach_Gokarna%2C_Karnataka_20.jpg/1920px-PXL_20260103_101009613_People_and_Beach_Om_Beach_Gokarna%2C_Karnataka_20.jpg',
  murudeshwar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Murudeshwar-Shiva-Statue.jpg/1920px-Murudeshwar-Shiva-Statue.jpg',
  murudeshwarBeach: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Shiva_statue_murudeshwar_beach.jpg/1920px-Shiva_statue_murudeshwar_beach.jpg',
  udupi: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Udupi_Sri_Krishna_Matha_Temple.jpg/1920px-Udupi_Sri_Krishna_Matha_Temple.jpg',
  agumbe: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/View_from_sunset_point%2C_Agumbe_%2816017939927%29.jpg/1920px-View_from_sunset_point%2C_Agumbe_%2816017939927%29.jpg',
  kudremukh: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Kudremukh_National_Park_from_top.jpg/1920px-Kudremukh_National_Park_from_top.jpg',
  honnemaradu: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Honnemaradu_1.JPG/1920px-Honnemaradu_1.JPG',
  yana: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/KW23-0646-YanaRocks-EntranceCaves_3D.jpg/1920px-KW23-0646-YanaRocks-EntranceCaves_3D.jpg',
  mirjan: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Mirjan_Fort%2C_Karnataka_%2860720%29.jpg/1920px-Mirjan_Fort%2C_Karnataka_%2860720%29.jpg',
  paradise: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PXL_20260103_054657562.MP_Paradise_beach_gokarna_Paradise_Beach_Trail%2C_Gokarna%2C_Karnataka_581326_05.jpg/1920px-PXL_20260103_054657562.MP_Paradise_beach_gokarna_Paradise_Beach_Trail%2C_Gokarna%2C_Karnataka_581326_05.jpg',
  kudle: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Strawberry_Farms%2C_Kudle_Beach%2C_Gokarna_01.jpg/1920px-Strawberry_Farms%2C_Kudle_Beach%2C_Gokarna_01.jpg',
  dzire: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Maruti_Suzuki_Dzire_VXi_VVT.JPG/1920px-Maruti_Suzuki_Dzire_VXi_VVT.JPG',
  ertiga: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Maruti_Suzuki_Ertiga%281%29.jpg/1920px-Maruti_Suzuki_Ertiga%281%29.jpg',
  innova: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Toyota_Innova_Crysta_2.4_Z_front_right.jpg/1920px-Toyota_Innova_Crysta_2.4_Z_front_right.jpg',
  traveller: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Force_Traveller%2C_Leh-Manali_Highway.jpg/1920px-Force_Traveller%2C_Leh-Manali_Highway.jpg',
  volvoBus: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/VOLVO_8400_Bus_of_KURTC_at_KSRTC_Thiruvalla.jpg/1920px-VOLVO_8400_Bus_of_KURTC_at_KSRTC_Thiruvalla.jpg',
  luxuryBus: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Jnurm_Metro_Luxury_bus_APSRTC.jpg/1920px-Jnurm_Metro_Luxury_bus_APSRTC.jpg',
  tempoBus: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Mahindra_Tourister%2C_Pune.jpg/1920px-Mahindra_Tourister%2C_Pune.jpg',
  coast: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1600&q=80',
};
export const DEFAULT_PLACES = [
  { name: 'Gokarna Beach', sub: 'Serene shores & cliff vibes', img: IMG.omBeach },
  { name: 'Murudeshwar', sub: 'Grand temple & coastal beauty', img: IMG.murudeshwar },
  { name: 'Udupi', sub: 'Spiritual town & divine cuisine', img: IMG.udupi },
  { name: 'Agumbe', sub: 'Rainforests & breathtaking views', img: IMG.agumbe },
  { name: 'Kudremukh', sub: 'Trekking & natural beauty', img: IMG.kudremukh },
  { name: 'Honnemaradu', sub: 'Peaceful lake & scenic charm', img: IMG.honnemaradu },
];

export const SERVICES = [
  { title: 'Beach Escapes', desc: 'Golden beaches, clear waters and peaceful vibes.', from: 1999, img: IMG.paradise, icon: 'waves' },
  { title: 'Temple Tours', desc: 'Spiritual journeys to ancient temples and sacred places.', from: 2499, img: IMG.murudeshwarBeach, icon: 'landmark' },
  { title: 'Nature & Hills', desc: 'Explore the Western Ghats and scenic waterfalls.', from: 2199, img: IMG.yana, icon: 'mountain' },
  { title: 'Vehicle Rentals', desc: 'Comfortable and safe vehicles for your journey.', from: 1499, img: IMG.ertiga, icon: 'car' },
];

/* Fleet with transparent per-day pricing. */
export const FLEET = [
  { name: 'Swift / Dzire', type: 'Sedan', seats: '4+1 Seater', price: 4000, img: IMG.dzire, popular: true, features: ['AC', '4+1 Seats', '2 Bags'], desc: 'Perfect for couples & small families.' },
  { name: 'Ertiga', type: 'MUV', seats: '6+1 Seater', price: 5000, img: IMG.ertiga, popular: true, features: ['AC', '6+1 Seats', '3 Bags'], desc: 'Spacious family comfort for coastal runs.' },
  { name: 'Innova Crysta', type: 'Premium SUV', seats: '6+1 / 7+1', price: 6000, img: IMG.innova, popular: true, features: ['AC', 'Premium', 'Captain Seats'], desc: 'Executive class travel for long yatres.' },
  { name: 'Tempo Travel Package', type: 'Maxi Cab', seats: '12+1 Seater', price: 7000, img: IMG.tempoBus, popular: false, features: ['Tempo Vehicle', 'Guide Included', 'Prasada'], desc: 'Gokarna â€¢ Murudeshwar â€¢ Idagunji yatre circuit.' },
  { name: 'Mini Bus', type: 'Tempo Traveller', seats: '13â€“17 Seater', price: 7500, img: IMG.traveller, popular: false, features: ['AC / Non-AC', 'Pushback', 'Music'], desc: 'Comfortable for friends & family groups.' },
  { name: '22 Seat Bus', type: 'Coach', seats: '22 Seater', price: 10000, img: IMG.volvoBus, popular: false, features: ['2x2 Seater', 'AC', 'Luggage Space'], desc: 'Great for pilgrimage groups.' },
  { name: '45 Seat Bus', type: 'Luxury Coach', seats: '45 Seater', price: 15000, img: IMG.luxuryBus, popular: false, features: ['Full AC', 'Air Suspension', 'Onboard WC*'], desc: 'Large yatre groups on long routes.' },
];

/* Shown when no tour packages are published from the admin dashboard yet. */
export const FALLBACK_PACKAGES = [
  { name: 'Gokarna Temple Yatre', region: 'Gokarna', duration: '2 Days / 1 Night', price: 4999, imageUrl: IMG.murudeshwarBeach, description: 'Mahabaleshwar Atmalinga darshana, Om Beach sunset and Kudle cliffs with a madi-friendly itinerary.' },
  { name: 'Murudeshwarâ€“Idagunji Circuit', region: 'Coastal Karnataka', duration: '1 Day', price: 2999, imageUrl: IMG.murudeshwar, description: '123 ft Shiva statue, Idagunji Ganapati and beachside prasada with an experienced coastal driver.' },
  { name: 'Sahyadri Nature Escape', region: 'Agumbe â€¢ Kudremukh', duration: '2 Days / 1 Night', price: 3999, imageUrl: IMG.kudremukh, description: 'Agumbe sunset point, rainforest walks and Kudremukh viewpoints â€” a refreshing hill escape.' },
];

export const TESTIMONIALS = [
  { name: 'Rohit S', city: 'Bengaluru', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', text: 'Amazing experience! The team was very supportive and the places were beyond beautiful. Highly recommended!' },
  { name: 'Priya M', city: 'Mysuru', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', text: 'Perfectly planned trip with great accommodation and transport. Gokarna Darshana Holidays made our vacation truly special!' },
  { name: 'Arjun K', city: 'Shivamogga', avatar: 'https://randomuser.me/api/portraits/men/75.jpg', text: 'The coastal views, temples and overall experience were just awesome. Will definitely plan another trip with them!' },
];

export const GALLERY = [
  [IMG.paradise, 'Paradise Beach trail'],
  [IMG.murudeshwar, 'Murudeshwar Shiva'],
  [IMG.yana, 'Yana caves'],
  [IMG.mirjan, 'Mirjan Fort'],
  [IMG.honnemaradu, 'Honnemaradu lake'],
  [IMG.kudremukh, 'Kudremukh meadows'],
];

export const STATS = [
  ['11+', 'Years on the coast'],
  ['4.9â˜…', 'Traveller rating'],
  ['50+', 'Curated routes'],
  ['24Ã—7', 'On-trip support'],
];