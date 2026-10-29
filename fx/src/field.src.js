import { WebGLRenderer, Scene, PerspectiveCamera, BufferGeometry, Float32BufferAttribute, Points, PointsMaterial, LineSegments, LineBasicMaterial, Color } from 'three';

/* A small drifting network graph: square nodes, links between neighbours, nodes shy away from the pointer. */
export function mountField(host, reduce) {
  const canvas = document.createElement('canvas');
  canvas.className = 'hero-field'; canvas.setAttribute('aria-hidden', 'true');
  let r;
  try { r = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' }); } catch (e) { return null; }
  host.prepend(canvas);
  const scene = new Scene(), cam = new PerspectiveCamera(45, 1, 0.1, 60);
  cam.position.z = 12;
  const N = innerWidth < 700 ? 42 : 80, LINK = 2.8, MAXE = 360;
  const pa = new Float32BufferAttribute(N * 3, 3), p = pa.array, v = new Float32Array(N * 3);
  const la = new Float32BufferAttribute(MAXE * 6, 3), lp = la.array;
  let bx = 8, by = 5, mx = 0, my = 0, near = false;
  for (let i = 0; i < N; i++) {
    p[i * 3] = (Math.random() * 2 - 1) * bx; p[i * 3 + 1] = (Math.random() * 2 - 1) * by; p[i * 3 + 2] = (Math.random() * 2 - 1) * 3;
    v[i * 3] = (Math.random() - 0.5) * 0.35; v[i * 3 + 1] = (Math.random() - 0.5) * 0.35; v[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
  }
  const pg = new BufferGeometry(); pg.setAttribute('position', pa);
  const lg = new BufferGeometry(); lg.setAttribute('position', la); lg.setDrawRange(0, 0);
  const pm = new PointsMaterial({ size: 0.11, transparent: true, depthWrite: false });
  const lm = new LineBasicMaterial({ transparent: true, depthWrite: false });
  scene.add(new LineSegments(lg, lm), new Points(pg, pm));

  const col = new Color();
  function theme() {
    col.set(getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#2438d6');
    pm.color.copy(col); lm.color.copy(col);
    const dark = document.documentElement.dataset.theme === 'dark';
    pm.opacity = dark ? 0.9 : 0.75; lm.opacity = dark ? 0.3 : 0.2;
    if (reduce) r.render(scene, cam);
  }
  function size() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    r.setPixelRatio(Math.min(devicePixelRatio, 1.75)); r.setSize(w, h, false);
    cam.aspect = w / h; cam.updateProjectionMatrix();
    by = Math.tan(Math.PI / 8) * 12; bx = by * cam.aspect;
    if (reduce) r.render(scene, cam);
  }
  function step(dt) {
    for (let i = 0; i < N; i++) {
      const k = i * 3;
      p[k] += v[k] * dt; p[k + 1] += v[k + 1] * dt; p[k + 2] += v[k + 2] * dt;
      if (Math.abs(p[k]) > bx) v[k] *= -1;
      if (Math.abs(p[k + 1]) > by) v[k + 1] *= -1;
      if (Math.abs(p[k + 2]) > 3) v[k + 2] *= -1;
      if (near) {
        const dx = p[k] - mx, dy = p[k + 1] - my, d = Math.hypot(dx, dy);
        if (d < 2.4 && d > 0.001) { const f = (1 - d / 2.4) * dt * 3.2; p[k] += dx / d * f; p[k + 1] += dy / d * f; }
      }
    }
    let c = 0;
    for (let i = 0; i < N && c < MAXE; i++) for (let j = i + 1; j < N && c < MAXE; j++) {
      const a = i * 3, b = j * 3, dx = p[a] - p[b], dy = p[a + 1] - p[b + 1], dz = p[a + 2] - p[b + 2];
      if (dx * dx + dy * dy + dz * dz < LINK * LINK) {
        const o = c * 6;
        lp[o] = p[a]; lp[o + 1] = p[a + 1]; lp[o + 2] = p[a + 2]; lp[o + 3] = p[b]; lp[o + 4] = p[b + 1]; lp[o + 5] = p[b + 2];
        c++;
      }
    }
    lg.setDrawRange(0, c * 2); la.needsUpdate = true; pa.needsUpdate = true;
  }

  let vis = true, raf = 0, last = 0;
  function frame(t) {
    raf = 0; step(Math.min((t - last) / 1000, 0.05)); last = t; r.render(scene, cam);
    if (vis && !document.hidden) raf = requestAnimationFrame(frame);
  }
  function kick() { if (!raf && !reduce) { last = performance.now(); raf = requestAnimationFrame(frame); } }

  size(); theme(); step(0); r.render(scene, cam);
  new ResizeObserver(size).observe(host);
  new MutationObserver(theme).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  if (!reduce) {
    addEventListener('pointermove', e => {
      const b = canvas.getBoundingClientRect();
      mx = ((e.clientX - b.left) / b.width * 2 - 1) * bx; my = -((e.clientY - b.top) / b.height * 2 - 1) * by; near = true;
    }, { passive: true });
    new IntersectionObserver(([e]) => { vis = e.isIntersecting; if (vis) kick(); }).observe(host);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) kick(); });
    kick();
  }
  return canvas;
}
