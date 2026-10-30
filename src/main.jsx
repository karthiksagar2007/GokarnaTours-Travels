import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { firebaseConfigured, db, functions } from './firebase.js';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import './site.css';

const PHONE_DISPLAY = '+91 94492 03403';
const PHONE_RAW = '919449203403';
const NAV = [
  ['Home', '#home'],
  ['Destinations', '#destinations'],
  ['Tour Packages', '#packages'],
  ['Experiences', '#fleet'],
  ['About Us', '#about'],
  ['Contact', '#contact'],
];

/* High-resolution photography of the real destinations (Wikimedia Commons + Unsplash). */
const IMG = {
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

/* Popular places shown on the homepage; admin-added places from Firestore are appended live. */
const DEFAULT_PLACES = [
  { name: 'Gokarna Beach', sub: 'Serene shores & cliff vibes', img: IMG.omBeach },
  { name: 'Murudeshwar', sub: 'Grand temple & coastal beauty', img: IMG.murudeshwar },
  { name: 'Udupi', sub: 'Spiritual town & divine cuisine', img: IMG.udupi },
  { name: 'Agumbe', sub: 'Rainforests & breathtaking views', img: IMG.agumbe },
  { name: 'Kudremukh', sub: 'Trekking & natural beauty', img: IMG.kudremukh },
  { name: 'Honnemaradu', sub: 'Peaceful lake & scenic charm', img: IMG.honnemaradu },
];

const SERVICES = [
  { title: 'Beach Escapes', desc: 'Golden beaches, clear waters and peaceful vibes.', from: 1999, img: IMG.paradise, icon: 'waves' },
  { title: 'Temple Tours', desc: 'Spiritual journeys to ancient temples and sacred places.', from: 2499, img: IMG.murudeshwarBeach, icon: 'landmark' },
  { title: 'Nature & Hills', desc: 'Explore the Western Ghats and scenic waterfalls.', from: 2199, img: IMG.yana, icon: 'mountain' },
  { title: 'Vehicle Rentals', desc: 'Comfortable and safe vehicles for your journey.', from: 1499, img: IMG.ertiga, icon: 'car' },
];
/* Fleet with transparent per-day pricing. */
const FLEET = [
  { name: 'Swift / Dzire', type: 'Sedan', seats: '4+1 Seater', price: 4000, img: IMG.dzire, popular: true, features: ['AC', '4+1 Seats', '2 Bags'], desc: 'Perfect for couples & small families.' },
  { name: 'Ertiga', type: 'MUV', seats: '6+1 Seater', price: 5000, img: IMG.ertiga, popular: true, features: ['AC', '6+1 Seats', '3 Bags'], desc: 'Spacious family comfort for coastal runs.' },
  { name: 'Innova Crysta', type: 'Premium SUV', seats: '6+1 / 7+1', price: 6000, img: IMG.innova, popular: true, features: ['AC', 'Premium', 'Captain Seats'], desc: 'Executive class travel for long yatres.' },
  { name: 'Tempo Travel Package', type: 'Maxi Cab', seats: '12+1 Seater', price: 7000, img: IMG.tempoBus, popular: false, features: ['Tempo Vehicle', 'Guide Included', 'Prasada'], desc: 'Gokarna • Murudeshwar • Idagunji yatre circuit.' },
  { name: 'Mini Bus', type: 'Tempo Traveller', seats: '13–17 Seater', price: 7500, img: IMG.traveller, popular: false, features: ['AC / Non-AC', 'Pushback', 'Music'], desc: 'Comfortable for friends & family groups.' },
  { name: '22 Seat Bus', type: 'Coach', seats: '22 Seater', price: 10000, img: IMG.volvoBus, popular: false, features: ['2x2 Seater', 'AC', 'Luggage Space'], desc: 'Great for pilgrimage groups.' },
  { name: '45 Seat Bus', type: 'Luxury Coach', seats: '45 Seater', price: 15000, img: IMG.luxuryBus, popular: false, features: ['Full AC', 'Air Suspension', 'Onboard WC*'], desc: 'Large yatre groups on long routes.' },
];

/* Shown when no tour packages are published from the admin dashboard yet. */
const FALLBACK_PACKAGES = [
  { name: 'Gokarna Temple Yatre', region: 'Gokarna', duration: '2 Days / 1 Night', price: 4999, imageUrl: IMG.murudeshwarBeach, description: 'Mahabaleshwar Atmalinga darshana, Om Beach sunset and Kudle cliffs with a madi-friendly itinerary.' },
  { name: 'Murudeshwar–Idagunji Circuit', region: 'Coastal Karnataka', duration: '1 Day', price: 2999, imageUrl: IMG.murudeshwar, description: '123 ft Shiva statue, Idagunji Ganapati and beachside prasada with an experienced coastal driver.' },
  { name: 'Sahyadri Nature Escape', region: 'Agumbe • Kudremukh', duration: '2 Days / 1 Night', price: 3999, imageUrl: IMG.kudremukh, description: 'Agumbe sunset point, rainforest walks and Kudremukh viewpoints — a refreshing hill escape.' },
];

const TESTIMONIALS = [
  { name: 'Rohit S', city: 'Bengaluru', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', text: 'Amazing experience! The team was very supportive and the places were beyond beautiful. Highly recommended!' },
  { name: 'Priya M', city: 'Mysuru', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', text: 'Perfectly planned trip with great accommodation and transport. Gokarna Darshana Holidays made our vacation truly special!' },
  { name: 'Arjun K', city: 'Shivamogga', avatar: 'https://randomuser.me/api/portraits/men/75.jpg', text: 'The coastal views, temples and overall experience were just awesome. Will definitely plan another trip with them!' },
];
/* Inline stroke icons (lucide-style paths). */
const ICONS = {
  pin: ['M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z', 'M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z'],
  calendar: ['M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6Z', 'M16 2v4', 'M8 2v4', 'M3 10h18'],
  users: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z', 'M22 21v-2a4 4 0 0 0-3-3.87', 'M16 3.13a4 4 0 0 1 0 7.75'],
  compass: ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z', 'm16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12Z'],
  search: ['M11 3a8 8 0 1 0 0 16 8 8 0 0 0 0-16Z', 'm21 21-4.3-4.3'],
  menu: ['M4 6h16', 'M4 12h16', 'M4 18h16'],
  close: ['M18 6 6 18', 'm6 6 12 12'],
  phone: ['M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z'],
  mail: ['M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z', 'm22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7'],
  clock: ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z', 'M12 6v6l4 2'],
  star: ['M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2Z'],
  check: ['M20 6 9 17l-5-5'],
  shield: ['M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1Z', 'm9 12 2 2 4-4'],
  headphones: ['M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3'],
  leaf: ['M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z', 'M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12'],
  route: ['M6 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z', 'M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15', 'M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z'],
  car: ['M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2', 'M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z', 'M17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z'],
  bed: ['M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8', 'M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4', 'M12 4v6', 'M2 18h20'],
  receipt: ['M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z', 'M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8', 'M12 17.5v-11'],
  badge: ['M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z', 'm15 9-6 6', 'M9.5 9.5h.01', 'M14.5 14.5h.01'],
  arrowRight: ['M5 12h14', 'm12 5 7 7-7 7'],
  arrowUp: ['m5 12 7-7 7 7', 'M12 19V5'],
  chevronDown: ['m6 9 6 6 6-6'],
  facebook: ['M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z'],
  instagram: ['M5 2h14a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3Z', 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z', 'M17.5 6.5h.01'],
  youtube: ['M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17Z', 'm10 15 5-3-5-3v6Z'],
  whatsapp: ['M7.9 20A9 9 0 1 0 4 16.1L2 22l5.9-2Z', 'M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z', 'M14 15a.5.5 0 0 0 1 0v-1a.5.5 0 0 0-1 0v1Z'],
  waves: ['M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1', 'M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1', 'M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1'],
  landmark: ['M3 22h18', 'M6 18v-7', 'M10 18v-7', 'M14 18v-7', 'M18 18v-7', 'M12 2l8 5H4l8-5Z'],
  mountain: ['m8 3 4 8 5-5 5 15H2L8 3Z'],
  send: ['m22 2-7 20-4-9-9-4 20-7Z', 'M22 2 11 13'],
};
function I({ n, size = 18, className = '', filled = false }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true"
      fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {ICONS[n].map((d, i) => <path key={i} d={d} />)}
    </svg>
  );
}

function Logo({ light = false }) {
  return (
    <span className="logo">
      <svg className="logo-mark" viewBox="0 0 64 64" aria-hidden="true">
        <circle cx="32" cy="21" r="13" fill="#FFB443" />
        <path d="M8 42c7 0 7-5 14-5s7 5 14 5 7-5 14-5" fill="none" stroke={light ? '#ffffff' : '#0B3954'} strokeWidth="4" strokeLinecap="round" />
        <path d="M14 53c7 0 7-5 14-5s7 5 14 5" fill="none" stroke="#0E7C7B" strokeWidth="4" strokeLinecap="round" />
      </svg>
      <span className="logo-text">
        <b style={light ? { color: '#fff' } : undefined}>Gokarna</b>
        <span>DARSHANA HOLIDAYS</span>
      </span>
    </span>
  );
}
function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); } }),
      { threshold: 0.12 },
    );
    document.querySelectorAll('.reveal').forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

