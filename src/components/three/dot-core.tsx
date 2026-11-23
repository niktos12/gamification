'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * DotCoreScene — лёгкая процедурная 3D-модель в эстетике Nothing Glyph.
 *
 * Состав сцены:
 *  - «дот-матричная» сфера из ~1000 точек (белые + редкие красные «светодиоды»);
 *  - стеклянное ядро (physical transmission) с пульсирующим белым сердечником
 *    и красной точечной подсветкой изнутри;
 *  - три точечных орбитальных кольца с разным наклоном и скоростью;
 *  - рассеянные фоновые частицы.
 *
 * Почему это быстро:
 *  - Ни одного внешнего файла: вся геометрия генерируется кодом — «модель»
 *    весит 0 байт и появляется мгновенно.
 *  - three.js подгружается отдельным lazy-чанком (import()) только в браузере
 *    и не блокирует первую отрисовку страницы.
 *  - Рендер ставится на паузу, когда сцена вне вьюпорта или вкладка скрыта.
 */

type RingSpec = {
  radius: number;
  tiltX: number;
  tiltZ: number;
  speed: number;
  count: number;
  size: number;
  redEvery: number;
};

const RED = '#d71921';

type RingSpinner = {
  points: import('three').Points;
  speed: number;
};

export default function DotCoreScene({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let disposed = false;
    let cleanup = () => {};

    (async () => {
      try {
        const [THREE, envMod] = await Promise.all([
          import('three'),
          import('three/addons/environments/RoomEnvironment.js'),
        ]);
        if (disposed || !host) return;

        const width = host.clientWidth || 480;
        const height = host.clientHeight || 480;

        /* Renderer -------------------------------------------------- */
        const renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setSize(width, height);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.1;
        renderer.domElement.style.cssText =
          'position:absolute;inset:0;width:100%;height:100%;display:block;';
        host.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
        camera.position.set(0.9, 0.7, 5.3);

        /* Procedural environment (без загрузки HDR-файлов) ---------- */
        const pmrem = new THREE.PMREMGenerator(renderer);
        const envTex = pmrem.fromScene(new envMod.RoomEnvironment(), 0.06).texture;
        scene.environment = envTex;

        const disposables: { dispose: () => void }[] = [envTex, pmrem];
        const track = <T extends { dispose: () => void }>(x: T): T => {
          disposables.push(x);
          return x;
        };

        /* Lights ---------------------------------------------------- */
        scene.add(new THREE.AmbientLight(0xffffff, 0.45));
        const dir = new THREE.DirectionalLight(0xffffff, 1.5);
        dir.position.set(4, 6, 6);
        scene.add(dir);

        /* World group (float + parallax) ----------------------------- */
        const world = new THREE.Group();
        scene.add(world);

        /* Dot-matrix sphere ------------------------------------------ */
        const dotsGroup = new THREE.Group();
        world.add(dotsGroup);

        const R = 1.78;
        const N = 1050;
        const pos = new Float32Array(N * 3);
        const col = new Float32Array(N * 3);
        const cWhite = new THREE.Color('#ffffff');
        const cGray = new THREE.Color('#8f8f8f');
        const cRed = new THREE.Color(RED);
        const golden = Math.PI * (3 - Math.sqrt(5));
        const redIndexes: number[] = [];

        for (let i = 0; i < N; i++) {
          const y = 1 - (i / (N - 1)) * 2;
          const rad = Math.sqrt(Math.max(0, 1 - y * y));
          const theta = golden * i;
          pos[i * 3] = Math.cos(theta) * rad * R;
          pos[i * 3 + 1] = y * R;
          pos[i * 3 + 2] = Math.sin(theta) * rad * R;

          const rnd = Math.random();
          const c = rnd < 0.055 ? cRed : rnd < 0.3 ? cGray : cWhite;
          if (c === cRed) redIndexes.push(i);
          col[i * 3] = c.r;
          col[i * 3 + 1] = c.g;
          col[i * 3 + 2] = c.b;
        }

        const dotGeo = track(new THREE.BufferGeometry());
        dotGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        dotGeo.setAttribute('color', new THREE.BufferAttribute(col, 3));
        const dotMat = track(
          new THREE.PointsMaterial({
            vertexColors: true,
            size: 0.03,
            transparent: true,
            opacity: 0.95,
            sizeAttenuation: true,
            depthWrite: false,
          })
        );
        dotsGroup.add(new THREE.Points(dotGeo, dotMat));

        /* Red glyph LEDs — отдельный слой со свечением ---------------- */
        if (redIndexes.length) {
          const rp = new Float32Array(redIndexes.length * 3);
          redIndexes.forEach((idx, k) => {
            rp[k * 3] = pos[idx * 3];
            rp[k * 3 + 1] = pos[idx * 3 + 1];
            rp[k * 3 + 2] = pos[idx * 3 + 2];
          });
          const rg = track(new THREE.BufferGeometry());
          rg.setAttribute('position', new THREE.BufferAttribute(rp, 3));
          const rm = track(
            new THREE.PointsMaterial({
              color: new THREE.Color('#ff2a33'),
              size: 0.075,
              transparent: true,
              opacity: 0.85,
              sizeAttenuation: true,
              depthWrite: false,
              blending: THREE.AdditiveBlending,
            })
          );
          dotsGroup.add(new THREE.Points(rg, rm));
        }

        /* Glass core -------------------------------------------------- */
        const coreGroup = new THREE.Group();
        world.add(coreGroup);

        const webgl2 = renderer.capabilities.isWebGL2;
        const glassGeo = track(new THREE.SphereGeometry(1.12, 48, 48));
        const glassMat = track(
          new THREE.MeshPhysicalMaterial({
            color: new THREE.Color('#ffffff'),
            metalness: 0,
            roughness: 0.14,
            transmission: webgl2 ? 1 : 0,
            opacity: webgl2 ? 1 : 0.16,
            thickness: 1.5,
            ior: 1.42,
            clearcoat: 1,
            clearcoatRoughness: 0.12,
            transparent: true,
            envMapIntensity: 1.25,
            attenuationColor: new THREE.Color('#ddd6d6'),
            attenuationDistance: 3.2,
          })
        );
        coreGroup.add(new THREE.Mesh(glassGeo, glassMat));

        /* Wireframe shell inside the glass ---------------------------- */
        const wireGeo = track(new THREE.IcosahedronGeometry(0.66, 1));
        const wireMat = track(
          new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe: true,
            transparent: true,
            opacity: 0.22,
          })
        );
        const wireShell = new THREE.Mesh(wireGeo, wireMat);
        coreGroup.add(wireShell);

        /* Pulsing white heart of the model ---------------------------- */
        const coreGeo = track(new THREE.IcosahedronGeometry(0.34, 2));
        const coreMat = track(
          new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0xffffff,
            emissiveIntensity: 1.5,
            roughness: 0.35,
            metalness: 0.1,
          })
        );
        const core = new THREE.Mesh(coreGeo, coreMat);
        coreGroup.add(core);

        const redLight = new THREE.PointLight(new THREE.Color(RED), 10, 8, 1.6);
        coreGroup.add(redLight);

        /* Orbiting dot rings ------------------------------------------ */
        const ringSpecs: RingSpec[] = [
          { radius: 2.0, tiltX: 1.15, tiltZ: 0.18, speed: 0.24, count: 88, size: 0.03, redEvery: 16 },
          { radius: 2.42, tiltX: 1.5, tiltZ: -0.55, speed: -0.17, count: 106, size: 0.026, redEvery: 22 },
          { radius: 1.72, tiltX: 0.55, tiltZ: 0.95, speed: 0.32, count: 70, size: 0.024, redEvery: 0 },
        ];

        const ringSpinners: RingSpinner[] = [];
        for (const spec of ringSpecs) {
          const pivot = new THREE.Group();
          pivot.rotation.x = spec.tiltX;
          pivot.rotation.z = spec.tiltZ;

          const n = spec.count;
          const p = new Float32Array(n * 3);
          const cc = new Float32Array(n * 3);
          for (let i = 0; i < n; i++) {
            const a = (i / n) * Math.PI * 2;
            p[i * 3] = Math.cos(a) * spec.radius;
            p[i * 3 + 1] = 0;
            p[i * 3 + 2] = Math.sin(a) * spec.radius;
            const c = spec.redEvery > 0 && i % spec.redEvery === 0 ? cRed : cWhite;
            cc[i * 3] = c.r;
            cc[i * 3 + 1] = c.g;
            cc[i * 3 + 2] = c.b;
          }
          const g = track(new THREE.BufferGeometry());
          g.setAttribute('position', new THREE.BufferAttribute(p, 3));
          g.setAttribute('color', new THREE.BufferAttribute(cc, 3));
          const m = track(
            new THREE.PointsMaterial({
              vertexColors: true,
              size: spec.size,
              transparent: true,
              opacity: 0.8,
              sizeAttenuation: true,
              depthWrite: false,
            })
          );
          const points = new THREE.Points(g, m);
          pivot.add(points);
          world.add(pivot);
          ringSpinners.push({ points, speed: spec.speed });
        }

        /* Ambient particles ------------------------------------------- */
        const PN = 120;
        const ppos = new Float32Array(PN * 3);
        for (let i = 0; i < PN; i++) {
          const r = 2.9 + Math.random() * 1.7;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          ppos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
          ppos[i * 3 + 1] = r * Math.cos(phi) * 0.8;
          ppos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
        }
        const pGeo = track(new THREE.BufferGeometry());
        pGeo.setAttribute('position', new THREE.BufferAttribute(ppos, 3));
        const pMat = track(
          new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.02,
            transparent: true,
            opacity: 0.5,
            depthWrite: false,
            sizeAttenuation: true,
          })
        );
        const particles = new THREE.Points(pGeo, pMat);
        scene.add(particles);

        /* Pointer parallax ------------------------------------------- */
        let mx = 0;
        let my = 0;
        let tx = 0;
        let ty = 0;
        const onPointer = (e: PointerEvent) => {
          const r = host.getBoundingClientRect();
          tx = ((e.clientX - r.left) / Math.max(1, r.width) - 0.5) * 2;
          ty = ((e.clientY - r.top) / Math.max(1, r.height) - 0.5) * 2;
        };
        window.addEventListener('pointermove', onPointer, { passive: true });

        /* Resize ------------------------------------------------------ */
        const ro = new ResizeObserver(() => {
          const w = host.clientWidth;
          const h = host.clientHeight;
          if (!w || !h) return;
          renderer.setSize(w, h);
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
        });
        ro.observe(host);

        /* Render loop with pause off-screen / hidden tab -------------- */
        const clock = new THREE.Clock();
        let t = 0;
        let visible = true;
        let running = false;

        const tick = () => {
          const dt = Math.min(clock.getDelta(), 0.05);
          t += dt;

          dotsGroup.rotation.y = t * 0.14;
          dotsGroup.rotation.x = Math.sin(t * 0.21) * 0.07;

          coreGroup.rotation.y = -t * 0.08;
          coreGroup.position.y = Math.sin(t * 0.8) * 0.07;
          wireShell.rotation.y = t * 0.4;
          wireShell.rotation.x = t * 0.26;

          const pulse = 1 + Math.sin(t * 2.2) * 0.07;
          core.scale.setScalar(pulse);
          coreMat.emissiveIntensity = 1.25 + Math.sin(t * 2.2) * 0.45;
          redLight.intensity = 8 + Math.sin(t * 2.2) * 2.5;

          for (const ring of ringSpinners) {
            ring.points.rotation.y = t * ring.speed;
          }

          particles.rotation.y = t * 0.05;

          mx += (tx - mx) * 0.05;
          my += (ty - my) * 0.05;
          camera.position.x = 0.9 + mx * 0.45;
          camera.position.y = 0.7 - my * 0.35;
          camera.lookAt(0, 0, 0);

          renderer.render(scene, camera);
        };

        const updateLoop = () => {
          const should = visible && !document.hidden;
          if (should && !running) {
            clock.getDelta();
            renderer.setAnimationLoop(tick);
            running = true;
          } else if (!should && running) {
            renderer.setAnimationLoop(null);
            running = false;
          }
        };

        const io = new IntersectionObserver(
          (entries) => {
            visible = entries[0]?.isIntersecting ?? true;
            updateLoop();
          },
          { threshold: 0.05 }
        );
        io.observe(host);
        const onVis = () => updateLoop();
        document.addEventListener('visibilitychange', onVis);
        updateLoop();

        cleanup = () => {
          renderer.setAnimationLoop(null);
          io.disconnect();
          ro.disconnect();
          window.removeEventListener('pointermove', onPointer);
          document.removeEventListener('visibilitychange', onVis);
          for (const d of disposables) d.dispose();
          renderer.dispose();
          renderer.domElement.remove();
        };
      } catch {
        if (!disposed) setFailed(true);
      }
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  if (failed) return <DotCoreFallback className={className} />;

  return (
    <div
      ref={hostRef}
      className={cn('relative', className)}
      aria-hidden="true"
      role="presentation"
    />
  );
}

