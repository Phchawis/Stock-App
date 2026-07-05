// Curated icon set — named imports only (not `import { icons } from 'lucide'`,
// which pulls in every icon lucide ships, ~1MB+ of unused SVG data). Named
// imports are real ES re-exports (see lucide/dist/esm/lucide.js), so Vite/
// Rollup tree-shakes this down to just the icons actually used below.
//
// When adding a new icon anywhere in the app: import it here and add it to
// the `icons` map with the exact name used in App.jsx's `I('IconName')` /
// `this.icon('IconName')` calls, or lookups will silently render nothing.
import {
  LayoutDashboard, Boxes, List, Bell, History, ArrowDownToLine, ArrowUpFromLine,
  LogOut, Search, QrCode, X, Thermometer, Package, CalendarClock, Check,
  ShieldCheck, BookOpen, Menu, TriangleAlert, FlaskConical,
} from 'lucide';

export const icons = {
  LayoutDashboard, Boxes, List, Bell, History, ArrowDownToLine, ArrowUpFromLine,
  LogOut, Search, QrCode, X, Thermometer, Package, CalendarClock, Check,
  ShieldCheck, BookOpen, Menu, TriangleAlert, FlaskConical,
};
