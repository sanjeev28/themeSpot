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
      // host from input (safely handles with/without protocol)
      const host = (() => {
        try {
          return new URL(url.includes("://") ? url : "https://" + url).hostname;
        } catch {
          return url;
        }
      })();
      setResult({ host, ...data });
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
              Paste a Shopify store URL and ThemeSpot will detect the theme, version and provide a quick link to get the
              theme or view its listing.
            </p>

            <div className="cta-row">
              <button className="btn" onClick={() => document.getElementById("storeUrl")?.focus()}>
                Detect a theme
              </button>
              <button className="btn-outline">Get browser extension</button>
            </div>

           

          <div className="hero-right">
            <div className="quick-card">
              <div style={{ fontWeight: 700, fontSize: 15, color: "var(--navy)", marginBottom: 8 }}>Quick actions</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
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
</div>

       {/* Search */}
<div className="wrap" style={{ marginTop: 20 }}>
            <div className="search-card">
              <div style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "8px" }}>Enter store URL</div>
              <div className="search-row">
                <input
                  id="storeUrl"
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
 </div>
      {/* Result — style #2 with Theme label + Shopify store domain */}
      {result && (
        <div className="wrap" style={{ marginTop: 20 }}>
          <div className="result-card">
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
              }}
            >
              🌐
            </div>

            {/* Result card data mapping (handles alternate keys from API) */}
            {(() => {
              const themeName =
                result.themeName ||
                result.canonicalThemeName ||
                result.schema_name ||
                result.dataThemeName ||
                result.rawLabel ||
                "Unknown";

              const themeVersion = result.themeVersion || result.schema_version || result.dataThemeVersion || null;

              const themeLabel = result.themeLabel || result.rawLabel || null;

              const shopDomain = result.shopifyDomain || result.shopDomain || result.shopify_domain || null;

              return (
                <>
                  <div className="result-meta">
                    <div className="site">
                      {result.host} <span style={{ fontWeight: 600, color: "#333" }}>is using:</span>
                    </div>

                    <div style={{ marginTop: 8, fontSize: 20, fontWeight: 800, color: "#072048" }}>
                      {themeName}
                      {themeVersion ? ` v${themeVersion}` : ""}
                    </div>

                    {themeVersion && (
                      <div className="theme" style={{ marginTop: 8 }}>
                        <strong>Theme version:</strong> v{themeVersion}
                      </div>
                    )}

                    {themeLabel && (
                      <div className="theme" style={{ marginTop: 6 }}>
                        <strong>Theme label:</strong> {themeLabel}
                        {themeLabel &&
                          themeName &&
                          themeLabel.toLowerCase() !== themeName.toLowerCase() && (
                            <span style={{ color: "#b4533c" }}> (To look custom)</span>
                          )}
                      </div>
                    )}

                    {shopDomain && (
                      <div className="theme" style={{ marginTop: 6 }}>
                        <strong>Shopify store domain:</strong> {shopDomain}
                      </div>
                    )}

                    <div className="theme" style={{ marginTop: 6 }}>
                      <strong>Main domain name:</strong> {result.host}
                    </div>
                  </div>

                  <div className="result-actions">
                    {themeName && (
                      <a
                        href={`${AFFILIATE_BASE}?theme=${encodeURIComponent(themeName)}&site=${encodeURIComponent(
                          result.host || ""
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn"
                      >
                        Get this theme
                      </a>
                    )}
                    <button className="btn-outline" onClick={() => window.open("https://" + result.host, "_blank")}>
                      Visit site
                    </button>
                  </div>
                </>
              );
            })()}
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
                We scan HTML for <code>window.Shopify.theme</code>, <code>schema_name</code>, or{" "}
                <code>data-theme-name</code>.
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
              <div style={{ color: "var(--muted)", marginTop: 6, fontSize: 13 }}>
                Paste the store's root URL (example.com) for best results.
              </div>
            </div>

            <div className="side-card">
              <strong>Contact</strong>
              <div style={{ color: "var(--muted)", marginTop: 6, fontSize: 13 }}>support@example.com</div>
            </div>
          </aside>
        </div>
      </section>

      {/* Footer */}
      <footer>© {new Date().getFullYear()} ThemeSpot — designed with care</footer>
    </div>
  );
}
