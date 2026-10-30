/* Informational sections: Tour Packages, About, Testimonials, Gallery,
   Contact, Footer and floating actions. */
import { useEffect, useState } from 'react';
import { PHONE_DISPLAY, PHONE_RAW, ADDRESS, inr, IMG, FALLBACK_PACKAGES, TESTIMONIALS, GALLERY, STATS } from '../data/site.js';
import { I, Logo, Stars } from './ui.jsx';

/* Tour Packages â€” admin-published packages live from Firestore, with curated fallback. */
export function Packages({ adminPackages }) {
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
                  <a className="btn btn-dark btn-sm" href={'https://wa.me/' + PHONE_RAW + '?text=' + encodeURIComponent('Hi Gokarna Darshana Holidays! I am interested in the "' + p.name + '" package.')} target="_blank" rel="noreferrer">
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

export function About() {
  return (
    <section className="section section-about" id="about">
      <div className="container about-grid">
        <div className="about-media reveal">
          <img className="about-main" src={IMG.omBeach} alt="Om Beach, Gokarna" loading="lazy" />
          <img className="about-sub" src={IMG.kudle} alt="Kudle Beach cliffs, Gokarna" loading="lazy" />
          <div className="about-chip"><I n="leaf" size={16} /> Locally owned &amp; operated</div>
        </div>
        <div className="about-copy reveal">
          <span className="kicker">About Us</span>
          <h2>A local team for your coastal &amp; temple journeys</h2>
          <p>
            Gokarna Darshana Holidays is a Gokarna-based travel desk run by people who grew up on these shores.
            We plan <b>darshana-first itineraries</b> â€” Mahabaleshwar, Murudeshwar, Idagunji, Udupi â€” around your
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

export function Testimonials() {
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
              <blockquote>â€œ{t.text}â€</blockquote>
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

export function Gallery() {
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

const NAV_LINKS = [
  ['Explore', '#explore'],
  ['Destinations', '#destinations'],
  ['Experiences', '#experiences'],
  ['Temples', '#temples'],
  ['About', '#about'],
  ['Contact', '#contact'],
];

export function Contact() {
  return (
    <section className="section section-contact" id="contact">
      <div className="container">
        <div className="section-head reveal">
          <span className="kicker">Contact</span>
          <h2>Start your journey today</h2>
          <p>Call, WhatsApp or drop by our Gokarna office â€” we answer from 6 AM to 10 PM, every day.</p>
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

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="f-brand">
          <Logo light />
          <p>Darshana holidays and coastal rides across Gokarna, Karwar, Murudeshwar and Udupi â€” with honest per-day pricing.</p>
          <div className="socials">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><I n="facebook" size={16} /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><I n="instagram" size={16} /></a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube"><I n="youtube" size={16} /></a>
            <a href={'https://wa.me/' + PHONE_RAW} target="_blank" rel="noreferrer" aria-label="WhatsApp"><I n="whatsapp" size={16} /></a>
          </div>
        </div>
        <div className="f-col">
          <h4>Explore</h4>
          {NAV_LINKS.map(([label, hash]) => <a key={hash} href={hash}>{label}</a>)}
        </div>
        <div className="f-col">
          <h4>Contact</h4>
          <a href={'tel:+' + PHONE_RAW}>{PHONE_DISPLAY}</a>
          <a href="mailto:booking@gokarnadarshana.com">booking@gokarnadarshana.com</a>
          <span>{ADDRESS}</span>
        </div>
        <div className="f-col">
          <h4>Office Hours</h4>
          <span>Mon â€“ Sun: 6 AM â€“ 10 PM</span>
          <span>On-trip support: 24Ã—7</span>
          <a className="admin-link" href="admin.html"><I n="shield" size={13} /> Admin Login</a>
        </div>
      </div>
      <div className="container footer-base">
        <span>Â© {new Date().getFullYear()} Gokarna Darshana Holidays. All rights reserved.</span>
        <span>Crafted with <I n="waves" size={12} /> on the Karnataka coast</span>
      </div>
    </footer>
  );
}

export function FloatingActions() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const fn = () => setShow(window.scrollY > 500);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return (
    <>
      <a className="fab wa" href={'https://wa.me/' + PHONE_RAW + '?text=' + encodeURIComponent('Hi Gokarna Darshana Holidays! I want to plan a trip.')} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp"><I n="whatsapp" size={24} /></a>
      <a className="fab top" href="#explore" aria-label="Back to top" style={{ opacity: show ? 1 : 0, pointerEvents: show ? 'auto' : 'none' }}><I n="arrowUp" size={18} /></a>
    </>
  );
}