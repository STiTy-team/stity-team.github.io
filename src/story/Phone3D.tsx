import { useEffect, useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, RoundedBox } from "@react-three/drei";
import {
  ExtrudeGeometry,
  MathUtils,
  Shape,
  ShapeGeometry,
  type Group,
} from "three";
import {
  CSS3DObject,
  CSS3DRenderer,
} from "three/examples/jsm/renderers/CSS3DRenderer.js";
import type { MotionValue } from "motion/react";
import { poseAt, type Pose } from "./frames";
import type { Rect, Slots } from "./slots";

const W = 1.6;
const H = 3.3;
const D = 0.17;
const BEZEL = 0.07;
const SCREEN_W = W - BEZEL * 2;
const SCREEN_PX = 390;
const RADIUS = 0.27;
const EDGE = 0.035;
const CAMERA_Z = 10;
const FOV = 30;
const FIT = 1.1;
const VISIBLE_H = 2 * CAMERA_Z * Math.tan(MathUtils.degToRad(FOV / 2));

const FRAME_COLOR = "#2b313b";
const HERO_POSE: Pose = { pos: [0, 0, 0], rot: [0.12, -0.42, 0.06] };
const STILL: Pose = { pos: [0, 0, 0], rot: [0, 0, 0] };

type Props = {
  beat: MotionValue<number>;
  hero: MotionValue<number>;
  slots: RefObject<Slots | null>;
  reduced: boolean;
  active: boolean;
  screen: HTMLElement;
};

function roundedRect(w: number, h: number, r: number) {
  const shape = new Shape();
  const x = -w / 2;
  const y = -h / 2;
  shape.moveTo(x + r, y);
  shape.lineTo(x + w - r, y);
  shape.quadraticCurveTo(x + w, y, x + w, y + r);
  shape.lineTo(x + w, y + h - r);
  shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  shape.lineTo(x + r, y + h);
  shape.quadraticCurveTo(x, y + h, x, y + h - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);
  return shape;
}

function usePhoneGeometry() {
  return useMemo(() => {
    const body = new ExtrudeGeometry(
      roundedRect(W - EDGE * 2, H - EDGE * 2, RADIUS - EDGE),
      {
        depth: D - EDGE * 2,
        bevelEnabled: true,
        bevelThickness: EDGE,
        bevelSize: EDGE,
        bevelSegments: 6,
        curveSegments: 24,
      },
    );
    body.translate(0, 0, -(D - EDGE * 2) / 2);
    const glass = new ShapeGeometry(
      roundedRect(W - 0.03, H - 0.03, RADIUS - 0.015),
      24,
    );
    return { body, glass };
  }, []);
}

