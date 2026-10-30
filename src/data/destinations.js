/* Coastal Karnataka destinations â€” verified real coordinates and genuine
   Wikimedia Commons photographs of each place. */
import { wm, IMG } from './site.js';

export const CATS = [
  { id: 'all', label: 'All', icon: 'compass' },
  { id: 'beach', label: 'Beaches', icon: 'waves' },
  { id: 'temple', label: 'Temples', icon: 'landmark' },
  { id: 'nature', label: 'Nature', icon: 'mountain' },
  { id: 'waterfall', label: 'Waterfalls', icon: 'leaf' },
  { id: 'heritage', label: 'Heritage', icon: 'route' },
];

export const DESTINATIONS = [
  { id: 'om-beach', name: 'Om Beach', cat: 'beach', area: 'Gokarna, Karnataka', lat: 14.5483, lng: 74.3197, img: wm('PXL 20260103 101009613 People and Beach Om Beach Gokarna, Karnataka 13.jpg', 1200), desc: 'A stunning beach shaped like the sacred Om symbol, known for its peaceful vibes and scenic beauty.' },
  { id: 'kudle-beach', name: 'Kudle Beach', cat: 'beach', area: 'Gokarna, Karnataka', lat: 14.5432, lng: 74.3127, img: wm('Sunset in the Arabian sea, Kudle Beach, Gokarna, Karnataka.jpg', 1200), desc: 'Popular among travellers for its relaxed atmosphere, clean shores and beach shacks.' },
  { id: 'gokarna', name: 'Gokarna & Main Beach', cat: 'beach', area: 'Gokarna, Karnataka', lat: 14.55, lng: 74.3153, img: wm('Gokarna Beach - panoramio.jpg', 1200), desc: 'The sacred temple town and its main beach â€” the traditional starting point of every coastal yatre.' },
  { id: 'paradise-beach', name: 'Paradise Beach', cat: 'beach', area: 'Gokarna, Karnataka', lat: 14.5286, lng: 74.3412, img: wm('PXL 20260103 054657562.MP Paradise beach gokarna Paradise Beach Trail, Gokarna, Karnataka 581326 06.jpg', 1200), desc: 'A hidden crescent of golden sand reached through a scenic cliff trail from Om Beach.' },
  { id: 'half-moon-beach', name: 'Half Moon Beach', cat: 'beach', area: 'Gokarna, Karnataka', lat: 14.5386, lng: 74.3294, img: wm('PXL 20260103 091848995.MP Half Moon Beach Gokarna Karnatak 01.jpg', 1200), desc: 'A quiet shell-shaped cove between Om and Paradise, perfect for a peaceful pause by the sea.' },
  { id: 'mahabaleshwar', name: 'Mahabaleshwar Temple', cat: 'temple', area: 'Gokarna, Karnataka', lat: 14.5525, lng: 74.3128, img: wm('Entrance to Gokarna Mahabaleshwar Temple - panoramio.jpg', 1200), desc: 'One of the most sacred temples in the region, home to the revered Atmalinga of Lord Shiva.' },
  { id: 'maha-ganapati', name: 'Maha Ganapati Temple', cat: 'temple', area: 'Gokarna, Karnataka', lat: 14.5544, lng: 74.3124, img: wm('Shri Ganesh Temple at Gokarna - panoramio.jpg', 1200), desc: 'The much-visited Ganapati shrine on the path to the Mahabaleshwar temple.' },
  { id: 'yana', name: 'Yana Caves', cat: 'nature', area: 'Kumta, Karnataka', lat: 14.5651, lng: 74.493, img: wm('KW23-0646-YanaRocks-EntranceCaves 3D.jpg', 1200), desc: 'Famous for its massive rock formations and mysterious caves in the Western Ghats.' },
  { id: 'mirjan-fort', name: 'Mirjan Fort', cat: 'heritage', area: 'Mirjan, Kumta', lat: 14.7727, lng: 74.5215, img: wm('Mirjan Fort, Karnataka (60720).jpg', 1200), desc: 'A 16th-century laterite fort of Queen Chennabhaira Devi, ringed by moats and palm groves.' },
  { id: 'murudeshwar-temple', name: 'Murudeshwar Temple', cat: 'temple', area: 'Murudeshwar, Karnataka', lat: 14.0936, lng: 74.4853, img: wm('Murudeshwar temple, Karnataka, Lord Shiva.jpg', 1200), desc: 'Home to the worldâ€™s second largest Shiva statue and a magnificent temple on the Kanduka hill.' },
  { id: 'shiva-statue', name: 'Shiva Statue', cat: 'temple', area: 'Murudeshwar, Karnataka', lat: 14.0939, lng: 74.4862, img: wm('Murudeshwar Shiva Statue.jpg', 1200), desc: 'The towering 123-ft statue of Lord Shiva glistening against the Arabian Sea.' },
  { id: 'murudeshwar-beach', name: 'Murudeshwar Beach', cat: 'beach', area: 'Murudeshwar, Karnataka', lat: 14.0907, lng: 74.4871, img: wm('Shiva statue murudeshwar beach.jpg', 1200), desc: 'A lively beach circling the temple hill, with the statue watching over the waves.' },
  { id: 'netrani', name: 'Netrani Island', cat: 'nature', area: 'Off Murudeshwar, Karnataka', lat: 14.0269, lng: 74.4297, img: wm('Netrani Island Arial View.jpg', 1200), desc: 'A heart-shaped island off the coast, famous for scuba diving, coral reefs and clear waters.' },
  { id: 'apsarakonda', name: 'Apsarakonda Waterfalls', cat: 'waterfall', area: 'Honnavar, Karnataka', lat: 14.2904, lng: 74.4349, img: wm('Apsarakonda Falls.jpg', 1200), desc: 'A breathtaking waterfall surrounded by lush greenery and scenic hills near Honnavar.' },
  { id: 'kasarkod', name: 'Kasarkod Eco Beach', cat: 'beach', area: 'Honnavar, Karnataka', lat: 14.2664, lng: 74.4297, img: wm('Kasrkod-beach-park-Honnavar.jpg', 1200), desc: 'A pristine eco beach backed by casuarina groves, just across the Sharavathi from Honnavar.' },
  { id: 'sharavathi', name: 'Sharavathi Backwaters', cat: 'nature', area: 'Honnavar, Karnataka', lat: 14.238, lng: 74.467, img: IMG.honnemaradu, desc: 'Emerald backwater islands of the Sharavathi river â€” kayaking, birdlife and quiet sunsets.' },
  { id: 'mangrove', name: 'Mangrove Boardwalk', cat: 'nature', area: 'Kasarkod, Honnavar', lat: 14.2757, lng: 74.433, img: wm('PXL 20260104 074653483.MP Sharavathi Kandla Mangrove Boardwalk Honnavar, Kasarkoda, Karnataka 581342 07.jpg', 1200), desc: 'A serene boardwalk drifting through the Sharavathi Kandla mangrove forest.' },
  { id: 'idagunji', name: 'Idagunji Ganapati Temple', cat: 'temple', area: 'Idagunji, Uttara Kannada', lat: 14.2293, lng: 74.4687, img: wm('2025 Idagunji Ganesh Temple view.jpg', 1200), desc: 'The ancient Vinayaka kshetra worshipped at the start of every coastal temple yatre.' },
  { id: 'kollur', name: 'Kollur Mookambika Temple', cat: 'temple', area: 'Kollur, Udupi', lat: 13.8658, lng: 74.7672, img: wm('Kollur Mookambika temple entrance gate.jpg', 1200), desc: 'The revered seat of Goddess Mookambika in the foothills of the Kodachadri hills.' },
  { id: 'anegudde', name: 'Anegudde Vinayaka Temple', cat: 'temple', area: 'Kumbhashi, Udupi', lat: 13.689, lng: 74.6843, img: wm('Anegudde Sri Vinayaka Temple.jpeg', 1200), desc: 'A prominent Vinayaka shrine on the coastal highway, known for its chariot and carvings.' },
];

/* Bounds of the whole coastal stretch â€” used to frame the map on load. */
export const DEST_BOUNDS = [
  [13.62, 74.25],
  [14.83, 74.83],
];

/* Great-circle distance between two coordinates, in kilometres. */
export function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const toR = (x) => (x * Math.PI) / 180;
  const dLat = toR(lat2 - lat1);
  const dLng = toR(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toR(lat1)) * Math.cos(toR(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}