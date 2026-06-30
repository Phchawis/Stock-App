// Parse a CSS declaration string into a React style object.
// Keeps `--custom-properties` verbatim; camelCases standard properties.
export function css(text) {
  const out = {};
  for (const decl of String(text).split(';')) {
    const i = decl.indexOf(':');
    if (i < 0) continue;
    const rawKey = decl.slice(0, i).trim();
    const val = decl.slice(i + 1).trim();
    if (!rawKey || val === '') continue;
    if (rawKey.startsWith('--')) {
      out[rawKey] = val;                       // CSS variable: keep as-is
    } else {
      const key = rawKey.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      out[key] = val;
    }
  }
  return out;
}
