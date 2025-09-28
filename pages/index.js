// pages/index.js
import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const AFFILIATE_BASE = process.env.NEXT_PUBLIC_AFFILIATE_BASE || "https://grabthatdeals.com/go/shopify/";

  const handleDetect = async () => {
    if (!url) return alert("Enter a Shopify store URL");
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

      // normalize host for display
      let host = url;
      try {
        host = new URL(url.includes("://") ? url : "https://" + url).hostname;
      } catch (e) {
        host = url;
      }

      setResult({ host, ...data });
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  function getDisplayThemeName(r) {
    if (!r) return null;
    // priority: canonicalThemeName -> schema_name -> dataThemeName -> rawLabel -> themeName
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

  return (
    <div style={{ fontFamily: "Poppins, Inter, sans-serif", background: "#f7f9fc", minHeight: "100vh" }}>
      <header style={{ background: "#fff", borderBottom: "1px solid #e9eef8", padding: "12px 20px" }}>
        <h1 style={{ margin: 0, color: "#0b2b6b" }}>ThemeSpot — Shopify Theme Detector</h1>
      </header>

      <section style={{ padding: "40px 20px", textAlign: "center" }}>
        <h2 style={{ fontSize: "32px", fontWeight: "800", color: "#0b2b6b" }}>
          Find any Shopify store's theme instantly
        </h2>
        <p style={{ maxWidth: "600px", margin: "10px auto", color: "#6b7280" }}>
          Paste a Shopify store URL and ThemeSpot will detect the theme and version.
        </p>

        <div style={{ display: "flex", maxWidth: "700px", margin: "20px auto", gap: "10px" }}>
          <input
            type="text"
            placeholder="https://examplestore.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{ flex: 1, padding: "14px", borderRadius: "10px", border: "1px solid #ddd" }}
          />
          <button
            onClick={handleDetect}
            disabled={loading}
            style={{
              background: "#0b2b6b",
              color: "#fff",
              border: "none",
              padding: "14px 20px",
              borderRadius: "10px",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            {loading ? "Detecting..." : "Detect Theme"}
          </button>
        </div>
      </section>

      <main style={{ maxWidth: 980, margin: "6px auto 80px", padding: "0 18px" }}>
        {error && <div style={{ color: "red", textAlign: "center", marginTop: "20px" }}>Error: {error}</div>}

        {result && (
          <div style={{ marginTop: 18 }}>
            <div style={{ padding: 20, background: "#fff", borderRadius: 12, boxShadow: "0 6px 20px rgba(0,0,0,0.06)" }}>
              <div style={{ fontWeight: 800, color: "#0b2b6b", marginBottom: 8 }}>
                {result.host} is using:
              </div>

              <div style={{ fontSize: 20, fontWeight: 700, color: "#072048" }}>
                {getDisplayThemeName(result) || "Theme not detected"}
                {getThemeVersion(result) ? ` v${getThemeVersion(result)}` : ""}
              </div>

              {/* Theme version */}
              {getThemeVersion(result) && (
                <div style={{ marginTop: 10 }}>
                  <strong>Theme version:</strong> v{getThemeVersion(result)}
                </div>
              )}

              {/* Theme label */}
              {result.rawLabel && (
                <div style={{ marginTop: 10 }}>
                  <strong>Theme label:</strong> {result.rawLabel}
                  {rawLabelLooksCustom(result) && (
                    <span style={{ color: "#b4533c" }}> (To look custom)</span>
                  )}
                </div>
              )}

              {/* Shopify store domain */}
              {result.shopDomain && (
                <div style={{ marginTop: 10 }}>
                  <strong>Shopify store domain:</strong> {result.shopDomain}
                </div>
              )}

              {/* Main domain */}
              {result.host && (
                <div style={{ marginTop: 10 }}>
                  <strong>Main domain name:</strong> {result.host}
                </div>
              )}

              {/* Actions */}
              <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
                {getDisplayThemeName(result) && (
                  <a
                    href={`${AFFILIATE_BASE}?theme=${encodeURIComponent(getDisplayThemeName(result))}&site=${encodeURIComponent(result.host || "")}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ background: "#0b2b6b", color: "#fff", padding: "10px 14px", borderRadius: 8, textDecoration: "none", fontWeight: 700 }}
                  >
                    Get this theme
                  </a>
                )}

                <button
                  onClick={() => {
                    const link = result.host && (result.host.includes("://") ? result.host : "https://" + result.host);
                    if (link) window.open(link, "_blank");
                  }}
                  style={{ border: "1px solid #0b2b6b", background: "#fff", color: "#0b2b6b", padding: "10px 14px", borderRadius: 8, fontWeight: 700 }}
                >
                  Visit site
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Minimal FAQ */}
        <section style={{ marginTop: 28 }}>
          <h3 style={{ color: "#0b2b6b" }}>FAQ</h3>
          <details style={{ marginTop: 8 }}>
            <summary>How does ThemeSpot detect a Shopify theme?</summary>
            <div style={{ paddingTop: 8, color: "#6b7280" }}>
              We read authoritative signals in the page: <code>Shopify.theme</code> JSON (schema_name), and <code>data-theme-name</code> on Shopify scripts.
            </div>
          </details>
        </section>
      </main>

      <footer style={{ textAlign: "center", padding: "20px", color: "#6b7280" }}>© 2025 ThemeSpot</footer>
    </div>
  );
}