function CssLayer() {
  const { gl, scene, camera, size } = useThree();
  const renderer = useRef<CSS3DRenderer>(null);

  useEffect(() => {
    const css = new CSS3DRenderer();
    css.domElement.className = "phone-css-layer";
    gl.domElement.parentElement?.parentElement?.appendChild(css.domElement);
    renderer.current = css;
    return () => {
      css.domElement.remove();
      renderer.current = null;
    };
  }, [gl]);

  useEffect(() => {
    renderer.current?.setSize(size.width, size.height);
  }, [size]);

  useFrame(() => renderer.current?.render(scene, camera));
  return null;
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (t: number) => t * t * (3 - 2 * t);
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

function placement(rect: Rect, view: Slots["view"], landscape: number) {
  const visibleW = VISIBLE_H * (view.w / view.h);
  const portrait = ((rect.h / view.h) * VISIBLE_H) / (H * FIT);
  const wide = ((rect.w / view.w) * visibleW) / (H * FIT);
  return {
    x: ((rect.x + rect.w / 2) / view.w - 0.5) * visibleW,
    y: -((rect.y + rect.h / 2) / view.h - 0.5) * VISIBLE_H,
    scale: mix(portrait, Math.min(portrait, wide), landscape),
  };
}

function Rig({ beat, hero, slots, reduced, screen }: Omit<Props, "active">) {
  const group = useRef<Group>(null);
  const geo = usePhoneGeometry();

  useEffect(() => {
    const g = group.current;
    if (!g) return;
    const obj = new CSS3DObject(screen);
    obj.position.set(0, 0, D / 2 + 0.012);
    obj.scale.setScalar(SCREEN_W / SCREEN_PX);
    g.add(obj);
    return () => {
      g.remove(obj);
    };
  }, [screen]);

  useFrame((_, dt) => {
    const g = group.current;
    const s = slots.current;
    if (!g || !s) return;
    const b = beat.get();
    const t = smooth(clamp01(hero.get()));
    const from = placement(s.hero, s.view, 0);
    const to = placement(s.stage, s.view, reduced ? 0 : clamp01(b - 4));
    const local = reduced ? STILL : poseAt(b);
    const start = reduced ? STILL : HERO_POSE;
    const scale = mix(from.scale, to.scale, t);

    const k = 7;
    g.position.x = MathUtils.damp(
      g.position.x,
      mix(from.x, to.x, t) + local.pos[0] * scale * t,
      k,
      dt,
    );
    g.position.y = MathUtils.damp(
      g.position.y,
      mix(from.y, to.y, t) + local.pos[1] * scale * t,
      k,
      dt,
    );
    g.position.z = MathUtils.damp(g.position.z, local.pos[2] * t, k, dt);
    g.scale.setScalar(MathUtils.damp(g.scale.x, scale, k, dt));
    g.rotation.x = MathUtils.damp(
      g.rotation.x,
      mix(start.rot[0], local.rot[0], t),
      k,
      dt,
    );
    g.rotation.y = MathUtils.damp(
      g.rotation.y,
      mix(start.rot[1], local.rot[1], t),
      k,
      dt,
    );
    g.rotation.z = MathUtils.damp(
      g.rotation.z,
      mix(start.rot[2], local.rot[2], t),
      k,
      dt,
    );
  });

  return (
    <group ref={group}>
      <mesh geometry={geo.body}>
        <meshPhysicalMaterial
          color={FRAME_COLOR}
          metalness={0.75}
          roughness={0.32}
          clearcoat={0.6}
          clearcoatRoughness={0.25}
        />
      </mesh>
      <mesh geometry={geo.glass} position={[0, 0, D / 2 + 0.002]}>
        <meshPhysicalMaterial
          color="#05070a"
          roughness={0.12}
          metalness={0.1}
          clearcoat={1}
        />
      </mesh>
      <RoundedBox
        args={[0.5, 0.5, 0.05]}
        radius={0.12}
        position={[-W / 2 + 0.38, H / 2 - 0.38, -D / 2 - 0.02]}
      >
        <meshPhysicalMaterial
          color={FRAME_COLOR}
          metalness={0.6}
          roughness={0.4}
        />
      </RoundedBox>
      {[0.55, 0.15].map((y) => (
        <RoundedBox
          key={y}
          args={[0.03, 0.28, 0.06]}
          radius={0.012}
          position={[-W / 2 - 0.008, y + 0.4, 0]}
        >
          <meshStandardMaterial
            color={FRAME_COLOR}
            metalness={0.8}
            roughness={0.3}
          />
        </RoundedBox>
      ))}
      <RoundedBox
        args={[0.03, 0.45, 0.06]}
        radius={0.012}
        position={[W / 2 + 0.008, 0.75, 0]}
      >
        <meshStandardMaterial
          color={FRAME_COLOR}
          metalness={0.8}
          roughness={0.3}
        />
      </RoundedBox>
    </group>
  );
}

export default function Phone3D({
  beat,
  hero,
  slots,
  reduced,
  active,
  screen,
}: Props) {
  return (
    <Canvas
      className="phone-canvas"
      camera={{ position: [0, 0, CAMERA_Z], fov: FOV }}
      dpr={[1, 2]}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[-3, 5, 6]} intensity={1.4} />
      <Environment resolution={256}>
        <Lightformer
          form="rect"
          intensity={3}
          position={[-4, 3, 4]}
          scale={[4, 8, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1.5}
          position={[5, -1, 3]}
          scale={[3, 6, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1}
          position={[0, 6, -4]}
          scale={[10, 2, 1]}
        />
      </Environment>
      <Rig
        beat={beat}
        hero={hero}
        slots={slots}
        reduced={reduced}
        screen={screen}
      />
      <CssLayer />
    </Canvas>
  );
}
