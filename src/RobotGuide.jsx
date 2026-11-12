import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const ROBOTS = {
  dr02: { model: '/models/dr02-pro/dr02-pro.glb?v=2', poster: '/models/dr02-pro/preview.png', names: ['left_hip_y_link', 'right_hip_y_link', 'left_knee_link', 'right_knee_link', 'left_shoulder_y_link', 'right_shoulder_y_link', 'right_shoulder_x_link', 'right_elbow_link', 'right_wrist_z_link'], yaw: 'neck_link', pitch: 'head_link', leftElbow: 'left_elbow_link', waveJoints: ['left_shoulder_y_link', 'left_shoulder_x_link', 'left_elbow_link', 'left_wrist_z_link'], wave: [-2, 0.6, 1.3] },
  g1: { model: '/models/unitree-g1/g1.glb', poster: '/models/unitree-g1/preview.png', names: ['left_hip_pitch_joint', 'right_hip_pitch_joint', 'left_knee_joint', 'right_knee_joint', 'left_shoulder_pitch_joint', 'right_shoulder_pitch_joint', 'right_shoulder_roll_joint', 'right_elbow_joint', 'right_wrist_yaw_joint'], yaw: 'waist_yaw_joint', pitch: 'waist_pitch_joint', leftElbow: 'left_elbow_joint', waveJoints: ['left_shoulder_pitch_joint', 'left_shoulder_roll_joint', 'left_elbow_joint', 'left_wrist_yaw_joint'], wave: [-2.2, 0.5, 1.5] },
};
const clamp = THREE.MathUtils.clamp;
const smooth = (value) => { const t = clamp(value, 0, 1); return t * t * (3 - 2 * t); };

