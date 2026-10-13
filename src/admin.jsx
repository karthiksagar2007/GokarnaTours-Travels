import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { auth, db, firebaseConfigured } from './firebase.js';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from 'firebase/auth';
import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore';
import './admin.css';

function AdminApp() {
  const [user,setUser] = useState(null); const [isAdmin,setIsAdmin] = useState(false); const [checking,setChecking] = useState(true);
  const [email,setEmail] = useState(''); const [password,setPassword] = useState(''); const [error,setError] = useState(''); const [notice,setNotice] = useState('');
  const [tab,setTab] = useState('packages'); const [packages,setPackages] = useState([]); const [bookings,setBookings] = useState([]); const [places,setPlaces] = useState([]);
  const [pkg,setPkg] = useState({name:'',region:'Coastal Karnataka',description:'',price:'',duration:'',imageUrl:'',published:false});
  const [place,setPlace] = useState({name:'',sub:'',description:'',imageUrl:'',published:false});
  useEffect(() => {
    if (!auth) { setChecking(false); return; }
    return onAuthStateChanged(auth, async (current) => {
      setUser(current); setIsAdmin(false);
      if (current) { try { const token = await current.getIdTokenResult(true); setIsAdmin(token.claims.admin === true); } catch { setIsAdmin(false); } }
      setChecking(false);
    });
  },[]);
  async function refresh() {
    if (!db || !isAdmin) return;
    try {
      const [p,b,pl] = await Promise.all([
        getDocs(query(collection(db,'packages'),orderBy('updatedAt','desc'))),
        getDocs(query(collection(db,'bookings'),orderBy('createdAt','desc'))),
        getDocs(query(collection(db,'places'),orderBy('updatedAt','desc')))
      ]);
      setPackages(p.docs.map(d=>({id:d.id,...d.data()}))); setBookings(b.docs.map(d=>({id:d.id,...d.data()}))); setPlaces(pl.docs.map(d=>({id:d.id,...d.data()})));
    } catch(e) { setError('Could not load records. Confirm that this account has the Firebase admin custom claim and security rules are deployed.'); console.error(e); }
  }
  useEffect(()=>{ if(isAdmin) refresh(); },[isAdmin]);
  async function login(e) { e.preventDefault(); setError(''); try { await signInWithEmailAndPassword(auth,email.trim(),password); setPassword(''); } catch { setError('Login failed. Check your email/password or contact the project owner.'); } }
  async function resetPassword() { if(!email.trim()) { setError('Enter your admin email first.'); return; } try { await sendPasswordResetEmail(auth,email.trim()); setNotice('Password reset email requested. Check your inbox.'); } catch { setError('Could not request password reset. Check the email and Firebase Auth settings.'); } }
  async function savePackage(e) {
    e.preventDefault(); setError(''); setNotice('');
    const price = Number(pkg.price);
    if (!pkg.name.trim() || !pkg.description.trim() || !Number.isFinite(price) || price < 0) { setError('Enter a package name, description, and valid non-negative price.'); return; }
    try { await addDoc(collection(db,'packages'), { name:pkg.name.trim().slice(0,100), region:pkg.region.trim().slice(0,100), description:pkg.description.trim().slice(0,1500), price, duration:pkg.duration.trim().slice(0,80), imageUrl:pkg.imageUrl.trim().slice(0,1000), published:Boolean(pkg.published), updatedAt:serverTimestamp(), updatedBy:user.uid });
      setPkg({name:'',region:'Coastal Karnataka',description:'',price:'',duration:'',imageUrl:'',published:false}); setNotice('Package saved. Published packages can be shown on the public site.'); await refresh();
    } catch(e) { setError('Save failed. Your account may not have admin permission.'); console.error(e); }
  }
  async function togglePublished(item) { try { await updateDoc(doc(db,'packages',item.id),{published:!item.published,updatedAt:serverTimestamp(),updatedBy:user.uid}); await refresh(); } catch(e) { setError('Could not update package.'); console.error(e); } }
  async function removePackage(item) { if(!confirm(`Delete “${item.name}”? This cannot be undone.`)) return; try { await deleteDoc(doc(db,'packages',item.id)); await refresh(); } catch(e) { setError('Could not delete package.'); console.error(e); } }
  async function savePlace(e) {
    e.preventDefault(); setError(''); setNotice('');
    const name = place.name.trim(); const sub = place.sub.trim(); const description = place.description.trim(); const imageUrl = place.imageUrl.trim();
    if (name.length < 2) { setError('Enter a place name with at least 2 characters.'); return; }
    if (imageUrl && !/^https?:\/\//i.test(imageUrl)) { setError('Image URL must start with http:// or https://'); return; }
    try { await addDoc(collection(db,'places'), { name:name.slice(0,100), sub:sub.slice(0,120), description:description.slice(0,1500), imageUrl:imageUrl.slice(0,1200), published:Boolean(place.published), updatedAt:serverTimestamp(), updatedBy:user.uid });
      setPlace({name:'',sub:'',description:'',imageUrl:'',published:false}); setNotice('Place saved. Published places appear on the homepage.'); await refresh();
    } catch(e) { setError('Save failed. Your account may not have admin permission.'); console.error(e); }
  }
  async function togglePlacePublished(item) { try { await updateDoc(doc(db,'places',item.id),{published:!item.published,updatedAt:serverTimestamp(),updatedBy:user.uid}); await refresh(); } catch(e) { setError('Could not update place.'); console.error(e); } }
  async function removePlace(item) { if(!confirm(`Delete “${item.name}”? This cannot be undone.`)) return; try { await deleteDoc(doc(db,'places',item.id)); await refresh(); } catch(e) { setError('Could not delete place.'); console.error(e); } }
  async function markEnquiry(item,status) { try { await updateDoc(doc(db,'bookings',item.id),{status,reviewedAt:serverTimestamp(),reviewedBy:user.uid}); await refresh(); } catch(e) { setError('Could not update enquiry.'); console.error(e); } }

  if (checking) return <main className="center"><p>Checking secure session…</p></main>;
  if (!firebaseConfigured) return <main className="center"><section className="panel"><h1>Firebase setup required</h1><p>Copy <code>.env.example</code> to <code>.env</code>, enter your Firebase web app configuration, then restart Vite.</p><p>Do not place service-account credentials in this file.</p></section></main>;
  if (!user) return <main className="center"><form className="panel login" onSubmit={login}><div className="eyebrow">GOKARNA DARSHANA HOLIDAYS · PRIVATE ACCESS</div><h1>Admin sign in</h1><p>Sign in with an account provisioned by the project owner. There is no public registration.</p>{error&&<div className="alert error">{error}</div>}<label>Email<input type="email" autoComplete="username" required value={email} onChange={e=>setEmail(e.target.value)}/></label><label>Password<input type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)}/></label><button className="primary">Sign in securely</button><button type="button" className="link" onClick={resetPassword}>Reset password</button></form></main>;
  if (!isAdmin) return <main className="center"><section className="panel"><h1>Administrator access required</h1><p>This account is authenticated but does not have the required server-issued admin permission.</p><button className="primary" onClick={()=>signOut(auth)}>Sign out</button></section></main>;
  return <main className="dashboard"><header className="topbar"><div><div className="eyebrow">GOKARNA DARSHANA HOLIDAYS · MANAGEMENT</div><h1>Travel admin</h1></div><div className="account"><span>{user.email}</span><button onClick={()=>signOut(auth)}>Sign out</button></div></header>
    <nav className="tabs"><button className={tab==='packages'?'active':''} onClick={()=>setTab('packages')}>Packages</button><button className={tab==='places'?'active':''} onClick={()=>setTab('places')}>Places ({places.length})</button><button className={tab==='enquiries'?'active':''} onClick={()=>setTab('enquiries')}>Booking enquiries ({bookings.length})</button></nav>
    {error&&<div className="alert error">{error}</div>}{notice&&<div className="alert success">{notice}</div>}
    {tab==='places' ? <div className="columns"><section className="panel"><h2>Add a place</h2><form onSubmit={savePlace} className="editor"><label>Place name<input required minLength="2" maxLength="100" value={place.name} onChange={e=>setPlace({...place,name:e.target.value})}/></label><label>Short tagline<input placeholder="e.g. Serene shores and cliff vibes" maxLength="120" value={place.sub} onChange={e=>setPlace({...place,sub:e.target.value})}/></label><label>Details<textarea maxLength="1500" value={place.description} onChange={e=>setPlace({...place,description:e.target.value})}/></label><label>Image URL<input type="url" placeholder="https://…" maxLength="1200" value={place.imageUrl} onChange={e=>setPlace({...place,imageUrl:e.target.value})}/></label><label className="check"><input type="checkbox" checked={place.published} onChange={e=>setPlace({...place,published:e.target.checked})}/> Publish after verification</label><button className="primary">Save place</button></form></section><section className="panel"><div className="section-title"><h2>Saved places</h2><button onClick={refresh}>Refresh</button></div>{places.length===0?<p className="muted">No places yet. Published places appear on the homepage.</p>:<div className="record-list">{places.map(item=><article className="record" key={item.id}><div><h3>{item.name}</h3><p>{item.sub||'—'}</p><span className={item.published?'pill published':'pill'}>{item.published?'Published':'Draft'}</span></div><div className="record-actions"><button onClick={()=>togglePlacePublished(item)}>{item.published?'Unpublish':'Publish'}</button><button className="danger" onClick={()=>removePlace(item)}>Delete</button></div></article>)}</div>}</section></div> : tab==='packages' ? <div className="columns"><section className="panel"><h2>Add a package</h2><form onSubmit={savePackage} className="editor"><label>Package name<input required maxLength="100" value={pkg.name} onChange={e=>setPkg({...pkg,name:e.target.value})}/></label><label>Region<input value={pkg.region} maxLength="100" onChange={e=>setPkg({...pkg,region:e.target.value})}/></label><label>Description<textarea required maxLength="1500" value={pkg.description} onChange={e=>setPkg({...pkg,description:e.target.value})}/></label><div className="two"><label>Price (INR)<input type="number" min="0" step="1" required value={pkg.price} onChange={e=>setPkg({...pkg,price:e.target.value})}/></label><label>Duration<input placeholder="e.g. 1 day" value={pkg.duration} maxLength="80" onChange={e=>setPkg({...pkg,duration:e.target.value})}/></label></div><label>Image URL (optional)<input type="url" value={pkg.imageUrl} onChange={e=>setPkg({...pkg,imageUrl:e.target.value})}/></label><label className="check"><input type="checkbox" checked={pkg.published} onChange={e=>setPkg({...pkg,published:e.target.checked})}/> Publish after verification</label><button className="primary">Save package</button></form></section><section className="panel"><div className="section-title"><h2>Saved packages</h2><button onClick={refresh}>Refresh</button></div>{packages.length===0?<p className="muted">No packages yet.</p>:<div className="record-list">{packages.map(item=><article className="record" key={item.id}><div><h3>{item.name}</h3><p>{item.region||'Coastal Karnataka'} · {item.duration||'Duration not set'} · ₹{Number(item.price||0).toLocaleString('en-IN')}</p><span className={item.published?'pill published':'pill'}>{item.published?'Published':'Draft'}</span></div><div className="record-actions"><button onClick={()=>togglePublished(item)}>{item.published?'Unpublish':'Publish'}</button><button className="danger" onClick={()=>removePackage(item)}>Delete</button></div></article>)}</div>}</section></div> : <section className="panel"><div className="section-title"><h2>Booking enquiries</h2><button onClick={refresh}>Refresh</button></div>{bookings.length===0?<p className="muted">No enquiries received yet.</p>:<div className="record-list">{bookings.map(item=><article className="record" key={item.id}><div><h3>{item.name||item.fields?.name||item.fields?.Name||'Customer enquiry'}</h3><p>{item.phone||item.fields?.phone||item.fields?.Phone||'Phone not provided'} · {item.createdAt?.toDate?.().toLocaleString?.()||'Time unavailable'}</p><p className="muted">{item.summary||item.fields?.message||item.fields?.Message||item.fields?.trip||'Please open enquiry details in Firestore if more fields are needed.'}</p><span className="pill">{item.status||'new'}</span></div><div className="record-actions"><button onClick={()=>markEnquiry(item,'contacted')}>Mark contacted</button><button onClick={()=>markEnquiry(item,'closed')}>Close</button></div></article>)}</div>}</section>}
    <p className="security-note">Security depends on Firebase custom claims, deployed Firestore/Storage rules, App Check configuration, and Cloud Functions. Never share service-account files or admin passwords.</p>
  </main>;
}

createRoot(document.getElementById('admin-root')).render(<React.StrictMode><AdminApp /></React.StrictMode>);
