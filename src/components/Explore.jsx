/* Explore â€” Belmond-inspired interactive map exploration of Coastal Karnataka.
   Leaflet + OpenStreetMap tiles, real browser GPS distances, category filters
   and search. Distances are computed client-side with the haversine formula. */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CATS, DESTINATIONS, DEST_BOUNDS, haversine } from '../data/destinations.js';
import { PHONE_RAW, IMG } from '../data/site.js';
import { I, ICONS } from './ui.jsx';

const CAT_ICON = { beach: 'waves', temple: 'landmark', nature: 'mountain', waterfall: 'leaf', heritage: 'route' };
const CAT_LABEL = Object.fromEntries(CATS.map((c) => [c.id, c.label]));

/* HTML string for the circular dark-teal map pins. */
const pinHtml = (cat) =>
  '<span class="gk-pin gk-pin-' + cat + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' +
  ICONS[CAT_ICON[cat]].map((d) => '<path d="' + d + '"/>').join('') +
  '</svg></span>';

const fmtDist = (km) => (km < 1 ? Math.round(km * 1000) + ' m' : km.toFixed(1) + ' km');

const imgFallback = (e) => { e.currentTarget.onerror = null; e.currentTarget.src = IMG.coast; };

/* ---------------- Interactive Leaflet map ---------------- */
function MapView({ cat, userPos, selId, onSelect }) {
  const elRef = useRef(null);
  const mapRef = useRef(null);
  const layerRef = useRef(null);
  const userRef = useRef(null);
  const markersRef = useRef({});

  /* Create the map once on mount; destroy on unmount (view switches). */
  useEffect(() => {
    const map = L.map(elRef.current, { zoomControl: false, scrollWheelZoom: false });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    layerRef.current = L.layerGroup().addTo(map);
    map.fitBounds(DEST_BOUNDS, { padding: [26, 26] });
    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; layerRef.current = null; };
  }, []);

  /* Rebuild destination markers whenever the category filter changes. */
  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    layer.clearLayers();
    markersRef.current = {};
    DESTINATIONS.forEach((d) => {
      if (cat !== 'all' && d.cat !== cat) return;
      const m = L.marker([d.lat, d.lng], {
        icon: L.divIcon({ className: 'gk-pin-wrap', html: pinHtml(d.cat), iconSize: [36, 36], iconAnchor: [18, 18] }),
        riseOnHover: true,
        title: d.name,
      }).addTo(layer);
      m.bindTooltip(d.name, { permanent: true, direction: 'right', offset: [14, 0], className: 'gk-label' });
      m.on('click', () => onSelect(d.id));
      markersRef.current[d.id] = m;
    });
  }, [cat, onSelect]);

  /* Highlight + gently fly to the selected destination. */
  useEffect(() => {
    Object.entries(markersRef.current).forEach(([id, m]) => {
      const el = m.getElement && m.getElement();
      if (el) el.classList.toggle('is-selected', id === selId);
    });
    if (selId) {
      const d = DESTINATIONS.find((x) => x.id === selId);
      if (d && mapRef.current) mapRef.current.flyTo([d.lat, d.lng], Math.max(mapRef.current.getZoom(), 12), { duration: 0.8 });
    }
  }, [selId]);

  /* Real GPS position marker. */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (userRef.current) { map.removeLayer(userRef.current); userRef.current = null; }
    if (!userPos) return;
    userRef.current = L.marker([userPos.lat, userPos.lng], {
      icon: L.divIcon({ className: 'gk-user-wrap', html: '<span class="gk-user"><i></i></span>', iconSize: [22, 22], iconAnchor: [11, 11] }),
      zIndexOffset: 1000,
      interactive: false,
    }).addTo(map);
  }, [userPos]);

  return <div className="xp-map" ref={elRef} role="application" aria-label="Interactive map of Coastal Karnataka" />;
}

