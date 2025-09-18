// pages/index.js
import Head from 'next/head';
import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);

  const AFF = process.env.NEXT_PUBLIC_AFFILIATE_BASE || 'https://example.com/affiliate';

  async function detectTheme(urlToDetect) {
    try {
      const res = await fetch('/api/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlToDetect })
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server returned ${res.status}: ${text}`);
      }
      return await res.json();
    } catch (err) {
      return { error: String(err.message || err) };
    }
  }

  const onDetectClick = async () => {
    const raw = (url || '').trim();
    if (!raw) return alert('Please enter a store URL');
    setBusy(true);
    setResult(null);

    // normalize host for display
    let host = raw;
    try { host = new URL(raw.includes('://') ? raw : 'https://' + raw).hostname; } catch(e){}

    const r = await detectTheme(raw);
    if (r && r.error) {
      alert('Detection failed: ' + r.error);
      setBusy(false);
      return;
    }
    setResult({ host, ...r });
    setBusy(false);
    // scroll result into view:
    setTimeout(()=> {
      const el = document.getElementById('resultCard');
      if (el) el.scrollIntoView({behavior:'smooth', block:'center'});
    }, 60);
  };

  const onVisit = () => {
    if (!result?.host) return;
    const link = result.host.includes('://') ? result.host : 'https://' + result.host;
    window.open(link, '_blank');
  };

  return (
    <>
      <Head>
        <title>ThemeSpot — Shopify Theme Detector</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div className="topbar"><div className="inner">Support &nbsp;&nbsp;|&nbsp;&nbsp; Contact Sales</div></div>

      <header>
        <div className="wrap header-row">
          <div className="brand">
            <div className="logo-mark">TS</div>
            <div>
              <h1>ThemeSpot</h1>
              <div style={{fontSize:13,color:'var(--muted)'}}>Shopify Theme Finder</div>
            </div>
          </div>
          <nav>
            <a href="#">Products</a>
            <a href="#">Solutions</a>
            <a href="#">Resources</a>
            <a href="#">Pricing</a>
          </nav>
        </div>
      </header>

      <div className="hero-banner">
        <div className="hero-inner">
          <div className="hero-left">
            <div className="eyebrow">ThemeSpot</div>
            <h2>Find any Shopify store's theme instantly</h2>
            <p>Paste a Shopify store URL and ThemeSpot will detect the theme, version and provide a quick link to get the theme or view its listing.</p>

            <div className="cta-row">
              <button className="btn" onClick={() => document.getElementById('storeUrl')?.focus()}>Detect a theme</button>
              <button className="btn-outline" onClick={()=>window.alert('Extension coming soon')}>Get browser extension</button>
            </div>

            <div className="search-card" style={{marginTop:22}}>
              <div style={{fontSize:13,color:'var(--muted)', marginBottom:8}}>Enter store URL</div>
              <div className="search-row">
                <input id="storeUrl" placeholder="e.g. overlaysnow.com or https://overlaysnow.com" value={url} onChange={(e)=>setUrl(e.target.value)} />
                <button id="detectBtn" className="btn" style={{padding:'12px 20px'}} onClick={onDetectClick} disabled={busy}>
                  {busy ? 'Detecting...' : 'Detect'}
                </button>
              </div>
            </div>
          </div>

          <div className="hero-right">
            <div className="quick-card">
              <div style={{fontWeight:700, fontSize:15, color:'var(--navy)', marginBottom:8}}>Quick actions</div>
              <div style={{display:'flex',flexDirection:'column',gap:10}}>
                <button className="btn" style={{width:'100%'}} onClick={()=>window.alert('Install extension coming soon')}>Install Extension</button>
                <button className="btn-outline" style={{width:'100%'}}>API & Docs</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="resultCard" className="result-wrap" style={{paddingTop:18}}>
        {result && (
          <div className="result-card">
            <div style={{width:72, height:72, borderRadius:12, background:'linear-gradient(135deg,var(--accent), var(--accent-2))', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:22}}>🌐</div>
            <div className="result-meta">
              <div className="site">{result.host}{result.isShopify ? ' is using this theme' : ' — not detected as Shopify'}</div>
              <div className="theme">{result.themeName ? result.themeName : (result.isShopify ? 'Theme detected (name not available)' : 'No theme detected')}</div>
              <div className="evidence">{result.evidence && result.evidence.length ? 'Evidence: ' + result.evidence.join(', ') : null}</div>
            </div>
            <div className="result-actions">
              {result.isShopify && (
                <a className="btn" href={`${AFF}?theme=${encodeURIComponent(result.themeName || 'theme')}&site=${encodeURIComponent(result.host)}`} target="_blank" rel="noreferrer">Get this theme</a>
              )}
              {result.host && <button className="btn-outline" onClick={onVisit}>Visit site</button>}
            </div>
          </div>
        )}
      </div>

      <div className="cards-grid">
        <div className="info-card"><div><h4>Theme Customization</h4><p>Get help customizing a theme to match your brand.</p></div><div className="card-arrow">→</div></div>
        <div className="info-card"><div><h4>Top themes for SEO</h4><p>Discover themes optimized for speed & SEO.</p></div><div className="card-arrow">→</div></div>
        <div className="info-card"><div><h4>Theme store links</h4><p>Direct links to theme listings and demos.</p></div><div className="card-arrow">→</div></div>
        <div className="info-card"><div><h4>Compare themes</h4><p>Side-by-side comparison to choose the right theme.</p></div><div className="card-arrow">→</div></div>
      </div>

      <section className="faq-section" id="faq">
        <div className="faq-grid">
          <div className="faq-card">
            <h3>Frequently Asked Questions</h3>
            <div className="accordion">
              <div className="q" onClick={(e)=>{ const a = e.currentTarget.nextElementSibling; const open = a.style.display==='block'; document.querySelectorAll('.accordion .a').forEach(x=>x.style.display='none'); document.querySelectorAll('.accordion .q div').forEach(d=>d.textContent='+'); if(!open){ a.style.display='block'; e.currentTarget.querySelector('div').textContent='−' }}}>
                <h4>How does ThemeSpot detect a Shopify theme?</h4><div>+</div>
              </div>
              <div className="a">ThemeSpot scans public HTML looking for <code>window.Shopify.theme</code>, asset URLs with <code>/themes/</code>, and other fingerprints.</div>

              <div className="q" onClick={(e)=>{ const a = e.currentTarget.nextElementSibling; const open = a.style.display==='block'; document.querySelectorAll('.accordion .a').forEach(x=>x.style.display='none'); document.querySelectorAll('.accordion .q div').forEach(d=>d.textContent='+'); if(!open){ a.style.display='block'; e.currentTarget.querySelector('div').textContent='−' }}}>
                <h4>Is it always accurate?</h4><div>+</div>
              </div>
              <div className="a">It’s best-effort. Private or heavily-customized themes that remove fingerprints may return "custom" or "unknown".</div>

              <div className="q" onClick={(e)=>{ const a = e.currentTarget.nextElementSibling; const open = a.style.display==='block'; document.querySelectorAll('.accordion .a').forEach(x=>x.style.display='none'); document.querySelectorAll('.accordion .q div').forEach(d=>d.textContent='+'); if(!open){ a.style.display='block'; e.currentTarget.querySelector('div').textContent='−' }}}>
                <h4>Do you store scanned site data?</h4><div>+</div>
              </div>
              <div className="a">This demo does not store scans. Production options may include analytics with user consent.</div>

              <div className="q" onClick={(e)=>{ const a = e.currentTarget.nextElementSibling; const open = a.style.display==='block'; document.querySelectorAll('.accordion .a').forEach(x=>x.style.display='none'); document.querySelectorAll('.accordion .q div').forEach(d=>d.textContent='+'); if(!open){ a.style.display='block'; e.currentTarget.querySelector('div').textContent='−' }}}>
                <h4>Can I try the theme directly?</h4><div>+</div>
              </div>
              <div className="a">Use the "Get this theme" affiliate link to view the theme listing or try a demo where available.</div>

            </div>
          </div>

          <aside className="faq-side">
            <div className="side-card"><strong>Tip</strong><div style={{color:'var(--muted)', marginTop:6, fontSize:13}}>Paste the store's root URL (example.com) for best results.</div></div>
            <div className="side-card"><strong>Contact</strong><div style={{color:'var(--muted)', marginTop:6, fontSize:13}}>support@example.com</div></div>
          </aside>
        </div>
      </section>

      <footer>© 2025 ThemeSpot — designed with care</footer>

      {/* Styles (kept inline so it's a single-file drop-in) */}
      <style>{`
      :root{
        --navy:#0b2b6b;
        --navy-2:#0e2f7a;
        --bg:#f7f9fc;
        --card:#ffffff;
        --muted:#6b7280;
        --accent:#0b2b6b;
        --accent-2:#1453b4;
        --border:#e9eef8;
        --container:1100px;
        --radius:12px;
      }
      *{box-sizing:border-box}
      html,body{height:100%}
      body{font-family:Poppins, Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial; margin:0; background:var(--bg); color:#071235; -webkit-font-smoothing:antialiased}
      .topbar{background:#fff; border-bottom:1px solid var(--border)}
      .topbar .inner{max-width:var(--container); margin:0 auto; padding:8px 20px; display:flex; justify-content:flex-end; gap:18px; font-size:13px; color:var(--muted)}
      header{background:var(--card); border-bottom:1px solid var(--border)}
      .wrap{max-width:var(--container); margin:0 auto; padding:18px 20px}
      .header-row{display:flex; align-items:center; justify-content:space-between}
      .brand{display:flex; align-items:center; gap:14px}
      .logo-mark{width:56px; height:56px; border-radius:10px; background:linear-gradient(135deg,var(--accent), var(--accent-2)); display:flex; align-items:center; justify-content:center; color:#fff; font-weight:800}
      .brand h1{font-size:18px; margin:0}
      nav a{margin-left:18px; color:var(--muted); text-decoration:none; font-size:14px}
      .hero-banner{background:linear-gradient(180deg,#f3f6ff 0%, #eef4ff 100%); padding:56px 0 36px}
      .hero-inner{max-width:var(--container); margin:0 auto; padding:0 20px; display:flex; align-items:center; gap:24px}
      .hero-left{flex:1}
      .hero-left .eyebrow{color:var(--muted); font-weight:600; margin-bottom:8px}
      .hero-left h2{font-family:Poppins, Inter; font-weight:800; font-size:48px; line-height:1.02; margin:0 0 12px; color:var(--navy)}
      .hero-left p{margin:0; color:var(--muted); font-size:16px; max-width:60%}
      .cta-row{display:flex; gap:16px; margin-top:22px}
      .btn{display:inline-flex; align-items:center; gap:10px; justify-content:center; background:var(--navy); color:#fff; border:none; padding:14px 26px; border-radius:12px; font-weight:700; font-size:15px; cursor:pointer; box-shadow:0 12px 30px rgba(11,43,107,0.14); transition:transform .14s ease, box-shadow .14s ease, opacity .14s ease;}
      .btn:hover{transform:translateY(-3px); box-shadow:0 18px 40px rgba(11,43,107,0.18)}
      .btn-outline{display:inline-flex; align-items:center; gap:10px; justify-content:center; background:#fff; color:var(--navy); border:2px solid var(--navy); padding:12px 24px; border-radius:12px; font-weight:700; font-size:15px; cursor:pointer; transition:background .12s ease, color .12s ease, transform .12s ease;}
      .btn-outline:hover{background:var(--navy); color:#fff; transform:translateY(-3px)}
      .search-card{background:var(--card); padding:18px; border-radius:10px; margin-top:18px; box-shadow:0 8px 30px rgba(7,18,53,0.06); border:1px solid var(--border)}
      .search-row{display:flex; gap:10px}
      .search-row input{flex:1; padding:14px 16px; border-radius:10px; border:1px solid #e3e9f6; font-size:15px}
      .hero-right{width:420px}
      .quick-card{background:linear-gradient(180deg,#fff,#fff); padding:18px; border-radius:12px; box-shadow:0 8px 30px rgba(7,18,53,0.06); border:1px solid var(--border)}
      .cards-grid{max-width:var(--container); margin:28px auto; padding:0 20px; display:grid; grid-template-columns:repeat(2,1fr); gap:20px}
      .info-card{background:var(--card); border-radius:10px; padding:22px; border:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; box-shadow:0 8px 20px rgba(7,18,53,0.03)}
      .info-card h4{margin:0; font-size:18px}
      .info-card p{margin:6px 0 0; color:var(--muted); font-size:14px}
      .card-arrow{width:44px; height:44px; border-radius:50%; background:var(--navy); display:flex; align-items:center; justify-content:center; color:#fff; font-weight:700}
      .result-wrap{max-width:var(--container); margin:18px auto; padding:0 20px}
      .result-card{background:linear-gradient(180deg,#fff,#fff); border-radius:12px; padding:20px; border:1px solid var(--border); box-shadow:0 12px 36px rgba(7,18,53,0.06); display:flex; align-items:center; gap:18px}
      .result-meta{flex:1}
      .result-meta .site{font-weight:800; font-size:18px; color:var(--navy)}
      .result-meta .theme{margin-top:6px; font-size:15px}
      .faq-section{max-width:var(--container); margin:28px auto; padding:0 20px 40px}
      .faq-grid{display:grid; grid-template-columns:1fr 360px; gap:20px}
      .faq-card{background:var(--card); padding:20px; border-radius:10px; border:1px solid var(--border); box-shadow:0 8px 30px rgba(7,18,53,0.03)}
      .faq-card h3{margin:0 0 12px}
      .accordion .q{display:flex; justify-content:space-between; padding:14px 0; border-bottom:1px dashed #eef2fb; cursor:pointer}
      .accordion .a{padding:10px 0; display:none; color:var(--muted)}
      .faq-side{display:flex; flex-direction:column; gap:12px}
      .side-card{background:#fff; border-radius:8px; padding:12px; border:1px solid var(--border)}
      footer{max-width:var(--container); margin:36px auto; padding:20px; text-align:center; color:var(--muted)}
      @media (max-width:980px){
        .cards-grid{grid-template-columns:1fr}
        .faq-grid{grid-template-columns:1fr}
        .hero-inner{flex-direction:column; align-items:flex-start}
        .hero-right{width:100%}
        .hero-left p{max-width:100%}
      }
      `}</style>
    </>
  );
}