const inr = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');

function Stars({ n = 5 }) {
  return <span className="stars">{Array.from({ length: 5 }, (_, i) => <I key={i} n="star" size={14} filled={i < n} className={i < n ? 'star-on' : 'star-off'} />)}</span>;
}

function Badge({ children, icon = 'check' }) {
  return <span className="badge"><I n={icon} size={13} /> {children}</span>;
}

function Nav({ onEnquiry }) {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const fn = () => setSolid(window.scrollY > 40);
    fn();
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  const go = (hash) => { setOpen(false); const el = document.querySelector(hash); if (el) el.scrollIntoView({ behavior: 'smooth' }); };
  return (
    <header className={'nav' + (solid ? ' nav-solid' : '')}>
      <div className="container nav-inner">
        <a href="#home" className="nav-brand" onClick={(e) => { e.preventDefault(); go('#home'); }}><Logo /></a>
        <nav className={'nav-links' + (open ? ' open' : '')}>
          {NAV.map(([label, hash]) => (
            <a key={hash} href={hash} onClick={(e) => { e.preventDefault(); go(hash); }}>{label}</a>
          ))}
          <a className="nav-cta" href="#contact" onClick={(e) => { e.preventDefault(); setOpen(false); onEnquiry(); }}>Book Now</a>
        </nav>
        <div className="nav-right">
          <a className="nav-phone" href={'tel:+' + PHONE_RAW}><I n="phone" size={15} /> {PHONE_DISPLAY}</a>
          <button className={'burger' + (open ? ' is-open' : '')} aria-label="Menu" onClick={() => setOpen(!open)}>
            {open ? <I n="close" size={22} /> : <I n="menu" size={22} />}
          </button>
        </div>
      </div>
    </header>
  );
}

