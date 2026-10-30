/* Homepage sections: Quick Enquiry (Firestore/Cloud Function), Popular Places,
   Services, Fleet (vehicle rentals) and the Temples guide. */
import { useState } from 'react';
import { firebaseConfigured, functions } from '../firebase.js';
import { httpsCallable } from 'firebase/functions';
import { PHONE_DISPLAY, PHONE_RAW, inr, IMG, DEFAULT_PLACES, SERVICES, FLEET } from '../data/site.js';
import { DESTINATIONS } from '../data/destinations.js';
import { I } from './ui.jsx';

/* Quick Enquiry â€” transparent per-day pricing, no vehicle-type picker. */
export function QuickEnquiry() {
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
    setStatus({ kind: 'wait', msg: 'Sending your enquiryâ€¦' });
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
            ].filter(Boolean).join(' â€¢ '),
          },
        });
      }
      setStatus({ kind: 'ok', msg: 'Dhanyavagalu! We received your enquiry and will call you shortly on ' + form.phone + '.' });
      setForm({ name: '', phone: '', date: '', days: 1, travellers: 2, notes: '' });
    } catch (err) {
      console.error(err);
      setStatus({ kind: 'err', msg: 'Could not send right now â€” please WhatsApp us on ' + PHONE_DISPLAY + '.' });
    }
  };
  return (
    <section className="enquiry" id="enquiry">
      <div className="container enquiry-grid">
        <div className="enquiry-copy reveal">
          <span className="kicker">Quick Enquiry</span>
          <h2>Tell us your plan â€” we&apos;ll do the rest</h2>
          <p>Share your dates and group size. Our travel desk calls you back with a fixed, all-inclusive quote: vehicle, driver allowance, fuel, tolls and parking included.</p>
          <ul className="tick-list">
            <li><I n="check" size={15} /> Transparent <b>per-day pricing</b> â€” no hidden charges</li>
            <li><I n="check" size={15} /> One quote covers fuel, driver, tolls &amp; parking</li>
            <li><I n="check" size={15} /> Madi-friendly itineraries for temple yatres</li>
            <li><I n="check" size={15} /> Free cancellation up to 48 hours before travel</li>
          </ul>
          <div className="enquiry-call"><I n="phone" size={16} /> Prefer to talk? <a href={'tel:+' + PHONE_RAW}>{PHONE_DISPLAY}</a></div>
        </div>
        <form className="card enquiry-form reveal" onSubmit={submit} noValidate>
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
            <textarea rows="3" value={form.notes} onChange={set('notes')} placeholder="Temples to visit, pickup city, budgetâ€¦" />
          </label>
          <div className="estimate"><I n="receipt" size={16} /> Ballpark: <b>{inr(estimate)}</b> <span>for {form.days || 1} day(s) â€” final quote on call</span></div>
          <button className="btn btn-dark btn-block" type="submit" disabled={status.kind === 'wait'}>
            {status.kind === 'wait' ? 'Sendingâ€¦' : <>Send Enquiry <I n="send" size={16} /></>}
          </button>
          {status.msg && <p className={'form-msg ' + status.kind}>{status.msg}</p>}
        </form>
      </div>
    </section>
  );
}

/* Popular Places â€” defaults + live additions from the admin dashboard (Firestore). */
export function Places({ adminPlaces }) {
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
          <p>From the Om-shaped coastline to the rainforests of Agumbe â€” every route is driven by our own local captains.</p>
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

export function Services() {
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

/* Fleet â€” transparent per-day pricing: â‚¹X/day, all-inclusive. */
export function Fleet({ onEnquiry }) {
  return (
    <section className="section section-fleet" id="experiences">
      <div className="container">
        <div className="section-head reveal">
          <span className="kicker">Our Fleet &amp; Experiences</span>
          <h2>Fixed <em>per-day</em> pricing. Zero hidden charges.</h2>
          <p>One honest day rate covers the vehicle, driver allowance, fuel, tolls and parking. Pick the size you need â€” we confirm the exact vehicle before departure.</p>
        </div>
        <div className="pricing-note reveal">
          <I n="badge" size={18} />
          <span><b>Per-day rate includes:</b> fuel â€¢ driver bata â€¢ tolls &amp; parking â€¢ state permits â€¢ night halt (on multi-day trips)</span>
        </div>
        <div className="fleet-grid">
          {FLEET.map((v) => (
            <article className="card fleet-card reveal" key={v.name}>
              {v.popular && <span className="pop-flag"><I n="star" size={11} filled /> Most booked</span>}
              <div className="fleet-img"><img src={v.img} alt={v.name + ' â€” ' + v.type} loading="lazy" /></div>
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
                  <button className="btn btn-sm btn-ghost" onClick={onEnquiry}>Book</button>
                </div>
                <div className="per-day-note">All-inclusive per-day rate â€” no hidden charges</div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Temples â€” the sacred circuit of Coastal Karnataka. */
export function Temples() {
  const temples = DESTINATIONS.filter((d) => d.cat === 'temple');
  return (
    <section className="section section-temples" id="temples">
      <div className="container">
        <div className="section-head reveal">
          <span className="kicker">Temple Circuit</span>
          <h2>Sacred kshetras of the coast</h2>
          <p>Atmalinga of Gokarna, the sea-side Shiva of Murudeshwar and the Vinayaka kshetras in between â€” planned around your puja timings.</p>
        </div>
        <div className="temples-grid">
          {temples.map((t) => (
            <article className="card temple-card reveal" key={t.id}>
              <div className="temple-img"><img src={t.img} alt={t.name + ' â€” ' + t.area} loading="lazy" /></div>
              <div className="temple-body">
                <h3>{t.name}</h3>
                <span className="dest-loc"><I n="pin" size={13} /> {t.area}</span>
                <p>{t.desc}</p>
                <a className="link-more" href="#enquiry">Plan darshana <I n="arrowRight" size={14} /></a>
              </div>
            </article>
          ))}
        </div>
        <div className="temples-cta reveal">
          <p>Madi-friendly itineraries, early-morning darshana and prasada stops â€” planned by locals.</p>
          <a className="btn btn-dark" href="#enquiry">Plan Your Temple Yatre <I n="arrowRight" size={15} /></a>
        </div>
      </div>
    </section>
  );
}