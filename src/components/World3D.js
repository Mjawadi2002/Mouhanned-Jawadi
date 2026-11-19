import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import {
  ACCENT, DIM, makeProjectCorridor, makeExperienceTiles, makeOrbits, makeBadges, makePortal,
} from './setpieces';
import { PROJECTS } from '../data';

/*
  The world behind the page. One continuous tunnel you descend through as you scroll.
  - progressRef.current   : 0..1 scroll progress (written by ScrollTrigger in App)
  - gatesRef.current      : array of 0..1 progress values, where each zone begins
  - zoneRef.current       : index of the active zone (its gate lights up)
  - introRef.current.t    : 0..1 dive-in transition after pressing Enter
  - uiRef.current         : { project, mission, cert } selections that drive the set pieces
*/

const DEPTH = 320;
const CAM_BASE_Z = 8;
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
    pos[i * 3 + 2] = 120 - Math.random() * (DEPTH + 200);
    const c = Math.random() < 0.13 ? ACCENT : grey;
    const kk = 0.35 + Math.random() * 0.65;
    col[i * 3] = c.r * kk;
    col[i * 3 + 1] = c.g * kk;
    col[i * 3 + 2] = c.b * kk;
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
  const ring = new THREE.Line(new THREE.BufferGeometry().setFromPoints(ringPts), new THREE.LineBasicMaterial({ color: DIM.clone(), transparent: true, opacity: 0.9 }));
  const tickPts = [];
  for (let i = 0; i < 64; i++) {
    const a = (i / 64) * Math.PI * 2;
    const long = i % 8 === 0;
    const r0 = radius - (long ? 1.1 : 0.45);
    tickPts.push(new THREE.Vector3(Math.cos(a) * r0, Math.sin(a) * r0, 0), new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, 0));
  }
  const ticks = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(tickPts), new THREE.LineBasicMaterial({ color: DIM.clone(), transparent: true, opacity: 0.9 }));
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
  group.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(lines), new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.12 })));
  group.add(new THREE.Points(
    new THREE.BufferGeometry().setFromPoints(pts),
    new THREE.PointsMaterial({ color: ACCENT, size: 1.1, map: sprite(), transparent: true, opacity: 0.9, sizeAttenuation: true, depthWrite: false, alphaTest: 0.02 })
  ));
  return group;
}

// chromatic aberration that grows with speed, a soft vignette and fine film grain
const FINISH = {
  uniforms: { tDiffuse: { value: null }, uAb: { value: 0 }, uTime: { value: 0 }, uGrain: { value: 0.03 }, uVig: { value: 0.4 } },
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
  fragmentShader: `
    uniform sampler2D tDiffuse; uniform float uAb; uniform float uTime; uniform float uGrain; uniform float uVig;
    varying vec2 vUv;
    float rnd(vec2 s){ return fract(sin(dot(s, vec2(12.9898, 78.233))) * 43758.5453); }
    void main(){
      vec2 c = vUv - 0.5; float d = length(c); vec2 off = c * uAb * d;
      vec3 col = vec3(texture2D(tDiffuse, vUv + off).r, texture2D(tDiffuse, vUv).g, texture2D(tDiffuse, vUv - off).b);
      col *= 1.0 - uVig * smoothstep(0.35, 0.9, d);
      col += (rnd(vUv * 1000.0 + uTime) - 0.5) * uGrain;
      gl_FragColor = vec4(col, 1.0);
    }`,
};

