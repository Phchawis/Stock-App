import React from 'react';
import { createRoot } from 'react-dom/client';
import { icons } from './icons.js';
import App from './App.jsx';
import './styles.css';

// The app's icon() helper expects window.lucide.icons[name] to be the icon's
// child-node array ([[tag, attrs], ...]). The lucide npm package exports each
// icon as a full ["svg", attrs, children] node, so unwrap to its children.
const iconChildren = Object.fromEntries(
  Object.entries(icons).map(([name, node]) => [name, node[2]])
);
window.lucide = { icons: iconChildren };

// Failures used to be visible only to whoever was standing in front of the
// screen. Reporting them means the lab's admin can see that something is
// breaking without waiting for someone to mention it. Best-effort by design:
// the reporter must never throw, or it makes the original crash worse.
function reportError(detail, where) {
  try {
    fetch('/api/system_events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': (document.cookie.match(/tuh_csrf=([^;]+)/) || [])[1] || '',
      },
      body: JSON.stringify({ kind: 'CLIENT_ERROR', detail: String(detail).slice(0, 1000), context: where || location.pathname }),
    }).catch(() => {});
  } catch { /* ignore */ }
}

window.addEventListener('error', (e) => reportError(e.message + ' @ ' + (e.filename || '') + ':' + (e.lineno || ''), 'window.onerror'));
window.addEventListener('unhandledrejection', (e) => {
  const r = e.reason;
  reportError((r && (r.stack || r.message)) || String(r), 'unhandledrejection');
});

class ErrorBoundary extends React.Component {
  constructor(p) { super(p); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error) { reportError(error && (error.stack || error.message), 'ErrorBoundary'); }
  render() {
    if (this.state.error) {
      return React.createElement('pre',
        { style: { color: '#F18C8C', padding: 24, font: '13px/1.5 monospace', whiteSpace: 'pre-wrap' } },
        String(this.state.error && this.state.error.stack || this.state.error));
    }
    return this.props.children;
  }
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App criticalDays={30} showEnglishNames={true} />
  </ErrorBoundary>
);
