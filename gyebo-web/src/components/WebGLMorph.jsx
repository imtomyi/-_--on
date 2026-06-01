/**
 * WebGLMorph — 스크롤 동기화 유기적 모핑 오브젝트
 *
 * Three.js + 커스텀 GLSL 셰이더
 *  morph=0  →  유기적 잎/이삭 형태 · 따뜻한 앰버/골드
 *  morph=1  →  방사 대칭 원형 구조   · 시원한 옥색/민트
 *
 * forwardRef + useImperativeHandle 로 setMorph / setVelocity / setMouse 노출
 */

import { useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react'
import * as THREE from 'three'
import styles from './WebGLMorph.module.css'

/* ── GLSL ──────────────────────────────────────────────── */
const VERT = /* glsl */`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const FRAG = /* glsl */`
  precision highp float;

  uniform float uMorph;
  uniform float uTime;
  uniform float uVelocity;
  uniform vec2  uMouse;
  varying vec2  vUv;

  mat2 rot2(float a) {
    float c = cos(a), s = sin(a);
    return mat2(c, -s, s, c);
  }
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453);
  }
  float noise(vec2 p) {
    vec2 i=floor(p), f=fract(p), u=f*f*(3.-2.*f);
    return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),
               mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);
  }
  float fbm(vec2 p) {
    float v=0.,a=0.5;
    for(int i=0;i<4;i++){v+=a*noise(p);p*=2.1;a*=0.5;}
    return v;
  }
  float smin(float a, float b, float k){
    float h=clamp(.5+.5*(b-a)/k,0.,1.);
    return mix(b,a,h)-k*h*(1.-h);
  }

  /* Shape A: 유기적 잎/이삭 */
  float shapeA(vec2 p) {
    p.x += sin(p.y*5.0+uTime*2.0)*uVelocity*0.012;
    float n = fbm(p*3.5+uTime*0.08)*0.08-0.04;
    p += vec2(n, n*0.5);
    float breathe = sin(uTime*0.55)*0.012;
    return length(p/vec2(0.115+breathe, 0.30+breathe))-1.0;
  }

  /* Shape B: 방사 대칭 원형 (옹기 입구 / 만다라) */
  float shapeB(vec2 p) {
    p = rot2(uTime*0.09)*p;
    float r = length(p);
    float a = atan(p.y, p.x);
    float petals = cos(a*6.0)*0.022+cos(a*12.0)*0.008;
    float outer  = r-(0.21+petals+sin(uTime*0.4)*0.006);
    float inner  = 0.065+fbm(p*6.0+uTime*0.05)*0.02-r;
    float ring   = max(outer,-inner);
    float ripple = sin((r-0.21)*28.0-uTime*0.5)*0.004;
    return ring-ripple*(1.0-step(0.0,outer));
  }

  void main() {
    vec2 uv = vUv - 0.5;
    uv -= uMouse * 0.022;

    float t = smoothstep(0.0, 1.0, uMorph);
    float d = mix(shapeA(uv), shapeB(uv), t);

    /* 앰비언트 글로우 */
    float aGlow = exp(-abs(d+0.015)*5.5)*0.28*(1.0+abs(uVelocity)*0.9);
    /* 서피스 필 */
    float fill  = 1.0-smoothstep(-0.004, 0.012, d);
    /* 에지 하이라이트 */
    float edge  = exp(-abs(d)*55.0);
    /* 내부 텍스처 */
    float tex   = fbm(uv*9.0-uTime*0.06)*0.5+0.5;
    float intr  = fill*(0.60+tex*0.40);

    /* 색상: 따뜻한 앰버 → 시원한 옥색 */
    vec3 wFill = mix(vec3(0.82,0.54,0.08),vec3(0.91,0.68,0.17),tex);
    vec3 wEdge = vec3(1.00,0.86,0.44);
    vec3 wGlow = vec3(0.95,0.73,0.22);
    vec3 cFill = mix(vec3(0.18,0.62,0.54),vec3(0.38,0.80,0.70),tex);
    vec3 cEdge = vec3(0.64,0.97,0.90);
    vec3 cGlow = vec3(0.42,0.89,0.80);

    vec3 fc = mix(wFill,cFill,t);
    vec3 ec = mix(wEdge,cEdge,t);
    vec3 gc = mix(wGlow,cGlow,t);

    vec3 col = fc*intr + ec*edge*(1.0-fill*0.6) + gc*aGlow;
    col += col*abs(uVelocity)*0.18;

    float alpha = max(fill, max(aGlow*2.2, edge*0.65));
    gl_FragColor = vec4(col, clamp(alpha,0.,1.));
  }
`

/* ── Component ─────────────────────────────────────────── */
const WebGLMorph = forwardRef(function WebGLMorph(_props, ref) {
  const wrapRef   = useRef(null)
  const canvasRef = useRef(null)
  const stateRef  = useRef({ morph: 0, velocity: 0, mouse: { x:0, y:0 } })
  const glRef     = useRef({ renderer: null, material: null, frameId: null })

  /* imperative API 노출 */
  useImperativeHandle(ref, () => ({
    setMorph:    v      => { stateRef.current.morph    = v },
    setVelocity: v      => { stateRef.current.velocity = v },
    setMouse:    (x, y) => { stateRef.current.mouse    = { x, y } },
  }), [])

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap   = wrapRef.current
    if (!canvas || !wrap) return

    /* Three.js 셋업 */
    const scene    = new THREE.Scene()
    const camera   = new THREE.OrthographicCamera(-.5,.5,.5,-.5,.1,10)
    camera.position.z = 1

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, premultipliedAlpha: false })
    renderer.setClearColor(0x000000, 0)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    glRef.current.renderer = renderer

    const geo = new THREE.PlaneGeometry(1, 1)
    const mat = new THREE.ShaderMaterial({
      vertexShader: VERT, fragmentShader: FRAG,
      uniforms: {
        uMorph:    { value: 0 },
        uTime:     { value: 0 },
        uVelocity: { value: 0 },
        uMouse:    { value: new THREE.Vector2() },
      },
      transparent: true, depthWrite: false,
    })
    glRef.current.material = mat
    scene.add(new THREE.Mesh(geo, mat))

    /* 리사이즈 */
    const resize = () => {
      const w = wrap.offsetWidth, h = wrap.offsetHeight
      renderer.setSize(w, h)
      const a = w / h
      Object.assign(camera, { left: -a/2, right: a/2, top: .5, bottom: -.5 })
      camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(wrap)

    /* 렌더 루프 */
    const clock = new THREE.Clock()
    const loop  = () => {
      glRef.current.frameId = requestAnimationFrame(loop)
      const s = stateRef.current
      mat.uniforms.uTime.value     = clock.getElapsedTime()
      mat.uniforms.uMorph.value    = s.morph
      mat.uniforms.uVelocity.value = s.velocity
      mat.uniforms.uMouse.value.set(s.mouse.x, s.mouse.y)
      renderer.render(scene, camera)
    }
    loop()

    return () => {
      cancelAnimationFrame(glRef.current.frameId)
      ro.disconnect()
      renderer.dispose()
      mat.dispose()
      geo.dispose()
    }
  }, [])

  return (
    <div ref={wrapRef} className={styles.wrap}>
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  )
})

export default WebGLMorph