export default function RobotGuide({ variant = 'dr02', isEnglish = false }) {
  const spec = ROBOTS[variant];
  const canvasContainer = useRef(null);
  const waveRequest = useRef(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const host = canvasContainer.current;
    if (!host) return undefined;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    } catch {
      setFailed(true);
      return undefined;
    }
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.AgXToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.domElement.setAttribute('aria-hidden', 'true');
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 1.38, 3.1);
    camera.lookAt(0, 1.38, 0);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const environment = pmrem.fromScene(room, 0.04);
    scene.environment = environment.texture;
    scene.environmentIntensity = 0.5;
    room.dispose();
    const key = new THREE.DirectionalLight(0xe9f1ef, 1.65);
    key.position.set(-3, 5, 4); scene.add(key);
    const cyan = new THREE.DirectionalLight(0x6ccbd0, 0.7);
    cyan.position.set(3, 2, -2); scene.add(cyan);
    const warm = new THREE.DirectionalLight(0xffbb91, 0.35);
    warm.position.set(-3, 1.5, 2); scene.add(warm);

    // A restrained HDR bloom preserves the transparent backdrop and keeps
    // the existing site atmosphere visible through the canvas.
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.12, 0.35, 1.5);
    const outputPass = new OutputPass();
    composer.addPass(renderPass);
    composer.addPass(bloom);
    composer.addPass(outputPass);

    const draco = new DRACOLoader();
    draco.setDecoderPath('/draco/');
    const loader = new GLTFLoader();
    loader.setDRACOLoader(draco);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const axes = { x: new THREE.Vector3(1, 0, 0), y: new THREE.Vector3(0, 0, -1), z: new THREE.Vector3(0, 1, 0) };
    const deltaRotation = new THREE.Quaternion();
    const pointer = { x: null, y: null, yaw: 0, pitch: 0 };
    const headPosition = new THREE.Vector3();
    let gazeAnchor = null;
    const joints = new Map();
    const clock = new THREE.Clock(false);
    let robot = null;
    let pivot = null;
    let disposed = false;
    let visible = true;
    let elapsed = 0;
    let animationStarted = false;
    let mixer = null;
    let walkAction = null;
    let waveAction = null;
    let greeted = false;
    let greetingComplete = false;

    function resize() {
      const { width, height } = host.getBoundingClientRect();
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      composer.setSize(width, height);
      if (robot && reducedMotion.matches) composer.render();
    }
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);

    const updatePointer = (event) => {
      if (reducedMotion.matches) return;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };
    window.addEventListener('pointermove', updatePointer, { passive: true });
    window.addEventListener('pointerdown', updatePointer, { passive: true });

    function setJoint(name, axis, value) {
      const joint = joints.get(name);
      if (!joint) return;
      deltaRotation.setFromAxisAngle(axes[axis], value);
      joint.object.quaternion.copy(joint.rest).multiply(deltaRotation);
    }
    function frame() {
      if (!robot || disposed) return;
      const dt = reducedMotion.matches ? 0 : Math.min(clock.getDelta(), 0.05);
      elapsed += dt;
      const entry = reducedMotion.matches ? 1 : smooth(elapsed / 2.8);
      const settled = reducedMotion.matches ? 1 : smooth((elapsed - 2.5) / 1.4);
      const idle = reducedMotion.matches ? 0 : settled;
      pivot.position.x = -1.7 * (1 - entry) + idle * Math.sin(elapsed * 0.65) * 0.012;
      pivot.rotation.y = (Math.PI / 2) - (Math.PI - 0.18) * smooth((elapsed - 0.9) / 1.9) + idle * Math.sin(elapsed * 0.45) * 0.022;
      pivot.rotation.z = idle * Math.sin(elapsed * 0.65) * 0.008;
      if (reducedMotion.matches) pivot.rotation.y = -Math.PI / 2 + 0.18;
      if (mixer && !reducedMotion.matches) {
        if (!greeted && elapsed >= 2.7) {
          greeted = true;
          walkAction.fadeOut(0.3);
          waveAction.reset().fadeIn(0.3).play();
        }
        if (waveRequest.current && greeted) {
          waveRequest.current = false;
          waveAction.reset().fadeIn(0.2).play();
        }
        mixer.update(dt);
      }
      // Settle into an asymmetric pose after the greeting, with gentle shifts.
      if (greeted && !waveAction.isRunning()) {
        greetingComplete = true;
        const pose = smooth((elapsed - 5.7) / 1.2);
        setJoint(spec.names[4], 'y', pose * (0.09 + Math.sin(elapsed * 0.8) * 0.018));
        setJoint(spec.names[5], 'y', pose * (-0.07 + Math.sin(elapsed * 0.8 + 1.2) * 0.018));
        setJoint(spec.leftElbow, 'y', pose * 0.12);
        setJoint(spec.names[7], 'y', pose * 0.08);
      }
      // Aim relative to the projected head, not the centre of the browser.
      // A virtual target slightly behind the screen keeps the movement natural.
      const head = gazeAnchor || joints.get(spec.pitch)?.object;
      let targetYaw = 0;
      let targetPitch = 0;
      if (greetingComplete && head && pointer.x !== null) {
        head.getWorldPosition(headPosition).project(camera);
        const rect = host.getBoundingClientRect();
        const headX = rect.left + (headPosition.x + 1) * rect.width / 2;
        const headY = rect.top + (1 - headPosition.y) * rect.height / 2;
        const distance = Math.max(rect.height * 1.15, 1);
        targetYaw = clamp(Math.atan2(pointer.x - headX, distance) - 0.18 * settled, -0.65, 0.65);
        targetPitch = clamp(Math.atan2(pointer.y - headY, distance), -0.3, 0.3);
        if (variant === 'g1') {
          targetYaw = clamp(targetYaw, -0.35, 0.35);
          targetPitch = clamp(targetPitch, -0.12, 0.12);
        }
      }
      const follow = 1 - Math.exp(-dt * 3);
      pointer.yaw += (targetYaw - pointer.yaw) * follow;
      pointer.pitch += (targetPitch - pointer.pitch) * follow;
      setJoint(spec.yaw, 'z', pointer.yaw);
      setJoint(spec.pitch, 'y', pointer.pitch);
      composer.render();
    }
    const updateLoop = () => {
      const shouldAnimate = visible && !document.hidden && !reducedMotion.matches && !!robot;
      if (shouldAnimate) {
        clock.start();
        renderer.setAnimationLoop(frame);
      } else {
        renderer.setAnimationLoop(null);
        clock.stop();
        if (robot && !document.hidden) frame();
      }
    };
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; updateLoop(); }, { threshold: 0.05 });
    intersection.observe(host);
    document.addEventListener('visibilitychange', updateLoop);
    reducedMotion.addEventListener('change', updateLoop);
    resize();

    loader.load(spec.model, (gltf) => {
      if (disposed) {
        gltf.scene.traverse((item) => { if (item.isMesh) { item.geometry.dispose(); (Array.isArray(item.material) ? item.material : [item.material]).forEach((m) => m.dispose()); } });
        return;
      }
      robot = gltf.scene;
      robot.traverse((object) => {
        if (object.name.endsWith('_link') || object.name.endsWith('_joint')) joints.set(object.name, { object, rest: object.quaternion.clone() });
        if (object.isMesh) {
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => {
            if (material?.isMeshStandardMaterial) material.roughness = Math.max(material.roughness, 0.48);
          });
        }
      });
      if (variant === 'g1') {
        // The G1 head is fixed to the torso. Use a point near the neck only
        // for screen-space aiming; the waist joints perform the movement.
        const joint = robot.getObjectByName('head_joint');
        const headPart = joint?.getObjectByName('head_link');
        if (joint && headPart) {
          robot.updateMatrixWorld(true);
          const headBounds = new THREE.Box3().setFromObject(headPart);
          const center = headBounds.getCenter(new THREE.Vector3());
          joint.worldToLocal(center);
          gazeAnchor = new THREE.Object3D();
          gazeAnchor.position.copy(center);
          joint.add(gazeAnchor);
        }
      }
      // Centre the model at its feet; the wrapper turns it towards the camera.
      const bounds = new THREE.Box3().setFromObject(robot);
      const size = bounds.getSize(new THREE.Vector3());
      const center = bounds.getCenter(new THREE.Vector3());
      if (!Number.isFinite(size.y) || size.y < 0.01) { setFailed(true); return; }
      robot.position.sub(new THREE.Vector3(center.x, bounds.min.y, center.z));
      pivot = new THREE.Group();
      pivot.scale.setScalar(2.0 / size.y);
      pivot.add(robot);
      scene.add(pivot);

      // The original USD describes joints but contains no animation clips.
      // Build small joint clips and transition them with AnimationMixer, as in
      // the Three.js RobotExpressive example. Axes are converted Z-up to glTF.
      const track = (name, axis, times, angles) => {
        const joint = joints.get(name);
        if (!joint) throw new Error(`Missing robot joint: ${name}`);
        const values = [];
        const easedTimes = [];
        // Ease into and out of each pose while retaining quaternion interpolation.
        for (let i = 0; i < times.length - 1; i++) {
          for (let step = 0; step < 8; step++) {
            const t = step / 8;
            const angle = THREE.MathUtils.lerp(angles[i], angles[i + 1], smooth(t));
            const q = joint.rest.clone().multiply(new THREE.Quaternion().setFromAxisAngle(axes[axis], angle));
            easedTimes.push(THREE.MathUtils.lerp(times[i], times[i + 1], t));
            values.push(q.x, q.y, q.z, q.w);
          }
        }
        const q = joint.rest.clone().multiply(new THREE.Quaternion().setFromAxisAngle(axes[axis], angles.at(-1)));
        easedTimes.push(times.at(-1));
        values.push(q.x, q.y, q.z, q.w);
        return new THREE.QuaternionKeyframeTrack(`${name}.quaternion`, easedTimes, values);
      };
      const cycle = [0, 0.25, 0.5, 0.75, 1];
      const walkClip = new THREE.AnimationClip('Walking', 1, [
        track(spec.names[0], 'y', cycle, [0, 0.28, 0, -0.28, 0]),
        track(spec.names[1], 'y', cycle, [0, -0.28, 0, 0.28, 0]),
        track(spec.names[2], 'y', cycle, [0, 0, 0, 0.3, 0]),
        track(spec.names[3], 'y', cycle, [0, 0.3, 0, 0, 0]),
        track(spec.names[4], 'y', cycle, [0, -0.16, 0, 0.16, 0]),
        track(spec.names[5], 'y', cycle, [0, 0.16, 0, -0.16, 0]),
      ]);
      const gesture = [0, 0.8, 1.15, 1.5, 1.85, 2.2, 3];
      const waveClip = new THREE.AnimationClip('Wave', 3, [
        track(spec.waveJoints[0], 'y', gesture, [0, spec.wave[0], spec.wave[0], spec.wave[0], spec.wave[0], spec.wave[0], 0]),
        track(spec.waveJoints[1], 'x', gesture, [0, spec.wave[1], spec.wave[1], spec.wave[1], spec.wave[1], spec.wave[1], 0]),
        track(spec.waveJoints[2], 'y', gesture, [0, spec.wave[2], spec.wave[2], spec.wave[2], spec.wave[2], spec.wave[2], 0]),
        track(spec.waveJoints[3], 'z', gesture, [0, 0, -0.18, 0.18, -0.18, 0, 0]),
      ]);
      mixer = new THREE.AnimationMixer(robot);
      walkAction = mixer.clipAction(walkClip);
      waveAction = mixer.clipAction(waveClip).setLoop(THREE.LoopOnce, 1);
      waveAction.clampWhenFinished = true;
      walkAction.play();
      animationStarted = true;
      // Draw the initial animated pose before revealing the canvas.
      frame();
      setReady(true);
      updateLoop();
    }, undefined, () => { if (!disposed) setFailed(true); });

    return () => {
      disposed = true;
      renderer.setAnimationLoop(null);
      resizeObserver.disconnect(); intersection.disconnect();
      window.removeEventListener('pointermove', updatePointer);
      window.removeEventListener('pointerdown', updatePointer);
      document.removeEventListener('visibilitychange', updateLoop);
      reducedMotion.removeEventListener('change', updateLoop);
      if (mixer && robot) { mixer.stopAllAction(); mixer.uncacheRoot(robot); }
      if (animationStarted && robot) robot.traverse((item) => {
        if (item.isMesh) { item.geometry.dispose(); (Array.isArray(item.material) ? item.material : [item.material]).forEach((material) => material.dispose()); }
      });
      environment.dispose(); pmrem.dispose(); draco.dispose(); bloom.dispose(); outputPass.dispose(); composer.dispose(); renderer.dispose(); renderer.domElement.remove();
    };
  }, []);

  return (
    <button type="button" className={`robot-guide ${ready ? 'robot-guide--ready' : ''}`} onClick={() => { waveRequest.current = true; }} aria-label={isEnglish ? 'Make the robot wave again' : 'Roboter erneut winken lassen'} title={isEnglish ? 'Click to wave' : 'Zum Winken anklicken'}>
      {failed && <img className="robot-guide__poster" src={spec.poster} alt="" />}
      <span ref={canvasContainer} className="robot-guide__canvas" />
    </button>
  );
}
