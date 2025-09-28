import { parse } from 'node-html-parser';

const FETCH_TIMEOUT = 15000;
function tryJson(s) { try { return JSON.parse(s) } catch { return null } }

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' });

  const { url } = req.body || {};
  if (!url) return res.status(400).json({ error: 'Missing url in body' });

  const target = url.includes('://') ? url : 'https://' + url;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  try {
    const r = await fetch(target, { headers: { 'User-Agent': 'ThemeSpot/1.0' }, redirect: 'follow', signal: controller.signal });
    clearTimeout(timeout);

    if (!r.ok) return res.status(500).json({ error: `Target returned ${r.status}` });
    const html = await r.text();
    const root = parse(html, { script: true });

    const scripts = root.querySelectorAll('script') || [];
    let shopifyObj = null, dataThemeName = null, dataThemeVersion = null, shopDomain = null;

    // Parse inline Shopify.theme JSON
    for (const s of scripts) {
      const txt = s.text || '';
      const m = txt.match(/Shopify\.theme\s*=\s*({[\s\S]*?})/);
      if (m) {
        const parsed = tryJson(m[1]);
        if (parsed) { shopifyObj = parsed; break; }
      }
    }

    // Look for attributes like data-theme-name
    for (const s of scripts) {
      if (s.getAttribute('data-theme-name')) dataThemeName = s.getAttribute('data-theme-name');
      if (s.getAttribute('data-theme-version')) dataThemeVersion = s.getAttribute('data-theme-version');
    }

    // Shopify.shop
    for (const s of scripts) {
      const txt = s.text || '';
      const mShop = txt.match(/Shopify\.shop\s*=\s*['"]([^'"]+)['"]/);
      if (mShop) shopDomain = mShop[1];
    }

    const result = {
      isShopify: !!(shopifyObj || dataThemeName || shopDomain),
      rawLabel: shopifyObj?.name || null,
      schema_name: shopifyObj?.schema_name || dataThemeName || null,
      schema_version: shopifyObj?.schema_version || dataThemeVersion || null,
      shopDomain: shopDomain || null,
      canonicalThemeName: dataThemeName || shopifyObj?.schema_name || shopifyObj?.name || null,
      themeName: dataThemeName || shopifyObj?.schema_name || shopifyObj?.name || null,
      themeVersion: dataThemeVersion || shopifyObj?.schema_version || null,
      shopifyDomain: shopDomain || null
    };

    return res.json(result);
  } catch (err) {
    clearTimeout(timeout);
    return res.status(500).json({ error: err.message });
  }
}
