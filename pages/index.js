// pages/index.js
import { useState, useEffect } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const AFFILIATE_BASE = "https://grabthatdeals.com/go/shopify/";

  const handleDetect = async () => {
    if (!url) return alert("Please enter a store URL");
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      setResult({ host: new URL(url.includes("://") ? url : "https://" + url).hostname, ...data });
    } catch (err) {
      alert("Error: " + err.message);
    }
    setLoading(false);
  };

  // FAQ accordion toggle
  useEffect(() => {
    const qs = document.querySelectorAll(".accordion .q");
    qs.forEach((q) => {
      q.addEventListener("click", () => {
        const next = q.nextElementSibling;
        const open = next.style.display === "block";
        document.querySelectorAll(".accordion .a").forEach((a) => (a.style.display = "none"));
        document.querySelectorAll(".accordion .q div").forEach((d) => (d.textContent = "+"));
        if (!open) {
          next.style.display = "block";
          q.querySelector("div").textContent = "−";
        }
      });
    });
  }, []);

  return (
    <div>
      {/* Topbar */}
      <div className="topbar">
        <div className="inner">Support &nbsp;&nbsp;|&nbsp;&nbsp; Contact Sales</div>
      </div>

      {/* Header */}
      <header>
        <div className="wrap header-row">
          <div className="brand">
            <div className="logo-mark">TS</div>
            <div>
              <h1>ThemeSpot</h1>
              <div style={{ fontSize: "13px", color: "var(--muted)" }}>Shopify Theme Finder</div>
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

      {/* Hero */}
      <div className="hero-banner">
        <div className="hero-inner">
          <div className="hero-left">
            <div className="eyebrow">ThemeSpot</div>
            <h2>Find any Shopify store's theme instantly</h2>
            <p>
              Paste a Shopify store URL and ThemeSpot will detect the theme, version and provide a quick link to get the theme or view its listing.
            </p>

            <div className="cta-row">
              <button className="btn">Detect a theme</button>
              <button className="btn-outline">Get browser extension</button>
            </div>

            <div className="search-card">
              <div style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "8px" }}>Enter store URL</div>
              <div className="search-row">
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="e.g. overlaysnow.com or https://overlaysnow.com"
                />
                <button onClick={handleDetect} className="btn" disabled={loading}>
                  {loading ? "Detecting..." : "Detect"}
                </button>
              </div>
            </div>
          </div>

          <div className="hero-right">
            <div className="quick-card">
              <div style={{ fontWeight: "700", fontSize: "15px", color: "var(--navy)", marginBottom: "8px" }}>
                Quick actions
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <button className="btn" style={{ width: "100%" }}>
                  Install Extension
                </button>
                <button className="btn-outline" style={{ width: "100%" }}>
                  API & Docs
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Result */}
      {result && (
  <div style={{ marginTop: 18 }}>
    <div className="result-card" style={{ alignItems: "center", justifyContent: "space-between" }}>
      {/* left block: icon + text */}
      <div style={{ display: "flex", gap: 16, alignItems: "center", flex: 1 }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 12,
            background: "linear-gradient(135deg,var(--accent), var(--accent-2))",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: 22,
            flexShrink: 0,
          }}
        >
          🌐
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, color: "var(--navy)", fontSize: 18 }}>
            {result.host} <span style={{ fontWeight: 600, color: "#333" }}>is using:</span>
          </div>

          <div style={{ marginTop: 8, fontSize: 18, fontWeight: 700, color: "#072048" }}>
            {getDisplayThemeName(result) || "Theme not detected"}
            {getThemeVersion(result) ? ` v${getThemeVersion(result)}` : ""}
          </div>

          <div style={{ marginTop: 10, color: "var(--muted)" }}>
            {getThemeVersion(result) && (
              <div style={{ marginBottom: 6 }}>
                <strong style={{ color: "#000" }}>Theme version:</strong> {getThemeVersion(result)}
              </div>
            )}

            {result.rawLabel && (
              <div style={{ marginBottom: 6 }}>
                <strong style={{ color: "#000" }}>Theme label:</strong> {result.rawLabel}
                {rawLabelLooksCustom(result) && <span style={{ color: "#b4533c" }}> (To look custom)</span>}
              </div>
            )}

            {result.shopDomain && (
              <div style={{ marginBottom: 6 }}>
                <strong style={{ color: "#000" }}>Shopify store domain:</strong> {result.shopDomain}
              </div>
            )}

            <div>
              <strong style={{ color: "#000" }}>Main domain name:</strong> {result.host}
            </div>
          </div>
        </div>
      </div>

      {/* right block: actions */}
      <div style={{ display: "flex", gap: 12, marginLeft: 18 }}>
        {getDisplayThemeName(result) && (
          <a
            href={`${AFF}?theme=${encodeURIComponent(getDisplayThemeName(result))}&site=${encodeURIComponent(result.host || "")}`}
            target="_blank"
            rel="noreferrer"
            style={{
              background: "var(--navy)",
              color: "#fff",
              padding: "10px 18px",
              borderRadius: 10,
              textDecoration: "none",
              fontWeight: 800,
              boxShadow: "0 8px 20px rgba(11,43,107,0.12)",
            }}
          >
            Get this theme
          </a>
        )}

        <button
          onClick={() => {
            const link = result.host && (result.host.includes("://") ? result.host : "https://" + result.host);
            if (link) window.open(link, "_blank");
          }}
          style={{
            border: "1.5px solid var(--navy)",
            background: "#fff",
            color: "var(--navy)",
            padding: "10px 16px",
            borderRadius: 10,
            fontWeight: 700,
            minWidth: 110,
          }}
        >
          Visit site
        </button>
      </div>
    </div>
  </div>
)}

      {/* Info Cards */}
      <div className="cards-grid">
        <div className="info-card">
          <div>
            <h4>Theme Customization</h4>
            <p>Get help customizing a theme to match your brand.</p>
          </div>
          <div className="card-arrow">→</div>
        </div>

        <div className="info-card">
          <div>
            <h4>Top themes for SEO</h4>
            <p>Discover themes optimized for speed & SEO.</p>
          </div>
          <div className="card-arrow">→</div>
        </div>

        <div className="info-card">
          <div>
            <h4>Theme store links</h4>
            <p>Direct links to theme listings and demos.</p>
          </div>
          <div className="card-arrow">→</div>
        </div>

        <div className="info-card">
          <div>
            <h4>Compare themes</h4>
            <p>Side-by-side comparison to choose the right theme.</p>
          </div>
          <div className="card-arrow">→</div>
        </div>
      </div>

      {/* FAQ */}
      <section className="faq-section">
        <div className="faq-grid">
          <div className="faq-card">
            <h3>Frequently Asked Questions</h3>
            <div className="accordion">
              <div className="q">
                <h4>How does ThemeSpot detect a Shopify theme?</h4>
                <div>+</div>
              </div>
              <div className="a">
                We scan HTML for <code>window.Shopify.theme</code>, <code>schema_name</code>, or <code>data-theme-name</code>.
              </div>

              <div className="q">
                <h4>Is it always accurate?</h4>
                <div>+</div>
              </div>
              <div className="a">Not always. Heavily customized themes may look "custom".</div>

              <div className="q">
                <h4>Do you store scanned site data?</h4>
                <div>+</div>
              </div>
              <div className="a">No, this demo does not store scan results.</div>

              <div className="q">
                <h4>Can I try the theme directly?</h4>
                <div>+</div>
              </div>
              <div className="a">Yes, use the "Get this theme" button to view or try the theme.</div>
            </div>
          </div>

          <aside className="faq-side">
            <div className="side-card">
              <strong>Tip</strong>
              <div style={{ color: "var(--muted)", marginTop: "6px", fontSize: "13px" }}>
                Paste the store's root URL (example.com) for best results.
              </div>
            </div>

            <div className="side-card">
              <strong>Contact</strong>
              <div style={{ color: "var(--muted)", marginTop: "6px", fontSize: "13px" }}>support@example.com</div>
            </div>
          </aside>
        </div>
      </section>

      {/* Footer */}
      <footer>© 2025 ThemeSpot — designed with care</footer>
    </div>
  );
}
