import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";
import { RectAreaLightUniformsLib } from "three/addons/lights/RectAreaLightUniformsLib.js";
import { useFrame, useThree, usePagePointer, useScene } from "@wron/kit/3d/objects";
import { heroSignal } from "../components/home/heroSignal";

RectAreaLightUniformsLib.init();

const GREEN = "#2DD4A3";
const VIOLET = "#A78BFA";
const MAX_GLYPHS = 140;
const damp = THREE.MathUtils.damp;

function rand(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/* Rows of code as instanced quads on a floating editor plane */
function CodeRows({ count, width, top, seed }) {
  const ref = useRef();
  const rows = useMemo(() => {
    const r = rand(seed);
    const palette = ["#5C6773", GREEN, VIOLET, "#C9D1DB", "#5C6773"];
    const out = [];
    let y = top;
    for (let i = 0; i < count; i++) {
      const indent = Math.floor(r() * 3) * 0.12;
      let x = -width / 2 + 0.22 + indent;
      const parts = 1 + Math.floor(r() * 3);
      for (let p = 0; p < parts; p++) {
        const w = 0.12 + r() * (width * 0.28);
        if (x + w > width / 2 - 0.1) break;
        out.push({ x: x + w / 2, y, w, c: palette[Math.floor(r() * palette.length)] });
        x += w + 0.06;
      }
      out.push({ x: -width / 2 + 0.1, y, w: 0.05, c: "#3A4552" });
      y -= 0.13;
    }
    return out;
  }, [count, width, top, seed]);

  useLayoutEffect(() => {
    const m = new THREE.Object3D();
    const col = new THREE.Color();
    rows.forEach((q, i) => {
      m.position.set(q.x, q.y, 0.006);
      m.scale.set(q.w, 0.045, 1);
      m.updateMatrix();
      ref.current.setMatrixAt(i, m.matrix);
      ref.current.setColorAt(i, col.set(q.c));
    });
    ref.current.instanceMatrix.needsUpdate = true;
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
  }, [rows]);

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, rows.length]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial toneMapped={false} transparent opacity={0.9} />
    </instancedMesh>
  );
}

function EditorPanel({ x, y, rot, width, height, sep, seed, rows, assembly }) {
  const ref = useRef();
  useFrame(() => {
    if (!ref.current) return;
    ref.current.position.z = -0.9 - (1 - assembly.current) * sep;
  });
  return (
    <group ref={ref} position={[x, y, -0.9 - sep]} rotation={[0, rot, 0]}>
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[width + 0.03, height + 0.03]} />
        <meshBasicMaterial color={GREEN} transparent opacity={0.35} toneMapped={false} />
      </mesh>
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color="#10151B" roughness={0.6} metalness={0.2} transparent opacity={0.94} />
      </mesh>
      <mesh position={[0, height / 2 - 0.12, 0.004]}>
        <planeGeometry args={[width, 0.24]} />
        <meshBasicMaterial color="#161C23" />
      </mesh>
      <mesh position={[-width / 2 + 0.16, height / 2 - 0.12, 0.008]}>
        <circleGeometry args={[0.035, 16]} />
        <meshBasicMaterial color={VIOLET} toneMapped={false} />
      </mesh>
      <CodeRows count={rows} width={width} top={height / 2 - 0.4} seed={seed} />
    </group>
  );
}

