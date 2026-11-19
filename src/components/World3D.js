import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/*
  The world behind the page. One continuous tunnel you descend through as you scroll.
  - progressRef.current   : 0..1 scroll progress (written by ScrollTrigger in App)
  - gatesRef.current      : array of 0..1 progress values, where each zone begins
  - zoneRef.current       : index of the active zone (gate lights up)
  - introRef.current.t    : 0..1 dive-in transition after pressing Enter
*/

const DEPTH = 320;
const CAM_BASE_Z = 8;
const ACCENT = new THREE.Color('#ff8a3d');
const DIM = new THREE.Color('#3b424d');
const FOG = '#07080a';

const ease = (t) => 1 - Math.pow(1 - t, 4);

let spriteTex = null;
function sprite() {
  if (spriteTex) return spriteTex;
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.35, 'rgba(255,255,255,0.85)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  spriteTex = new THREE.CanvasTexture(c);
  return spriteTex;
}

function makeParticles(count) {
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const grey = new THREE.Color('#8b929c');
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = 5 + Math.pow(Math.random(), 0.7) * 34;
    pos[i * 3] = Math.cos(a) * r;
    pos[i * 3 + 1] = Math.sin(a) * r * 0.62;
    pos[i * 3 + 2] = 120 - Math.random() * (DEPTH + 160);
    const c = Math.random() < 0.13 ? ACCENT : grey;
    const k = 0.35 + Math.random() * 0.65;
    col[i * 3] = c.r * k;
    col[i * 3 + 1] = c.g * k;
    col[i * 3 + 2] = c.b * k;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const m = new THREE.PointsMaterial({ size: 0.5, map: sprite(), vertexColors: true, transparent: true, opacity: 0.95, sizeAttenuation: true, depthWrite: false, alphaTest: 0.02 });
  return new THREE.Points(g, m);
}

function makeGate(radius) {
  const group = new THREE.Group();
  const seg = 120;
  const ringPts = [];
  for (let i = 0; i <= seg; i++) {
    const a = (i / seg) * Math.PI * 2;
    ringPts.push(new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, 0));
  }
  const ring = new THREE.Line(new THREE.BufferGeometry().setFromPoints(ringPts), new THREE.LineBasicMaterial({ color: DIM, transparent: true, opacity: 0.9 }));
  const tickPts = [];
  for (let i = 0; i < 64; i++) {
    const a = (i / 64) * Math.PI * 2;
    const long = i % 8 === 0;
    const r0 = radius - (long ? 1.1 : 0.45);
    tickPts.push(new THREE.Vector3(Math.cos(a) * r0, Math.sin(a) * r0, 0), new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, 0));
  }
  const ticks = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(tickPts), new THREE.LineBasicMaterial({ color: DIM, transparent: true, opacity: 0.9 }));
  group.add(ring, ticks);
  group.userData = { mats: [ring.material, ticks.material] };
  return group;
}

function makeNetwork(nodeCount, spread, depth, link) {
  const pts = [];
  for (let i = 0; i < nodeCount; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = 6 + Math.random() * spread;
    pts.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r * 0.7, -Math.random() * depth));
  }
  const lines = [];
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      if (pts[i].distanceTo(pts[j]) < link) lines.push(pts[i], pts[j]);
    }
  }
  const group = new THREE.Group();
  const lg = new THREE.BufferGeometry().setFromPoints(lines);
  const lm = new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.12 });
  group.add(new THREE.LineSegments(lg, lm));
  const ng = new THREE.BufferGeometry().setFromPoints(pts);
  const nm = new THREE.PointsMaterial({ color: ACCENT, size: 1.1, map: sprite(), transparent: true, opacity: 0.9, sizeAttenuation: true, depthWrite: false, alphaTest: 0.02 });
  group.add(new THREE.Points(ng, nm));
  return group;
}