function Hero({ onEnquiry }) {
  return (
    <section id="home" className="hero">
      <img className="hero-bg" src={IMG.omBeachWide} alt="Om Beach, Gokarna — aerial view of the OM-shaped coastline" />
      <div className="hero-overlay" />
      <div className="container hero-inner">
        <span className="hero-eyebrow"><I n="pin" size={14} /> Gokarna • Karwar • Murudeshwar • Udupi</span>
        <h1>Sacred Shores, <em>Timeless</em> Journeys</h1>
        <p className="hero-sub">Darshana holidays along the Karnataka coast — temples, beaches and the Sahyadri hills, planned with care and driven by locals.</p>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={onEnquiry}><I n="calendar" size={17} /> Plan My Yatre</button>
          <a className="btn btn-ghost" href="#packages" onClick={(e) => { e.preventDefault(); document.querySelector('#packages')?.scrollIntoView({ behavior: 'smooth' }); }}>
            View Packages <I n="arrowRight" size={16} />
          </a>
        </div>
        <div className="hero-facts">
          {[['star', '4.9/5 traveller rating'], ['shield', 'Verified local drivers'], ['receipt', 'Transparent per-day pricing']].map(([ic, tx]) => (
            <span key={tx} className="fact"><I n={ic} size={15} /> {tx}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
/* Quick Enquiry — transparent per-day pricing, no vehicle-type picker. */
function QuickEnquiry() {
  const [form, setForm] = useState({ name: '', phone: '', date: '', days: 1, travellers: 2, notes: '' });
  const [status, setStatus] = useState({ kind: '', msg: '' });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const estimate = Number(form.days || 0) * 4500;
  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !/^\d{10}$/.test(form.phone.replace(/\D/g, '').slice(-10))) {
      setStatus({ kind: 'err', msg: 'Please enter your name and a valid 10-digit phone number.' });
      return;
    }
    setStatus({ kind: 'wait', msg: 'Sending your enquiry…' });
    try {
      if (firebaseConfigured && functions) {
        const notes = form.notes.trim();
        await httpsCallable(functions, 'createBooking')({
          page: 'home-quick-enquiry',
          fields: {
            name: form.name.trim(),
            phone: form.phone.trim(),
            travel_date: form.date,
            days: String(form.days || 1),
            travellers: String(form.travellers || 1),
            message: [
              'Quick enquiry from homepage',
              'Days: ' + (form.days || 1),
              'Travellers: ' + (form.travellers || 1),
              'Travel date: ' + (form.date || 'flexible'),
              notes ? 'Notes: ' + notes : '',
            ].filter(Boolean).join(' • '),
          },
        });
      }
      setStatus({ kind: 'ok', msg: 'Dhanyavagalu! We received your enquiry and will call you shortly on ' + form.phone + '.' });
      setForm({ name: '', phone: '', date: '', days: 1, travellers: 2, notes: '' });
    } catch (err) {
      console.error(err);
      setStatus({ kind: 'err', msg: 'Could not send right now — please WhatsApp us on ' + PHONE_DISPLAY + '.' });
    }
  };
  return (
    <section className="enquiry" id="enquiry">
      <div className="container enquiry-grid">
        <div className="enquiry-copy">
          <span className="kicker">Quick Enquiry</span>
          <h2>Tell us your plan — we&apos;ll do the rest</h2>
          <p>Share your dates and group size. Our travel desk calls you back with a fixed, all-inclusive quote: vehicle, driver allowance, fuel, tolls and parking included.</p>
          <ul className="tick-list">
            <li><I n="check" size={15} /> Transparent <b>per-day pricing</b> — no hidden charges</li>
            <li><I n="check" size={15} /> One quote covers fuel, driver, tolls &amp; parking</li>
            <li><I n="check" size={15} /> Madi-friendly itineraries for temple yatres</li>
            <li><I n="check" size={15} /> Free cancellation up to 48 hours before travel</li>
          </ul>
          <div className="enquiry-call"><I n="phone" size={16} /> Prefer to talk? <a href={'tel:+' + PHONE_RAW}>{PHONE_DISPLAY}</a></div>
        </div>
        <form className="card enquiry-form" onSubmit={submit} noValidate>
          <div className="field-row">
            <label className="field"><span>Your Name *</span>
              <input value={form.name} onChange={set('name')} placeholder="e.g. Ramesh Nayak" required />
            </label>
            <label className="field"><span>Phone *</span>
              <input value={form.phone} onChange={set('phone')} placeholder="10-digit mobile" inputMode="tel" required />
            </label>
          </div>
          <div className="field-row">
            <label className="field"><span>Travel Date</span>
              <input type="date" value={form.date} onChange={set('date')} />
            </label>
            <label className="field"><span>No. of Days</span>
              <input type="number" min="1" max="30" value={form.days} onChange={set('days')} />
            </label>
            <label className="field"><span>Travellers</span>
              <input type="number" min="1" max="50" value={form.travellers} onChange={set('travellers')} />
            </label>
          </div>
          <label className="field"><span>Trip Notes (optional)</span>
            <textarea rows="3" value={form.notes} onChange={set('notes')} placeholder="Temples to visit, pickup city, budget…" />
          </label>
          <div className="estimate"><I n="receipt" size={16} /> Ballpark: <b>{inr(estimate)}</b> <span>for {form.days || 1} day(s) — final quote on call</span></div>
          <button className="btn btn-primary btn-block" type="submit" disabled={status.kind === 'wait'}>
            {status.kind === 'wait' ? 'Sending…' : <>Send Enquiry <I n="send" size={16} /></>}
          </button>
          {status.msg && <p className={'form-msg ' + status.kind}>{status.msg}</p>}
        </form>
      </div>
    </section>
  );
}
/* Popular Places — defaults + live additions from the admin dashboard (Firestore). */
function Places({ adminPlaces }) {
  const extra = (adminPlaces || []).map((p) => ({
    name: p.name,
    sub: p.sub || 'Added by our travel desk',
    img: p.imageUrl || IMG.coast,
  }));
  const list = [...DEFAULT_PLACES, ...extra].slice(0, 9);
  return (
    <section className="section" id="destinations">
      <div className="container">
        <div className="section-head reveal">
          <span className="kicker">Popular Places</span>
          <h2>Destinations we know by heart</h2>
          <p>From the Om-shaped coastline to the rainforests of Agumbe — every route is driven by our own local captains.</p>
        </div>
        <div className="places-grid">
          {list.map((p, i) => (
            <article className={'place-card reveal' + (i % 3 === 0 ? ' place-tall' : '')} key={p.name + i}>
              <img src={p.img} alt={p.name} loading="lazy" />
              <div className="place-body">
                <h3>{p.name}</h3>
                <p>{p.sub}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section className="section section-alt" id="services">
      <div className="container">
        <div className="section-head reveal">
          <span className="kicker">What We Offer</span>
          <h2>Curated experiences, one desk</h2>
        </div>
        <div className="services-grid">
          {SERVICES.map((s) => (
            <article className="card service-card reveal" key={s.title}>
              <div className="service-img"><img src={s.img} alt={s.title} loading="lazy" /><span className="service-icon"><I n={s.icon} size={20} /></span></div>
              <div className="service-body">
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <div className="service-foot">
                  <span className="from">from <b>{inr(s.from)}</b></span>
                  <a className="link-more" href="#enquiry">Enquire <I n="arrowRight" size={14} /></a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
/* Fleet — transparent per-day pricing: ₹X/day, all-inclusive. No cartype filter. */
function Fleet({ onEnquiry }) {
  return (
    <section className="section section-fleet" id="fleet">
      <div className="container">
        <div className="section-head reveal">
          <span className="kicker">Our Fleet</span>
          <h2>Fixed <em>per-day</em> pricing. Zero hidden charges.</h2>
          <p>One honest day rate covers the vehicle, driver allowance, fuel, tolls and parking. Pick the size you need — we confirm the exact vehicle before departure.</p>
        </div>
        <div className="pricing-note reveal">
          <I n="badge" size={18} />
          <span><b>Per-day rate includes:</b> fuel • driver bata • tolls &amp; parking • state permits • night halt (on multi-day trips)</span>
        </div>
        <div className="fleet-grid">
          {FLEET.map((v) => (
            <article className="card fleet-card reveal" key={v.name}>
              {v.popular && <span className="pop-flag"><I n="star" size={11} filled /> Most booked</span>}
              <div className="fleet-img"><img src={v.img} alt={v.name + ' — ' + v.type} loading="lazy" /></div>
              <div className="fleet-body">
                <div className="fleet-title">
                  <h3>{v.name}</h3>
                  <span className="fleet-type">{v.type}</span>
                </div>
                <div className="fleet-meta">
                  <span><I n="users" size={14} /> {v.seats}</span>
                  {v.features.slice(0, 2).map((f) => <span key={f}><I n="check" size={14} /> {f}</span>)}
                </div>
                <p className="fleet-desc">{v.desc}</p>
                <div className="fleet-price">
                  <div className="price-tag">
                    <b>{inr(v.price)}</b><span>/day</span>
                  </div>
                  <button className="btn btn-sm btn-outline" onClick={onEnquiry}>Book</button>
                </div>
                <div className="per-day-note">All-inclusive per-day rate — no hidden charges</div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Tour Packages — admin-published packages live from Firestore, with curated fallback. */
function Packages({ adminPackages }) {
  const live = (adminPackages || []).filter((p) => p.published !== false);
  const list = live.length ? live : FALLBACK_PACKAGES;
  return (
    <section className="section" id="packages">
      <div className="container">
        <div className="section-head reveal">
          <span className="kicker">Tour Packages</span>
          <h2>Ready-made yatres, hand-crafted routes</h2>
          <p>Fixed departures with stays, darshana assistance and a dedicated captain. Custom dates available for every package.</p>
        </div>
        <div className="packages-grid">
          {list.map((p, i) => (
            <article className="card pkg-card reveal" key={(p.id || p.name) + i}>
              <div className="pkg-img">
                <img src={p.imageUrl || IMG.coast} alt={p.name} loading="lazy" />
                <span className="pkg-region"><I n="pin" size={12} /> {p.region || 'Karnataka'}</span>
                {p.duration && <span className="pkg-duration"><I n="clock" size={12} /> {p.duration}</span>}
              </div>
              <div className="pkg-body">
                <h3>{p.name}</h3>
                {p.description && <p className="pkg-desc">{p.description}</p>}
                <div className="pkg-foot">
                  <div className="pkg-price">
                    <span className="from">from</span>
                    <b>{inr(p.price)}</b>
                    <span className="pp">/ person</span>
                  </div>
                  <a className="btn btn-sm btn-primary" href={'https://wa.me/' + PHONE_RAW + '?text=' + encodeURIComponent('Hi Gokarna Darshana Holidays! I am interested in the "' + p.name + '" package.')} target="_blank" rel="noreferrer">
                    Enquire
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
const STATS = [
  ['11+', 'Years on the coast'],
  ['4.9★', 'Traveller rating'],
  ['50+', 'Curated routes'],
  ['24×7', 'On-trip support'],
];

function About() {
  return (
    <section className="section section-about" id="about">
      <div className="container about-grid">
        <div className="about-media reveal">
          <img className="about-main" src={IMG.omBeach} alt="Om Beach, Gokarna" loading="lazy" />
          <img className="about-sub" src={IMG.kudle} alt="Kudle Beach cliffs, Gokarna" loading="lazy" />
          <div className="about-chip"><I n="leaf" size={16} /> Locally owned &amp; operated</div>
        </div>
        <div className="about-copy">
          <span className="kicker">About Us</span>
          <h2>A local team for your coastal &amp; temple journeys</h2>
          <p>
            Gokarna Darshana Holidays is a Gokarna-based travel desk run by people who grew up on these shores.
            We plan <b>darshana-first itineraries</b> — Mahabaleshwar, Murudeshwar, Idagunji, Udupi — around your
            puja timings, and keep every quote simple with <b>transparent per-day pricing</b>.
          </p>
          <ul className="tick-list">
            <li><I n="check" size={15} /> Courteous, background-verified local captains</li>
            <li><I n="check" size={15} /> Clean, sanitised vehicles before every trip</li>
            <li><I n="check" size={15} /> No surge, no commissions, no hidden charges</li>
          </ul>
          <div className="stats-row">
            {STATS.map(([num, label]) => (
              <div className="stat" key={label}><b>{num}</b><span>{label}</span></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="section section-alt" id="testimonials">
      <div className="container">
        <div className="section-head reveal">
          <span className="kicker">Testimonials</span>
          <h2>Loved by yatris &amp; travellers</h2>
        </div>
        <div className="tst-grid">
          {TESTIMONIALS.map((t) => (
            <figure className="card tst-card reveal" key={t.name}>
              <Stars n={5} />
              <blockquote>“{t.text}”</blockquote>
              <figcaption>
                <img src={t.avatar} alt={t.name} loading="lazy" />
                <div><b>{t.name}</b><span>{t.city}</span></div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
const GALLERY = [
  [IMG.paradise, 'Paradise Beach trail'],
  [IMG.murudeshwar, 'Murudeshwar Shiva'],
  [IMG.yana, 'Yana caves'],
  [IMG.mirjan, 'Mirjan Fort'],
  [IMG.honnemaradu, 'Honnemaradu lake'],
  [IMG.kudremukh, 'Kudremukh meadows'],
];

function Gallery() {
  return (
    <section className="section" id="gallery">
      <div className="container">
        <div className="section-head reveal">
          <span className="kicker">Gallery</span>
          <h2>Postcards from our routes</h2>
        </div>
        <div className="gallery-grid">
          {GALLERY.map(([src, alt]) => (
            <figure className="g-item reveal" key={alt}><img src={src} alt={alt} loading="lazy" /><figcaption>{alt}</figcaption></figure>
          ))}
        </div>
      </div>
    </section>
  );
}

const ADDRESS = 'Gokarna Darshana Holidays, Main Road, Gokarna, Uttara Kannada, Karnataka 581326';

function Contact() {
  return (
    <section className="section section-contact" id="contact">
      <div className="container">
        <div className="section-head reveal">
          <span className="kicker">Contact</span>
          <h2>Start your journey today</h2>
          <p>Call, WhatsApp or drop by our Gokarna office — we answer from 6 AM to 10 PM, every day.</p>
        </div>
        <div className="contact-grid">
          <div className="contact-cards">
            <a className="card c-card reveal" href={'tel:+' + PHONE_RAW}><span className="c-ic"><I n="phone" size={18} /></span><div><b>Call us</b><span>{PHONE_DISPLAY}</span></div></a>
            <a className="card c-card reveal" href={'https://wa.me/' + PHONE_RAW} target="_blank" rel="noreferrer"><span className="c-ic wa"><I n="whatsapp" size={18} /></span><div><b>WhatsApp</b><span>Fastest replies, share locations</span></div></a>
            <a className="card c-card reveal" href="mailto:booking@gokarnadarshana.com"><span className="c-ic"><I n="mail" size={18} /></span><div><b>Email</b><span>booking@gokarnadarshana.com</span></div></a>
            <div className="card c-card reveal"><span className="c-ic"><I n="pin" size={18} /></span><div><b>Visit us</b><span>{ADDRESS}</span></div></div>
          </div>
          <div className="card c-map reveal">
            <iframe title="Gokarna Darshana Holidays location map" src="https://www.google.com/maps?q=Gokarna,Karnataka&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </div>
      </div>
    </section>
  );
}
function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="f-brand">
          <Logo light />
          <p>Darshana holidays and coastal rides across Gokarna, Karwar, Murudeshwar and Udupi — with honest per-day pricing.</p>
          <div className="socials">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><I n="facebook" size={16} /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><I n="instagram" size={16} /></a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube"><I n="youtube" size={16} /></a>
            <a href={'https://wa.me/' + PHONE_RAW} target="_blank" rel="noreferrer" aria-label="WhatsApp"><I n="whatsapp" size={16} /></a>
          </div>
        </div>
        <div className="f-col">
          <h4>Explore</h4>
          {NAV.map(([label, hash]) => <a key={hash} href={hash}>{label}</a>)}
        </div>
        <div className="f-col">
          <h4>Contact</h4>
          <a href={'tel:+' + PHONE_RAW}>{PHONE_DISPLAY}</a>
          <a href="mailto:booking@gokarnadarshana.com">booking@gokarnadarshana.com</a>
          <span>{ADDRESS}</span>
        </div>
        <div className="f-col">
          <h4>Office Hours</h4>
          <span>Mon – Sun: 6 AM – 10 PM</span>
          <span>On-trip support: 24×7</span>
          <a className="admin-link" href="/admin.html"><I n="shield" size={13} /> Admin Login</a>
        </div>
      </div>
      <div className="container footer-base">
        <span>© {new Date().getFullYear()} Gokarna Darshana Holidays. All rights reserved.</span>
        <span>Crafted with <I n="waves" size={12} /> on the Karnataka coast</span>
      </div>
    </footer>
  );
}

function FloatingActions() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const fn = () => setShow(window.scrollY > 500);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return (
    <>
      <a className="fab wa" href={'https://wa.me/' + PHONE_RAW + '?text=' + encodeURIComponent('Hi Gokarna Darshana Holidays! I want to plan a trip.')} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp"><I n="whatsapp" size={24} /></a>
      <a className="fab top" href="#home" aria-label="Back to top" style={{ opacity: show ? 1 : 0, pointerEvents: show ? 'auto' : 'none' }}><I n="arrowUp" size={18} /></a>
    </>
  );
}
function App() {
  const [adminPlaces, setAdminPlaces] = useState([]);
  const [adminPackages, setAdminPackages] = useState([]);

  /* Live subscriptions: only published docs from the admin dashboard reach the site. */
  useEffect(() => {
    if (!firebaseConfigured || !db) return;
    const unsub1 = onSnapshot(query(collection(db, 'places'), where('published', '==', true)), (snap) => {
      setAdminPlaces(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    }, (e) => console.warn('places listener', e.message));
    const unsub2 = onSnapshot(query(collection(db, 'packages'), where('published', '==', true)), (snap) => {
      const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      rows.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
      setAdminPackages(rows);
    }, (e) => console.warn('packages listener', e.message));
    return () => { unsub1(); unsub2(); };
  }, []);

  useReveal();
  const goEnquiry = () => document.querySelector('#enquiry')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <>
      <Nav onEnquiry={goEnquiry} />
      {!firebaseConfigured && (
        <div className="setup-banner" role="alert"
          style={{ position: 'fixed', left: 16, bottom: 84, zIndex: 60, background: '#0B3954', color: '#fff', padding: '10px 14px', borderRadius: 10, fontSize: 13, lineHeight: 1.5, maxWidth: 340, boxShadow: '0 8px 24px rgba(0,0,0,.25)' }}>
          <b>Demo mode.</b> Add your Firebase web config to <code>.env</code> (see <code>.env.example</code>) to enable live places, packages and bookings.
        </div>
      )}
      <Hero onEnquiry={goEnquiry} />
      <QuickEnquiry />
      <Places adminPlaces={adminPlaces} />
      <Services />
      <Fleet onEnquiry={goEnquiry} />
      <Packages adminPackages={adminPackages} />
      <About />
      <Testimonials />
      <Gallery />
      <Contact />
      <Footer />
      <FloatingActions />
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);