export default function World3D({ progressRef, gatesRef, zoneRef, introRef, uiRef, reduced }) {
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
    let dpr = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 1.5);
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(FOG, 1);
    renderer.domElement.setAttribute('aria-hidden', 'true');
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(FOG, 0.0085);
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 600);

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

    const gates = [];
    for (let i = 0; i < 7; i++) {
      const g = makeGate(11);
      g.visible = i > 0; // the core is the start zone's landmark
      scene.add(g);
      gates.push(g);
    }

    // set pieces, one per zone. anchor = index of the zone whose scroll mark places them
    const pieces = [
      { anchor: 1, build: () => makeNetwork(small ? 26 : 44, 15, 70, 15), ahead: 20, plain: true },
      { anchor: 2, build: makeExperienceTiles, ahead: 10 },
      { anchor: 3, build: () => makeProjectCorridor(PROJECTS.length), ahead: 22 },
      { anchor: 4, build: () => makeOrbits(sprite()), ahead: 26 },
      { anchor: 5, build: makeBadges, ahead: 8 },
      { anchor: 6, build: makePortal, ahead: 26 },
    ].map((p) => {
      const made = p.build();
      const group = made.group || made;
      scene.add(group);
      return { anchor: p.anchor, ahead: p.ahead, group, update: made.update, plain: p.plain };
    });

    const state = { z: 0, vel: 0, mx: 0, my: 0, tx: 0, ty: 0, fov: 55, t: 0 };

    // post: bloom, then tone/colour space, then the finishing pass (desktop only)
    let composer = null;
    let finish = null;
    let bloom = null;
    if (!small) {
      try {
        const rt = new THREE.WebGLRenderTarget(4, 4, { type: THREE.HalfFloatType, samples: 2 });
        composer = new EffectComposer(renderer, rt);
        composer.addPass(new RenderPass(scene, camera));
        bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.5, 0.55, 0.2);
        composer.addPass(bloom);
        composer.addPass(new OutputPass());
        finish = new ShaderPass(FINISH);
        composer.addPass(finish);
      } catch (e) {
        composer = null;
      }
    }

    let baseScale = 1;
    let boost = 2.4;
    // adaptive quality: if the device cannot hold ~42fps, shed cost in steps. It never steps back up.
    const perf = { acc: 0, frames: 0, warm: 0, tier: 0 };
    const degrade = () => {
      perf.tier += 1;
      mount.dataset.quality = String(perf.tier);
      if (perf.tier === 1) { composer = null; finish = null; bloom = null; }
      if (perf.tier === 2) { dpr = 1; renderer.setPixelRatio(1); resize(); }
      if (perf.tier >= 3) { dust.geometry.setDrawRange(0, Math.floor(dust.geometry.attributes.position.count / 2)); }
    };

    const resize = () => {
      const w = mount.clientWidth || window.innerWidth;
      const h = mount.clientHeight || window.innerHeight;
      renderer.setSize(w, h, false);
      if (composer) { composer.setPixelRatio(dpr); composer.setSize(w, h); }
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const wide = w / h > 1.15;
      boost = w / h > 1.5 ? 2.1 : wide ? 1.0 : 0.8;
      baseScale = wide ? 1 : 0.8;
      core.position.set(wide ? (w / h > 1.5 ? 19 : 15) : 0, wide ? 0 : 10, -30);
      core.scale.setScalar(baseScale);
    };
    resize();

    const layout = () => {
      const marks = gatesRef.current && gatesRef.current.length ? gatesRef.current : [0, 0.14, 0.3, 0.5, 0.68, 0.84, 0.95];
      gates.forEach((g, i) => {
        const p = marks[i] != null ? marks[i] : i / 6;
        g.position.z = CAM_BASE_Z - p * DEPTH - (i === 0 ? 60 : 16);
      });
      pieces.forEach((pc) => {
        const m = marks[pc.anchor] != null ? marks[pc.anchor] : pc.anchor / 7;
        pc.group.position.z = CAM_BASE_Z - m * DEPTH - pc.ahead;
      });
    };
    layout();

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
    const ui = uiRef && uiRef.current ? uiRef.current : { project: 0, mission: 0, cert: -1 };

    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      if (hidden) return;
      const rawDt = (now - last) / 1000;
      const dt = Math.min(rawDt, 0.05);
      last = now;
      state.t += dt;
      layout();

      const p = progressRef.current || 0;
      const intro = introRef.current ? introRef.current.t : 1;
      const kk = ease(intro);

      const target = CAM_BASE_Z - p * DEPTH + (1 - kk) * 52;
      const prev = state.z;
      state.z += (target - state.z) * (reduced ? 1 : 1 - Math.pow(0.0009, dt));
      state.vel += ((state.z - prev) / Math.max(dt, 0.001) - state.vel) * 0.12;

      state.mx += (state.tx - state.mx) * 0.05;
      state.my += (state.ty - state.my) * 0.05;

      camera.position.set(state.mx * 1.4, -state.my * 0.9, state.z);
      camera.rotation.set(state.my * 0.02, -state.mx * 0.035, 0);

      const surge = ui.surge || 0;
      if (surge > 0) ui.surge = Math.max(0, surge - dt * 0.45);
      const warp = reduced ? 0 : Math.min(Math.abs(state.vel) * 0.045, 14) + surge * 18;
      const fovTarget = 55 + warp + (1 - kk) * 24;
      state.fov += (fovTarget - state.fov) * 0.12;
      if (Math.abs(camera.fov - state.fov) > 0.01) {
        camera.fov = state.fov;
        camera.updateProjectionMatrix();
      }

      // on the start screen the core is large and close, then settles as you dive in
      core.scale.setScalar(baseScale * (1 + (1 - kk) * boost));
      if (!reduced) {
        core.rotation.y += dt * (0.25 + (1 - kk) * 0.35 + surge * 4);
        core.rotation.x += dt * 0.11;
        inner.rotation.y -= dt * 0.6;
        dust.rotation.z += dt * 0.012;
        gates.forEach((g, i) => { g.rotation.z += dt * (i % 2 ? 0.06 : -0.06); });
        pieces.forEach((pc) => { if (pc.plain) pc.group.rotation.z += dt * 0.02; });
      }
      pieces.forEach((pc) => { if (pc.update && !reduced) pc.update(dt, state.t, ui); else if (pc.update) pc.update(1 / 60, 0, ui); });

      const active = zoneRef.current || 0;
      gates.forEach((g, i) => {
        const on = i === active;
        g.userData.mats.forEach((m) => {
          tmp.copy(on ? ACCENT : DIM);
          m.color.lerp(tmp, 0.08);
        });
      });

      if (kk >= 1 && perf.tier < 3) {
        if (perf.warm < 90) perf.warm += 1;
        else {
          perf.acc += rawDt;
          perf.frames += 1;
          if (perf.frames === 90) {
            if (perf.acc / 90 > 0.024) degrade();
            perf.acc = 0;
            perf.frames = 0;
          }
        }
      }

      if (composer) {
        if (bloom) bloom.strength = 0.5 + surge * 1.6;
        finish.uniforms.uTime.value = reduced ? 0 : state.t;
        finish.uniforms.uAb.value = reduced ? 0 : Math.min(Math.abs(state.vel) * 0.00018, 0.022);
        composer.render();
      } else {
        renderer.render(scene, camera);
      }
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
      if (composer) composer.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, [progressRef, gatesRef, zoneRef, introRef, uiRef, reduced]);

  return <div className="world" ref={mountRef} />;
}