export default function World3D({ progressRef, gatesRef, zoneRef, introRef, reduced }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    } catch (e) {
      return undefined; // no WebGL: the CSS background carries the page
    }

    const small = window.innerWidth < 760;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.5 : 1.75));
    renderer.setClearColor(FOG, 1);
    renderer.domElement.setAttribute('aria-hidden', 'true');
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(FOG, 0.0085);
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 600);

    // tunnel dust
    const dust = makeParticles(small ? 2600 : 5200);
    scene.add(dust);

    // the core: what you dive into
    const core = new THREE.Group();
    const outer = new THREE.LineSegments(
      new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(8.5, 2)),
      new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.8 })
    );
    const inner = new THREE.LineSegments(
      new THREE.WireframeGeometry(new THREE.DodecahedronGeometry(4.4, 0)),
      new THREE.LineBasicMaterial({ color: '#e6e8ea', transparent: true, opacity: 0.7 })
    );
    core.add(outer, inner);
    scene.add(core);

    // zone gates (positions are set from real scroll offsets)
    const gates = [];
    for (let i = 0; i < 7; i++) {
      const g = makeGate(11);
      g.visible = i > 0; // the core is the start zone's landmark
      scene.add(g);
      gates.push(g);
    }

    // neural clusters between gates
    const nets = [];
    for (let i = 0; i < 6; i++) {
      const n = makeNetwork(small ? 26 : 44, 15, 70, 15);
      scene.add(n);
      nets.push(n);
    }

    const state = { z: 0, vel: 0, mx: 0, my: 0, tx: 0, ty: 0, fov: 55 };

    const resize = () => {
      const w = mount.clientWidth || window.innerWidth;
      const h = mount.clientHeight || window.innerHeight;
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      // keep the core on the right on desktop, above the text on narrow screens
      const wide = w / h > 1.15;
      core.position.set(wide ? 15 : 0, wide ? 0 : 10, -30);
      core.scale.setScalar(wide ? 1 : 0.8);
    };
    resize();

    const layoutGates = () => {
      const marks = gatesRef.current && gatesRef.current.length ? gatesRef.current : [0, 0.14, 0.3, 0.5, 0.68, 0.84, 0.95];
      gates.forEach((g, i) => {
        const p = marks[i] != null ? marks[i] : i / 6;
        g.position.z = CAM_BASE_Z - p * DEPTH - (i === 0 ? 60 : 16);
      });
      nets.forEach((n, i) => {
        const a = marks[i + 1] != null ? marks[i + 1] : (i + 1) / 7;
        n.position.z = CAM_BASE_Z - a * DEPTH + 20;
        n.rotation.z = i * 1.3;
      });
    };
    layoutGates();

    const onPointer = (e) => {
      state.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      state.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('resize', resize);

    let raf = 0;
    let last = performance.now();
    let hidden = document.hidden;
    const onVis = () => { hidden = document.hidden; last = performance.now(); };
    document.addEventListener('visibilitychange', onVis);

    const tmp = new THREE.Color();

    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      if (hidden) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      layoutGates();

      const p = progressRef.current || 0;
      const intro = introRef.current ? introRef.current.t : 1;
      const k = ease(intro);

      // camera: scroll sets depth, intro adds a long rush from far back
      const target = CAM_BASE_Z - p * DEPTH + (1 - k) * 78;
      const prev = state.z;
      state.z += (target - state.z) * (reduced ? 1 : 1 - Math.pow(0.0009, dt));
      state.vel += ((state.z - prev) / Math.max(dt, 0.001) - state.vel) * 0.12;

      state.mx += (state.tx - state.mx) * 0.05;
      state.my += (state.ty - state.my) * 0.05;

      camera.position.set(state.mx * 1.4, -state.my * 0.9, state.z);
      camera.rotation.set(state.my * 0.02, -state.mx * 0.035, 0);

      const warp = reduced ? 0 : Math.min(Math.abs(state.vel) * 0.045, 14);
      const fovTarget = 55 + warp + (1 - k) * 38;
      state.fov += (fovTarget - state.fov) * 0.12;
      if (Math.abs(camera.fov - state.fov) > 0.01) {
        camera.fov = state.fov;
        camera.updateProjectionMatrix();
      }

      if (!reduced) {
        core.rotation.y += dt * 0.25;
        core.rotation.x += dt * 0.11;
        inner.rotation.y -= dt * 0.6;
        dust.rotation.z += dt * 0.012;
        gates.forEach((g, i) => { g.rotation.z += dt * (i % 2 ? 0.06 : -0.06); });
        nets.forEach((n, i) => { n.rotation.z += dt * (i % 2 ? 0.02 : -0.02); });
      }

      // light the gate of the active zone
      const active = zoneRef.current || 0;
      gates.forEach((g, i) => {
        const on = i === active;
        g.userData.mats.forEach((m) => {
          tmp.copy(on ? ACCENT : DIM);
          m.color.lerp(tmp, 0.08);
        });
      });

      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVis);
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose());
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, [progressRef, gatesRef, zoneRef, introRef, reduced]);

  return <div className="world" ref={mountRef} />;
}