/* ---------------- Explore section (panel + map + nearby cards) ---------------- */
export default function Explore() {
  const [cat, setCat] = useState('all');
  const [q, setQ] = useState('');
  const [view, setView] = useState('map');
  const [userPos, setUserPos] = useState(null);
  const [locMsg, setLocMsg] = useState('');
  const [locBusy, setLocBusy] = useState(false);
  const [sort, setSort] = useState('default');
  const [selId, setSelId] = useState(null);

  /* Stable callback so map markers are not rebuilt on every render. */
  const handleSelect = useCallback((id) => setSelId(id), []);

  /* Filtered + distance-aware destination list (real haversine distances). */
  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let rows = DESTINATIONS.filter((d) => (cat === 'all' || d.cat === cat) && (!needle || (d.name + ' ' + d.area + ' ' + d.desc).toLowerCase().includes(needle)));
    rows = rows.map((d) => ({ ...d, dist: userPos ? haversine(userPos.lat, userPos.lng, d.lat, d.lng) : null }));
    if (userPos && sort === 'nearest') rows.sort((a, b) => a.dist - b.dist);
    else if (sort === 'az') rows.sort((a, b) => a.name.localeCompare(b.name));
    return rows;
  }, [cat, q, userPos, sort]);

  /* Real browser GPS â€” no simulated or assumed positions. */
  const requestLocation = () => {
    if (!('geolocation' in navigator)) {
      setLocMsg('Your browser does not support location. Please search the destinations manually below.');
      return;
    }
    setLocBusy(true);
    setLocMsg('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const p = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserPos(p);
        setLocBusy(false);
        setSort('nearest');
        const kmFromGokarna = haversine(p.lat, p.lng, 14.55, 74.31);
        setLocMsg('Showing real distances from your current location' + (kmFromGokarna > 60 ? ' â€” you are about ' + Math.round(kmFromGokarna) + ' km from Gokarna.' : '.'));
      },
      (err) => {
        setLocBusy(false);
        setLocMsg(err.code === 1
          ? 'Location permission was denied. You can still explore and search destinations below.'
          : 'Could not get your location right now. Please try again, or search destinations manually.');
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 },
    );
  };

  /* Close the destination dialog with Escape. */
  useEffect(() => {
    if (!selId) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setSelId(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selId]);

  const selected = DESTINATIONS.find((d) => d.id === selId) || null;

  const focusOn = (d) => {
    setSelId(d.id);
    if (view === 'list') setView('map');
  };
  return (
    <section className="explore" id="explore">
      <div className="xp-wrap">
        <aside className="xp-panel">
          <span className="kicker">Discover</span>
          <h1 className="xp-title">Explore Coastal Karnataka</h1>
          <p className="xp-sub">Discover beaches, ancient temples, waterfalls and hidden coastal destinations.</p>
          <div className="xp-toggle" role="group" aria-label="Explore view">
            <button className={view === 'map' ? 'on' : ''} onClick={() => setView('map')} aria-pressed={view === 'map'}><I n="map" size={15} /> Map</button>
            <button className={view === 'list' ? 'on' : ''} onClick={() => setView('list')} aria-pressed={view === 'list'}><I n="list" size={15} /> List</button>
          </div>
          <FilterChips cat={cat} setCat={setCat} />
          <button className="btn btn-dark btn-block" onClick={requestLocation} disabled={locBusy}>
            <I n="locate" size={16} /> {locBusy ? 'Finding youâ€¦' : 'Use My Current Location'}
          </button>
          {locMsg && <p className={'xp-locmsg' + (userPos ? ' ok' : '')} role="status">{locMsg}</p>}
          <label className="xp-search">
            <I n="search" size={16} />
            <input type="search" placeholder="Search destinationsâ€¦" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search destinations" />
          </label>
        </aside>

        {view === 'map' ? (
          <MapView cat={cat} userPos={userPos} selId={selId} onSelect={handleSelect} />
        ) : (
          <div className="xp-list" role="list" aria-label="Destination list">
            {list.length === 0 && <p className="xp-empty">No destinations match your search.</p>}
            {list.map((d) => (
              <button className="xp-row" role="listitem" key={d.id} onClick={() => focusOn(d)}>
                <img src={d.img} alt="" loading="lazy" onError={imgFallback} />
                <span className="xp-row-main"><b>{d.name}</b><span>{d.area}</span></span>
                {d.dist != null && <span className="dest-dist static">{fmtDist(d.dist)}</span>}
                <I n="arrowRight" size={15} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Nearby attractions â€” horizontal snap-scrolling destination cards */}
      <div className="nearby container" id="nearby">
        <div className="nearby-head">
          <div>
            <span className="kicker">Nearby Attractions</span>
            <h2>Top Destinations Near You</h2>
          </div>
          <div className="nearby-tools">
            <FilterChips cat={cat} setCat={setCat} />
            <label className="sort-select">
              Sort by:
              <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort destinations">
                <option value="default">Featured</option>
                <option value="nearest" disabled={!userPos}>Nearest</option>
                <option value="az">A â€“ Z</option>
              </select>
            </label>
          </div>
        </div>
        <div className="nearby-row" tabIndex="0">
          {list.length === 0 && <p className="xp-empty">No destinations match your search.</p>}
          {list.map((d) => (
            <article className="dest-card" key={d.id} onClick={() => focusOn(d)}>
              <div className="dest-media">
                <img src={d.img} alt={d.name + ' â€” ' + d.area} loading="lazy" onError={imgFallback} />
                <span className="dest-cat"><I n={CAT_ICON[d.cat]} size={13} /> {CAT_LABEL[d.cat]}</span>
                {d.dist != null && <span className="dest-dist">{fmtDist(d.dist)}</span>}
              </div>
              <div className="dest-body">
                <h3>{d.name}</h3>
                <span className="dest-loc"><I n="pin" size={13} /> {d.area}</span>
                <p>{d.desc}</p>
                <button className="dest-more" onClick={(e) => { e.stopPropagation(); setSelId(d.id); }}>
                  Explore <I n="arrowRight" size={14} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {selected && (
        <DestModal
          d={selected}
          dist={userPos ? haversine(userPos.lat, userPos.lng, selected.lat, selected.lng) : null}
          onClose={() => setSelId(null)}
        />
      )}
    </section>
  );
}

function FilterChips({ cat, setCat }) {
  return (
    <div className="xp-filters" role="group" aria-label="Filter by category">
      {CATS.map((c) => (
        <button key={c.id} className={'chip' + (cat === c.id ? ' on' : '')} onClick={() => setCat(c.id)} aria-pressed={cat === c.id}>
          <I n={c.icon} size={14} /> {c.label}
        </button>
      ))}
    </div>
  );
}

/* Destination detail dialog with real directions and WhatsApp planning. */
function DestModal({ d, dist, onClose }) {
  return (
    <div className="dest-modal" onClick={onClose} role="presentation">
      <div className="dest-dialog" role="dialog" aria-modal="true" aria-label={d.name} onClick={(e) => e.stopPropagation()}>
        <button className="dest-close" onClick={onClose} aria-label="Close details"><I n="close" size={18} /></button>
        <div className="dest-dialog-media"><img src={d.img} alt={d.name + ' â€” ' + d.area} onError={imgFallback} /></div>
        <div className="dest-dialog-body">
          <span className="dest-cat static"><I n={CAT_ICON[d.cat]} size={13} /> {CAT_LABEL[d.cat]}</span>
          <h3>{d.name}</h3>
          <span className="dest-loc"><I n="pin" size={13} /> {d.area}</span>
          <p>{d.desc}</p>
          {dist != null && <p className="dest-dist-note">Approximately <b>{fmtDist(dist)}</b> from your current location.</p>}
          <div className="dest-actions">
            <a className="btn btn-dark" href={'https://www.google.com/maps/dir/?api=1&destination=' + d.lat + ',' + d.lng} target="_blank" rel="noreferrer"><I n="locate" size={15} /> Get Directions</a>
            <a className="btn btn-ghost" href={'https://wa.me/' + PHONE_RAW + '?text=' + encodeURIComponent('Hi Gokarna Darshana Holidays! I would like to visit ' + d.name + '.')} target="_blank" rel="noreferrer"><I n="whatsapp" size={15} /> Plan via WhatsApp</a>
          </div>
        </div>
      </div>
    </div>
  );
}