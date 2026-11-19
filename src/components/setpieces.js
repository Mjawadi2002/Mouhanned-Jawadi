import * as THREE from 'three';

/*
  Zone set pieces. Each zone of the page has a physical object in the tunnel,
  and the ones that map to interactive UI (projects, experience, certificates)
  react to what the visitor is selecting or hovering.
  update(dt, t, ui) receives ui = { project, mission, cert } from a shared ref.
*/

export const ACCENT = new THREE.Color('#ff8a3d');
export const DIM = new THREE.Color('#3b424d');
const WHITE = new THREE.Color('#e6e8ea');
const k = (dt, speed = 6) => 1 - Math.exp(-dt * speed); // frame-rate independent lerp factor

const lineMat = (color, opacity = 0.9) => new THREE.LineBasicMaterial({ color: color.clone(), transparent: true, opacity });

/* ------------------------------------------------ Projects: a six-panel corridor */
export function makeProjectCorridor(count = 6) {
  const group = new THREE.Group();
  const panels = [];
  const n = count;
  const R = 13;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + Math.PI / 6;
    const geo = new THREE.BoxGeometry(0.5, 11, 18);
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo), lineMat(DIM));
    const fill = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: ACCENT.clone(), transparent: true, opacity: 0, depthWrite: false }));
    const p = new THREE.Group();
    p.add(fill, edges);
    p.rotation.z = a;
    p.userData = { a, edges, fill, push: 0 };
    p.position.set(Math.cos(a) * R, Math.sin(a) * R * 0.78, 0);
    group.add(p);
    panels.push(p);
  }
  return {
    group,
    update(dt, t, ui) {
      panels.forEach((p, i) => {
        const on = i === ui.project;
        const u = p.userData;
        u.push += ((on ? 1 : 0) - u.push) * k(dt, 7);
        const r = R - u.push * 2.4;
        p.position.set(Math.cos(u.a) * r, Math.sin(u.a) * r * 0.78, 0);
        u.edges.material.color.lerp(on ? ACCENT : DIM, k(dt, 8));
        u.fill.material.opacity = u.push * 0.16;
      });
      group.rotation.z = Math.sin(t * 0.25) * 0.03;
    },
  };
}

/* ------------------------------------------------ Experience: four floors, the current one lit */
export function makeExperienceTiles() {
  const group = new THREE.Group();
  const tiles = [];
  for (let i = 0; i < 4; i++) {
    const grid = new THREE.GridHelper(15, 8, DIM, DIM);
    grid.material.transparent = true;
    grid.material.opacity = 0.7;
    grid.position.set(0, -8.5, -i * 17);
    grid.userData = { lift: 0 };
    group.add(grid);
    tiles.push(grid);
    // a post to mark the floor (the mission "flag")
    const flag = new THREE.LineSegments(
      new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 5, 0)]),
      lineMat(DIM)
    );
    grid.add(flag);
    grid.userData.flag = flag;
  }
  return {
    group,
    update(dt, t, ui) {
      tiles.forEach((g, i) => {
        const on = i === ui.mission;
        g.userData.lift += ((on ? 1 : 0) - g.userData.lift) * k(dt, 6);
        g.position.y = -8.5 + g.userData.lift * 1.6 + Math.sin(t * 0.8 + i) * 0.12;
        g.material.color.lerp(on ? ACCENT : DIM, k(dt, 8));
        g.userData.flag.material.color.lerp(on ? ACCENT : DIM, k(dt, 8));
        g.material.opacity = 0.45 + g.userData.lift * 0.5;
      });
    },
  };
}

/* ------------------------------------------------ Skills: a gyroscope of orbits */
export function makeOrbits(nodeSprite) {
  const group = new THREE.Group();
  const rings = [];
  for (let i = 0; i < 6; i++) {
    const r = 8.5 + i * 2.1;
    const pts = [];
    for (let s = 0; s <= 96; s++) {
      const a = (s / 96) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, 0));
    }
    const ring = new THREE.Group();
    ring.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lineMat(i === 0 ? ACCENT : DIM, i === 0 ? 0.8 : 0.55)));
    const count = 4 + i;
    const nodePts = [];
    for (let c = 0; c < count; c++) {
      const a = (c / count) * Math.PI * 2;
      nodePts.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, 0));
    }
    ring.add(new THREE.Points(
      new THREE.BufferGeometry().setFromPoints(nodePts),
      new THREE.PointsMaterial({ color: i === 0 ? ACCENT : WHITE, size: 0.9, map: nodeSprite, transparent: true, depthWrite: false, alphaTest: 0.02 })
    ));
    ring.rotation.x = 0.5 + i * 0.52;
    ring.rotation.y = i * 0.7;
    ring.userData = { speed: (i % 2 ? 1 : -1) * (0.12 + i * 0.035) };
    group.add(ring);
    rings.push(ring);
  }
  return {
    group,
    update(dt) {
      rings.forEach((r) => { r.rotation.z += dt * r.userData.speed; });
    },
  };
}

/* ------------------------------------------------ Certifications: five badges, hovered one wakes up */
export function makeBadges() {
  const group = new THREE.Group();
  const badges = [];
  for (let i = 0; i < 5; i++) {
    const geo = new THREE.OctahedronGeometry(2.3, 0);
    const b = new THREE.Group();
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo), lineMat(DIM));
    const core = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: ACCENT.clone(), transparent: true, opacity: 0.0, depthWrite: false }));
    b.add(core, edges);
    b.position.set((i % 2 ? 1 : -1) * (7 + (i % 3) * 1.4), ((i * 37) % 5) - 2, -i * 11);
    b.userData = { edges, core, wake: 0, spin: 0.25 + i * 0.08 };
    group.add(b);
    badges.push(b);
  }
  return {
    group,
    update(dt, t, ui) {
      badges.forEach((b, i) => {
        const on = i === ui.cert;
        const u = b.userData;
        u.wake += ((on ? 1 : 0) - u.wake) * k(dt, 8);
        b.rotation.y += dt * (u.spin + u.wake * 2.4);
        b.rotation.x = Math.sin(t * 0.4 + i) * 0.35;
        b.scale.setScalar(1 + u.wake * 0.55);
        u.edges.material.color.lerp(on ? ACCENT : DIM, k(dt, 8));
        u.core.material.opacity = u.wake * 0.28;
      });
    },
  };
}

/* ------------------------------------------------ Contact: the extraction portal */
export function makePortal() {
  const group = new THREE.Group();
  const rings = [];
  const N = 16;
  for (let i = 0; i < N; i++) {
    const r = 15 - i * 0.8;
    const pts = [];
    for (let s = 0; s <= 80; s++) {
      const a = (s / 80) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, 0));
    }
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lineMat(ACCENT, 0.2));
    line.position.z = -i * 3.6;
    line.userData = { i };
    group.add(line);
    rings.push(line);
  }
  const disc = new THREE.Mesh(
    new THREE.CircleGeometry(2.6, 48),
    new THREE.MeshBasicMaterial({ color: new THREE.Color('#ffd9bd'), transparent: true, opacity: 0.95, depthWrite: false })
  );
  disc.position.z = -N * 3.6 - 1;
  group.add(disc);
  return {
    group,
    update(dt, t) {
      rings.forEach((l, i) => {
        const pulse = Math.max(0, Math.sin(t * 2.2 - i * 0.55));
        l.material.opacity = 0.14 + pulse * 0.6;
        l.rotation.z = t * 0.05 * (i % 2 ? 1 : -1);
      });
      disc.scale.setScalar(1 + Math.sin(t * 1.6) * 0.05);
    },
  };
}