/* Glyph particles: scattered dashes that snap into ordered rows inside the viewport */
function Glyphs({ reduce, settle }) {
  const ref = useRef();
  const data = useMemo(() => {
    const r = rand(7);
    return Array.from({ length: MAX_GLYPHS }, (_, i) => {
      const a = r() * Math.PI * 2;
      const rad = 1 + r() * 0.35;
      const col = i % 16;
      const row = Math.floor(i / 16);
      return {
        sx: Math.cos(a) * 2.65 * rad,
        sy: Math.sin(a) * 1.75 * rad - 0.1,
        sz: (r() - 0.5) * 1.6,
        rz: (r() - 0.5) * 2.4,
        tx: -1.45 + col * 0.19,
        ty: 0.62 - row * 0.15,
        len: 0.08 + r() * 0.12,
        phase: r() * Math.PI * 2,
        violet: r() < 0.35,
        s: 0,
      };
    });
  }, []);

  useLayoutEffect(() => {
    const col = new THREE.Color();
    data.forEach((g, i) => ref.current.setColorAt(i, col.set(g.violet ? VIOLET : GREEN)));
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
  }, [data]);

  const m = useMemo(() => new THREE.Object3D(), []);
  useFrame((state, dt) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const visible = reduce ? 40 : Math.min(MAX_GLYPHS, 22 + Math.floor(heroSignal.length * 0.8));
    const k = settle.current;
    data.forEach((g, i) => {
      const target = i < visible ? 1 : 0;
      g.s = reduce ? target : damp(g.s, target, 8, dt);
      const drift = reduce ? 0 : Math.sin(t * 0.6 + g.phase) * 0.06;
      m.position.set(
        THREE.MathUtils.lerp(g.sx, g.tx, k),
        THREE.MathUtils.lerp(g.sy + drift, g.ty, k),
        THREE.MathUtils.lerp(g.sz, 0.09, k)
      );
      m.rotation.set(0, 0, THREE.MathUtils.lerp(g.rz, 0, k));
      m.scale.set(THREE.MathUtils.lerp(g.len, 0.13, k) * g.s, 0.022 * g.s + 0.0001, 1);
      m.updateMatrix();
      ref.current.setMatrixAt(i, m.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, MAX_GLYPHS]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  );
}

function AreaLight({ color, intensity, position, width, height }) {
  const ref = useRef();
  useEffect(() => {
    ref.current?.lookAt(0, 0, 0);
  }, []);
  return <rectAreaLight ref={ref} color={color} intensity={intensity} width={width} height={height} position={position} />;
}

export default function BrowserWindow() {
  const { small, reduce } = useScene();
  const pointer = usePagePointer();
  const { camera } = useThree();
  const group = useRef();
  const assembly = useRef(reduce ? 1 : 0);
  const settle = useRef(0);
  const baseZ = useRef(null);

  const base = small ? { x: 0.04, y: -0.1, z: -0.05 } : { x: 0.1, y: -0.2, z: -0.07 };
  const maxRot = small ? THREE.MathUtils.degToRad(3) : THREE.MathUtils.degToRad(4);

  useFrame((state, dt) => {
    if (baseZ.current === null) baseZ.current = camera.position.z;
    const submitted = heroSignal.submitted;
    if (reduce) {
      assembly.current = 1;
      settle.current = submitted ? 1 : 0;
      return;
    }
    const typed = Math.min(1, heroSignal.phrases / 3);
    const target = submitted ? 1 : Math.max(0.55, typed);
    assembly.current = damp(assembly.current, target, 4.3, dt);
    settle.current = damp(settle.current, submitted ? 1 : 0, 6, dt);
    camera.position.z = damp(camera.position.z, baseZ.current - (submitted ? 0.9 : 0), 4, dt);

    const g = group.current;
    if (!g) return;
    const p = pointer.current || pointer;
    const px = THREE.MathUtils.clamp(p.x || 0, -1, 1);
    const py = THREE.MathUtils.clamp(p.y || 0, -1, 1);
    g.rotation.y = damp(g.rotation.y, base.y + px * maxRot, 4, dt);
    g.rotation.x = damp(g.rotation.x, base.x - py * maxRot, 4, dt);
    g.position.y = (small ? 0 : -0.2) + Math.sin(state.clock.elapsedTime * 0.8) * 0.04;
  });

  const size = useThree((s) => s.size);
  const aspect = size.width / Math.max(1, size.height);
  const fitW = 2 * 7.5 * Math.tan(THREE.MathUtils.degToRad(17.5)) * aspect;
  const scale = small ? Math.min(1.25, Math.max(0.6, fitW / 3.5)) : 1;

  return (
    <>
      <AreaLight color={GREEN} intensity={6} width={5} height={0.8} position={[2.6, 1.4, 2.4]} />
      <AreaLight color={VIOLET} intensity={3} width={3} height={2} position={[-3, -0.8, 2]} />
      <group ref={group} scale={scale} position={[0, small ? 0 : -0.2, 0]} rotation={[base.x, base.y, base.z]}>
        {!small && (
          <>
            <EditorPanel x={-1.15} y={0.95} rot={0.08} width={1.5} height={1.9} sep={2.4} seed={11} rows={8} assembly={assembly} />
            <EditorPanel x={0.35} y={1.15} rot={0.02} width={1.8} height={2.0} sep={3.2} seed={23} rows={11} assembly={assembly} />
            <EditorPanel x={1.75} y={0.8} rot={-0.06} width={1.45} height={1.8} sep={2.8} seed={37} rows={8} assembly={assembly} />
          </>
        )}

        {/* Green rim */}
        <RoundedBox args={[3.72, 2.52, 0.05]} radius={0.12} smoothness={4} position={[0, 0, -0.05]}>
          <meshBasicMaterial color={GREEN} toneMapped={false} />
        </RoundedBox>
        {/* Charcoal frame with a restrained transmissive shell */}
        <RoundedBox args={[3.6, 2.4, 0.14]} radius={0.1} smoothness={4}>
          <meshPhysicalMaterial color="#151A20" roughness={0.32} metalness={0.25} transmission={0.2} thickness={0.5} clearcoat={0.6} clearcoatRoughness={0.3} />
        </RoundedBox>
        {/* Viewport */}
        <mesh position={[0, -0.12, 0.072]}>
          <planeGeometry args={[3.34, 1.98]} />
          <meshBasicMaterial color="#26303A" />
        </mesh>
        <mesh position={[0, -0.12, 0.074]}>
          <planeGeometry args={[3.3, 1.94]} />
          <meshStandardMaterial color="#0D1116" roughness={0.85} />
        </mesh>
        {/* Toolbar */}
        {[["#F87171", -1.6], ["#FBBF24", -1.47], [GREEN, -1.34]].map(([c, x]) => (
          <mesh key={x} position={[x, 1.0, 0.074]}>
            <circleGeometry args={[0.045, 20]} />
            <meshBasicMaterial color={c} toneMapped={false} />
          </mesh>
        ))}
        <mesh position={[0.15, 1.0, 0.074]}>
          <planeGeometry args={[2.3, 0.09]} />
          <meshBasicMaterial color="#222A33" />
        </mesh>

        <Glyphs reduce={reduce} settle={settle} />
      </group>
    </>
  );
}
