// Motion that CSS alone cannot do: exits for things React has already
// removed, the theme reveal, and collapsing a row before it leaves a list.
//
// Every entry point checks prefers-reduced-motion itself. The global kill
// switch in redesign.css only reaches CSS animations and transitions — the
// Web Animations API ignores it — so without these checks someone who has
// asked their device for less movement would still get all of this.
import { flushSync } from 'react-dom';

export function prefersReducedMotion() {
  try {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  } catch {
    return false;
  }
}

// Exits are quicker than entrances and accelerate away rather than settle:
// the thing is leaving, and the user is already looking at what is next.
const EXIT_MS = 150;
const EXIT_EASE = 'cubic-bezier(0.4, 0, 1, 1)';

// ── Scroll positions ─────────────────────────────────────────────────────────
// A removed element has no layout, so its scrollTop reads 0. Positions are
// recorded as the user scrolls instead, so a ghost of a long modal fades out
// where it was left rather than jumping back to its top for 150ms.
const scrollTops = new WeakMap();
if (typeof document !== 'undefined') {
  document.addEventListener('scroll', (e) => {
    const t = e.target;
    if (t && t.nodeType === 1) scrollTops.set(t, t.scrollTop);
  }, { capture: true, passive: true });
}

// ── Exit ghosts ──────────────────────────────────────────────────────────────
// Modals, the reagent drawer and the toast are unmounted by a dozen different
// handlers the instant their state is cleared. Rather than delay every one of
// those, App hands over what was on screen just before each commit; anything
// that is gone afterwards is replaced for 150ms by a copy that fades out.
//
// The copy goes back into the same parent it came from, not onto <body>: the
// palette is custom properties inherited from the app root, and a copy outside
// that subtree would fade out in the wrong colours.
const CANDIDATES = '.ov-in, [data-exit]';

let viewTransitionActive = false;
export function setViewTransitionActive(on) { viewTransitionActive = on; }

export function captureExits() {
  if (typeof document === 'undefined') return null;
  const found = [...document.querySelectorAll(CANDIDATES)]
    // Only outermost layers; a panel inside an overlay leaves with it.
    .filter((el) => !el.parentElement || !el.parentElement.closest(CANDIDATES))
    .filter((el) => !el.closest('.exit-ghost'));
  if (!found.length) return null;
  return {
    layers: found.map((el) => ({ el, parent: el.parentNode, next: el.nextSibling })),
    // Most modals render their own <style> as a sibling of the overlay rather
    // than inside it, so it is removed in the same commit — and a copy of the
    // modal without it fades out unstyled (the receive form's two-column grid
    // collapsed to one, 105px taller than the modal it stood in for).
    styles: [...document.body.querySelectorAll('style')],
  };
}

export function playExits(snapshot) {
  if (!snapshot || viewTransitionActive || prefersReducedMotion()) return;
  const gone = snapshot.layers.filter((s) => !s.el.isConnected && s.parent && s.parent.isConnected);
  if (!gone.length) return;
  const lostStyles = snapshot.styles.filter((st) => !st.isConnected);

  // One overlay replaced by another (the confirm step before a delete, say):
  // fading the old backdrop over the new one would dim the screen twice for a
  // moment. The swap stays instant, as it was. The toast is unaffected.
  const layerStillOpen = !!document.querySelector('.ov-in:not(.exit-ghost)');

  for (const s of gone) {
    const isToast = s.el.getAttribute('data-exit') === 'toast';
    if (!isToast && layerStillOpen) continue;
    const ghost = cloneForExit(s.el);
    // The stylesheet leaves with the ghost, 150ms later, so it cannot outlive
    // the copy it was brought back for.
    const ref = s.next && s.next.parentNode === s.parent ? s.next : null;
    s.parent.insertBefore(ghost, ref);
    restoreState(s.el, ghost);
    for (const st of lostStyles) ghost.prepend(st.cloneNode(true));

    const anims = [];
    const opts = { duration: EXIT_MS, easing: EXIT_EASE, fill: 'forwards' };
    if (isToast) {
      anims.push(ghost.animate([{ opacity: 1, translate: '0 0' }, { opacity: 0, translate: '0 8px' }], opts));
    } else {
      anims.push(ghost.animate([{ opacity: 1 }, { opacity: 0 }], opts));
      const drawer = ghost.querySelector('.dr-in');
      const panel = drawer || ghost.querySelector('.tt-in');
      if (drawer) {
        anims.push(drawer.animate([{ translate: '0 0' }, { translate: '28px 0' }], opts));
      } else if (panel) {
        anims.push(panel.animate([{ translate: '0 0', scale: 1 }, { translate: '0 8px', scale: 0.985 }], opts));
      }
    }
    const done = () => { if (ghost.parentNode) ghost.remove(); };
    anims[0].onfinish = done;
    anims[0].oncancel = done;
    // Belt and braces: a paused timeline (hidden tab) must not leave an
    // invisible, click-through copy sitting over the app.
    setTimeout(done, EXIT_MS + 250);
  }
}