/* CSS-фолбэк, если WebGL недоступен — дот-матричная сфера на CSS. */
function DotCoreFallback({ className }: { className?: string }) {
  return (
    <div className={cn('relative flex items-center justify-center', className)} aria-hidden="true">
      <div className="animate-pulse-glow absolute h-64 w-64 rounded-full bg-white/10 blur-2xl" />
      <div className="relative flex h-52 w-52 items-center justify-center overflow-hidden rounded-full border border-white/12 bg-white/[0.03] backdrop-blur-xl sm:h-60 sm:w-60">
        <div className="dot-grid absolute inset-0 opacity-70" />
        <span className="absolute left-9 top-10 h-1.5 w-1.5 rounded-full bg-[#d71921] shadow-[0_0_10px_rgba(215,25,33,0.9)]" />
        <span className="absolute bottom-12 right-10 h-1.5 w-1.5 rounded-full bg-[#d71921] shadow-[0_0_10px_rgba(215,25,33,0.9)]" />
        <span className="absolute right-12 top-14 h-1 w-1 rounded-full bg-white/70" />
        <span className="absolute inset-[30%] rounded-full border border-white/25 bg-white/10 backdrop-blur-md" />
        <span className="rec-dot absolute" />
      </div>
      <span className="absolute left-2 top-6 h-10 w-10 rounded-full border border-white/15" />
      <span className="absolute bottom-6 right-4 h-14 w-14 rounded-full border border-white/10" />
    </div>
  );
}
