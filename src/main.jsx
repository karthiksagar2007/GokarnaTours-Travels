/* Gokarna Darshana Holidays — public site entry point.
   Live Firestore subscriptions publish admin-managed places & packages. */
import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { firebaseConfigured, db } from './firebase.js';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import './site.css';

import Nav from './components/Nav.jsx';
import Explore from './components/Explore.jsx';
import { QuickEnquiry, Places, Services, Fleet, Temples } from './components/home-sections.jsx';
import { Packages, About, Testimonials, Gallery, Contact, Footer, FloatingActions } from './components/info-sections.jsx';
import { useReveal } from './components/ui.jsx';

function App() {
  const [adminPlaces, setAdminPlaces] = useState([]);
  const [adminPackages, setAdminPackages] = useState([]);

  /* Live subscriptions: only published docs from the admin dashboard reach the site. */
  useEffect(() => {
    if (!firebaseConfigured || !db) return undefined;
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
      <Nav />
      {!firebaseConfigured && (
        <div className="setup-banner" role="alert">
          <b>Demo mode.</b> Add your Firebase web config to <code>.env</code> (see <code>.env.example</code>) to enable live places, packages and bookings.
        </div>
      )}
      <Explore />
      <QuickEnquiry />
      <Places adminPlaces={adminPlaces} />
      <Services />
      <Fleet onEnquiry={goEnquiry} />
      <Temples />
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