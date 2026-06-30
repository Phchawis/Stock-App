import React from 'react';
import { createRoot } from 'react-dom/client';
import { icons } from 'lucide';
import App from './App.jsx';
import './styles.css';

// The app's icon() helper expects window.lucide.icons[name] to be the icon's
// child-node array ([[tag, attrs], ...]). The lucide npm package exports each
// icon as a full ["svg", attrs, children] node, so unwrap to its children.
const iconChildren = Object.fromEntries(
  Object.entries(icons).map(([name, node]) => [name, node[2]])
);
window.lucide = { icons: iconChildren };

class ErrorBoundary extends React.Component {
  constructor(p) { super(p); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) {
      return React.createElement('pre',
        { style: { color: '#F18C8C', padding: 24, font: '13px/1.5 monospace', whiteSpace: 'pre-wrap' } },
        String(this.state.error && this.state.error.stack || this.state.error));
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App criticalDays={30} showEnglishNames={true} />
  </ErrorBoundary>
);
