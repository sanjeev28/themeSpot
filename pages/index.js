// pages/index.js
import Head from "next/head";
import { useState } from "react";

const AFF = process.env.NEXT_PUBLIC_AFFILIATE_BASE || "https://grabthatdeals.com/go/shopify/";

function getDisplayThemeName(r) {
  if (!r) return null;
  return r.canonicalThemeName || r.schema_name || r.dataThemeName || r.rawLabel || r.themeName || null;
}
function getThemeVersion(r) {
  if (!r) return null;
  return r.schema_version || r.dataThemeVersion || r.themeVersion || null;
}
function rawLabelLooksCustom(r) {
  if (!r || !r.rawLabel) return false;
  const raw = r.rawLabel.trim().toLowerCase();
  const canon = (getDisplayThemeName(r) || "").trim().toLowerCase();
  if (!canon) return false;
  return raw !== canon;
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function detectTheme() {
    if (!url) return alert("Please enter a store URL");
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      let host;
      try {
        host = new URL(url.includes("://") ? url : "https://" + url).hostname;
      } catch (e) {
        host = url;
      }
      setResult({ host, ...data });
    } catch (e) {
      setError(String(e.message || e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>ThemeSpot — Shopify Theme Detector</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&family=Inter:wght@300;400;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="topbar">
        <div className="inner">Support &nbsp;&nbsp;|&nbsp;&nbsp; Contact Sales</div>
      </div>

      <header>
        <div className="wrap header-row">
          <div className="brand">
            <div className="logo-mark">TS</div>
            <div>
              <h1>ThemeSpot</h1>
              <div style={{ fontSize: 13, color: "var(--muted)" }}>Shopify Theme Finder</div>
            </div>
          </div>
          <nav>
            <a>Products</a>
            <a>Solutions</a>
            <a>Resources</a>
            <a>Pricing</a>
          </nav>
        </div>
      </header>

      <div className="hero-banner">
        <div className="hero-inner">
          <div className="hero-left">
            <div className="eyebrow">ThemeSpot</div>
            <h2>Find any Shopify store's theme instantly</h2>
            <p>
              Paste a Shopify store URL and ThemeSpot will detect the theme, version and provide a quick link to get the theme or view its
              listing.
            </p>

            <div className="cta-row">
              <button className="btn" onClick={() => document.getElementById("storeUrl")?.focus()}>
                Detect a theme
              </button>
              <button
                className="btn-outline"
                onClick={() => {
                  alert("Browser extension coming soon");
                }}
              >
                Get browser extension
              </button>
            </div>

            <div className="search-card" style={{ marginTop: 22 }}>
              <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 8 }}>Enter store URL</div>
              <div className="search-row">
                <input
                  id="storeUrl"
                  placeholder="e.g. overlaysnow.com or https://overlaysnow.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <button id="detectBtn" className="btn" style={{ padding: "12px 20px" }} onClick={detectTheme} disabled={loading}>
                  {loading ? "Detecting..." : "Detect"}
                </button>
              </div>
            </div>
          </div>

          <div className="hero-right">
            <div className="quick-card">
              <div style={{ fontWeight: 700, fontSize: 15, color: "var(--navy)", marginBottom: 8 }}>Quick actions</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <button className="btn" style={{ width: "100%" }} onClick={() => alert("install coming soon")}>
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

      <main style={{ maxWidth: "var(--container)", margin: "18px auto", padding: "0 20px" }}>
        {error && (
          <div style={{ color: "red", marginTop: 12 }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {result && (
          <div style={{ marginTop: 18 }}>
            <div className="result-card" style={{ flexDirection: "column", alignItems: "flex-start" }}>
              <div style={{ fontWeight: 800, color: "var(--navy)", marginBottom: 8 }}>{result.host} is using:</div>

              <div style={{ fontSize: 20, fontWeight: 700, color: "#072048" }}>
                {getDisplayThemeName(result) || "Theme not detected"}
                {getThemeVersion(result) ? ` v${getThemeVersion(result)}` : ""}
              </div>

              {getThemeVersion(result) && (
                <div style={{ marginTop: 10 }}>
                  <strong>Theme version:</strong> v{getThemeVersion(result)}
                </div>
              )}

              {result.rawLabel && (
                <div style={{ marginTop: 10 }}>
                  <strong>Theme label:</strong> {result.rawLabel}
                  {rawLabelLooksCustom(result) && <span style={{ color: "#b4533c" }}> (To look custom)</span>}
                </div>
              )}

              {result.shopDomain && (
                <div style={{ marginTop: 10 }}>
                  <strong>Shopify store domain:</strong> {result.shopDomain}
                </div>
              )}

              {result.host && (
                <div style={{ marginTop: 10 }}>
                  <strong>Main domain name:</strong> {result.host}
                </div>
              )}

              <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
                {getDisplayThemeName(result) && (
                  <a
                    href={`${AFF}?theme=${encodeURIComponent(getDisplayThemeName(result))}&site=${encodeURIComponent(result.host || "")}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      background: "var(--navy)",
                      color: "#fff",
                      padding: "10px 14px",
                      borderRadius: 8,
                      textDecoration: "none",
                      fontWeight: 700,
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
                    border: "1px solid var(--navy)",
                    background: "#fff",
                    color: "var(--navy)",
                    padding: "10px 14px",
                    borderRadius: 8,
                    fontWeight: 700,
                  }}
                >
                  Visit site
                </button>
              </div>
            </div>
          </div>
        )}

        <section style={{ marginTop: 28 }}>
          <h3 style={{ color: "var(--navy)" }}>FAQ</h3>
          <details style={{ marginTop: 8 }}>
            <summary>How does ThemeSpot detect a Shopify theme?</summary>
            <div style={{ paddingTop: 8, color: "var(--muted)" }}>
              We check authoritative signals in the HTML/JS: <code>Shopify.theme</code> JSON (schema_name, schema_version),{" "}
              <code>data-theme-name</code> attributes on scripts, and asset paths containing <code>/themes/</code>.
            </div>
          </details>
        </section>
      </main>

      <footer style={{ textAlign: "center", padding: "20px", color: "var(--muted)" }}>© 2025 ThemeSpot</footer>
    </>
  );
}