function cloneForExit(el) {
  const ghost = el.cloneNode(true);
  ghost.classList.add('exit-ghost');
  ghost.setAttribute('aria-hidden', 'true');
  ghost.setAttribute('inert', '');
  ghost.removeAttribute('id');
  ghost.querySelectorAll('[id]').forEach((n) => n.removeAttribute('id'));
  return ghost;
}

// cloneNode copies attributes, not live state: canvas pixels, what is typed in
// a field, where a panel was scrolled to. Without these the copy would flash a
// blank signature pad or an empty form for the length of the fade.
function restoreState(from, to) {
  const a = [from, ...from.querySelectorAll('*')];
  const b = [to, ...to.querySelectorAll('*')];
  if (a.length !== b.length) return;
  for (let i = 0; i < a.length; i++) {
    const o = a[i], c = b[i];
    const top = scrollTops.get(o);
    if (top) c.scrollTop = top;
    const tag = o.tagName;
    if (tag === 'CANVAS') {
      try { c.getContext('2d').drawImage(o, 0, 0); } catch { /* tainted or zero-size */ }
    } else if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
      try { c.value = o.value; } catch { /* file inputs refuse */ }
    }
  }
}

// ── Theme reveal ─────────────────────────────────────────────────────────────
// Without this the switch was half a transition: elements that happen to
// carry a colour transition tweened over 160ms while everything else snapped,
// so the screen passed through a mix of both palettes. As a view transition
// it changes all at once, spreading out from the button that caused it.
export function switchTheme(event, apply) {
  const root = document.documentElement;
  if (!document.startViewTransition || prefersReducedMotion()) { apply(); return; }

  const btn = event && event.currentTarget;
  const r = btn && btn.getBoundingClientRect ? btn.getBoundingClientRect() : null;
  const x = r ? r.left + r.width / 2 : window.innerWidth - 40;
  const y = r ? r.top + r.height / 2 : 40;
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  root.style.setProperty('--vt-x', x + 'px');
  root.style.setProperty('--vt-y', y + 'px');
  root.style.setProperty('--vt-r', Math.ceil(radius) + 'px');
  // Per-element colour transitions would still be mid-way when the new state
  // is captured, and the reveal would uncover them in the old colours.
  root.classList.add('vt-theme');

  viewTransitionActive = true;
  const t = document.startViewTransition(() => { flushSync(apply); });
  const end = () => { root.classList.remove('vt-theme'); viewTransitionActive = false; };
  t.finished.then(end, end);
  t.ready.catch(() => {});
  t.updateCallbackDone.catch(() => {});
}

// ── Collapse a row out of a list ─────────────────────────────────────────────
// The rows below close the gap instead of jumping up a row-height in one
// frame, which is how you lose your place in a list.
//
// Returns a promise for a `release` function. The caller removes the row from
// state, synchronously, and then calls release(): the collapsed element is
// usually handed by React to whatever row now fills its slot, so its held
// animation and inline styles have to go in the same frame, not a frame later.
// Run only once the removal is certain — a row collapsed ahead of a request
// that then fails would have to spring back.
export function collapseRow(el) {
  const noop = () => {};
  if (!el || prefersReducedMotion() || typeof el.animate !== 'function') return Promise.resolve(noop);
  const h = el.getBoundingClientRect().height;
  const cs = getComputedStyle(el);
  el.style.overflow = 'hidden';
  el.style.pointerEvents = 'none';
  const a = el.animate([
    { opacity: 1, height: h + 'px', paddingTop: cs.paddingTop, paddingBottom: cs.paddingBottom, marginTop: cs.marginTop, marginBottom: cs.marginBottom, borderTopWidth: cs.borderTopWidth, borderBottomWidth: cs.borderBottomWidth },
    { opacity: 0, height: '0px', paddingTop: '0px', paddingBottom: '0px', marginTop: '0px', marginBottom: '0px', borderTopWidth: '0px', borderBottomWidth: '0px' },
  ], { duration: 200, easing: 'cubic-bezier(0.25, 1, 0.5, 1)', fill: 'forwards' });
  const release = () => { a.cancel(); el.style.overflow = ''; el.style.pointerEvents = ''; };
  return new Promise((resolve) => {
    let done = false;
    const finish = () => { if (!done) { done = true; resolve(release); } };
    a.onfinish = finish;
    // A paused timeline (hidden tab) must not hold the acknowledgement hostage.
    setTimeout(finish, 400);
  });
}
