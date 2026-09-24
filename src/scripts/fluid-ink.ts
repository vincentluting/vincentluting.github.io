/*
 * <fluid-ink> — sumi ink moving through water on paper, behind the home page hero.
 *
 * The fluid solver (splat, vorticity confinement, Jacobi pressure solve,
 * advection) is adapted from astro-sumi by kpab
 * (https://github.com/kpab/astro-sumi, MIT License, Copyright (c) 2026 kpab).
 *
 * What this version adds, to make it read as ink painting rather than smoke:
 *   • Two pigments. The dye texture holds sumi ink in R and vermilion in G.
 *   • Ink tone. Thin washes are cool and grey, dense ink goes deep black, and
 *     pigment pools at the edge of a wash the way it does when ink dries.
 *   • Paper. A paper texture (fibres, tooth, wicking) is rendered once; the
 *     ink granulates into its tooth and creeps a little along its fibres.
 *   • Gestures. Besides soft drops, the ambient flow paints tapered brush
 *     strokes, and now and then a small drop of vermilion. A click drops ink.
 *   • The canvas is transparent, so the static mountains and the paper under
 *     it stay visible; only the ink is drawn.
 *
 * It follows the site's motion toggle (html[data-motion]) and the OS
 * reduced-motion setting, and does not start on small screens or without
 * WebGL2; the static ink wash underneath is shown instead.
 */

const VERTEX = `attribute vec2 aPos;varying vec2 vUv;void main(){vUv=aPos*.5+.5;gl_Position=vec4(aPos,0.,1.);}`;

const NOISE = `float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1.,0.)),f.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p=p*2.03+vec2(17.3,9.1);a*=.5;}return v;}`;

const FRAGMENT = {
  splat: `precision highp float;varying vec2 vUv;uniform sampler2D uTarget;uniform float uAspect,uRadius;uniform vec2 uPoint;uniform vec3 uColor;void main(){vec2 p=vUv-uPoint;p.x*=uAspect;float s=exp(-dot(p,p)/uRadius);gl_FragColor=vec4(texture2D(uTarget,vUv).xyz+s*uColor,1.);}`,
  advect: `precision highp float;varying vec2 vUv;uniform sampler2D uVel,uSrc;uniform vec2 uTexel;uniform float uDt,uDiss;void main(){vec2 c=vUv-uDt*texture2D(uVel,vUv).xy*uTexel;gl_FragColor=uDiss*texture2D(uSrc,c);}`,
  divergence: `precision highp float;varying vec2 vUv;uniform sampler2D uVel;uniform vec2 uTexel;void main(){float L=texture2D(uVel,vUv-vec2(uTexel.x,0.)).x;float R=texture2D(uVel,vUv+vec2(uTexel.x,0.)).x;float B=texture2D(uVel,vUv-vec2(0.,uTexel.y)).y;float T=texture2D(uVel,vUv+vec2(0.,uTexel.y)).y;gl_FragColor=vec4(.5*(R-L+T-B),0.,0.,1.);}`,
  curl: `precision highp float;varying vec2 vUv;uniform sampler2D uVel;uniform vec2 uTexel;void main(){float L=texture2D(uVel,vUv-vec2(uTexel.x,0.)).y;float R=texture2D(uVel,vUv+vec2(uTexel.x,0.)).y;float B=texture2D(uVel,vUv-vec2(0.,uTexel.y)).x;float T=texture2D(uVel,vUv+vec2(0.,uTexel.y)).x;gl_FragColor=vec4(.5*(R-L-T+B),0.,0.,1.);}`,
  vorticity: `precision highp float;varying vec2 vUv;uniform sampler2D uVel,uCurl;uniform vec2 uTexel;uniform float uDt,uEps;void main(){float L=texture2D(uCurl,vUv-vec2(uTexel.x,0.)).x;float R=texture2D(uCurl,vUv+vec2(uTexel.x,0.)).x;float B=texture2D(uCurl,vUv-vec2(0.,uTexel.y)).x;float T=texture2D(uCurl,vUv+vec2(0.,uTexel.y)).x;float C=texture2D(uCurl,vUv).x;vec2 f=vec2(abs(T)-abs(B),abs(L)-abs(R));f/=length(f)+1e-4;f*=uEps*C;vec2 v=texture2D(uVel,vUv).xy+f*uDt;gl_FragColor=vec4(v,0.,1.);}`,
  pressure: `precision highp float;varying vec2 vUv;uniform sampler2D uPre,uDiv;uniform vec2 uTexel;void main(){float L=texture2D(uPre,vUv-vec2(uTexel.x,0.)).x;float R=texture2D(uPre,vUv+vec2(uTexel.x,0.)).x;float B=texture2D(uPre,vUv-vec2(0.,uTexel.y)).x;float T=texture2D(uPre,vUv+vec2(0.,uTexel.y)).x;float d=texture2D(uDiv,vUv).x;gl_FragColor=vec4((L+R+B+T-d)*.25,0.,0.,1.);}`,
  gradient: `precision highp float;varying vec2 vUv;uniform sampler2D uPre,uVel;uniform vec2 uTexel;void main(){float L=texture2D(uPre,vUv-vec2(uTexel.x,0.)).x;float R=texture2D(uPre,vUv+vec2(uTexel.x,0.)).x;float B=texture2D(uPre,vUv-vec2(0.,uTexel.y)).x;float T=texture2D(uPre,vUv+vec2(0.,uTexel.y)).x;vec2 v=texture2D(uVel,vUv).xy-.5*vec2(R-L,T-B);gl_FragColor=vec4(v,0.,1.);}`,
  /* Rendered once per canvas size: R = long fibres, G = fine tooth, BA = wicking offset. */
  paper: `precision highp float;varying vec2 vUv;uniform float uAspect;${NOISE}void main(){vec2 p=vUv*vec2(uAspect,1.);float fib=fbm(p*vec2(7.,80.));float tooth=fbm(p*240.);vec2 w=vec2(fbm(p*vec2(3.,26.)+3.),fbm(p*vec2(3.,26.)+11.))-.5;gl_FragColor=vec4(fib,tooth,w);}`,
  /* The painting. Output is premultiplied alpha: only ink is drawn. */
  display: `precision highp float;varying vec2 vUv;uniform sampler2D uDye,uPaper;uniform vec3 uInk,uWash,uRed;uniform vec2 uTexel;uniform float uDither,uFade,uOpacity;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
void main(){
  vec4 pa=texture2D(uPaper,vUv);
  vec2 uv=vUv+pa.ba*uTexel*5.;
  vec2 d=texture2D(uDye,uv).rg;
  vec2 e=uTexel*2.;
  float kL=texture2D(uDye,uv-vec2(e.x,0.)).r,kR=texture2D(uDye,uv+vec2(e.x,0.)).r;
  float kB=texture2D(uDye,uv-vec2(0.,e.y)).r,kT=texture2D(uDye,uv+vec2(0.,e.y)).r;
  float edge=length(vec2(kR-kL,kT-kB));
  float gran=mix(.62,1.38,pa.g)*mix(.86,1.14,pa.r);
  float dens=d.r*gran+edge*1.3;
  float t=1.-exp(-dens*2.3);
  vec3 ink=mix(uWash,uInk,smoothstep(.12,.8,t));
  float a=t*.94;
  float r=1.-exp(-d.g*gran*2.8);
  vec3 col=uRed*r+ink*a*(1.-r);
  float alpha=r+a*(1.-r);
  // Keep the painting off the text column: fade out towards the left.
  float keep=smoothstep(uFade,uFade+.22,vUv.x+(pa.r-.5)*.08);
  col*=keep*uOpacity;alpha*=keep*uOpacity;
  alpha=clamp(alpha+(h(vUv*vec2(1441.,911.))-.5)*uDither*step(.004,alpha),0.,1.);
  gl_FragColor=vec4(col,alpha);
}`,
} as const;

type ProgramName = keyof typeof FRAGMENT;
type Rgb = [number, number, number];

interface Fbo {
  texture: WebGLTexture;
  framebuffer: WebGLFramebuffer;
  width: number;
  height: number;
  texel: [number, number];
  attach(unit: number): number;
}

interface DoubleFbo {
  readonly read: Fbo;
  readonly write: Fbo;
  swap(): void;
  texel: [number, number];
  width: number;
  height: number;
}

interface Program {
  handle: WebGLProgram;
  use(): void;
  uniform(name: string): WebGLUniformLocation | null;
}

interface Splat {
  x: number;
  y: number;
  dx: number;
  dy: number;
  /** sumi ink added */
  ink: number;
  /** vermilion added */
  red: number;
  /** size, 1 = default */
  size: number;
}

function parseCssColor(value: string, fallback: Rgb): Rgb {
  const match = value.match(/-?[\d.]+(e-?\d+)?/g);
  if (!match || match.length < 3) return fallback;
  const [r, g, b] = match.slice(0, 3).map(Number);
  // getComputedStyle returns rgb() in 0–255 for every browser we target.
  return [r / 255, g / 255, b / 255];
}

const random = (min: number, max: number) => min + Math.random() * (max - min);

/**
 * Where ink may appear, in canvas uv (y up). The portrait covers the middle
 * of the right half, so the painting lives in the space around it: the gap
 * next to the text, the right margin, and above and below the photo.
 */
const ZONES = [
  { x: [0.47, 0.57], y: [0.22, 0.86], weight: 3 },
  { x: [0.89, 0.99], y: [0.12, 0.9], weight: 3 },
  { x: [0.6, 0.95], y: [0.87, 0.97], weight: 1 },
  { x: [0.58, 0.92], y: [0.03, 0.13], weight: 1 },
] as const;
const TOTAL_WEIGHT = ZONES.reduce((n, z) => n + z.weight, 0);
function spot(): [number, number] {
  let pick = Math.random() * TOTAL_WEIGHT;
  const zone = ZONES.find((z) => (pick -= z.weight) < 0) ?? ZONES[0];
  return [random(zone.x[0], zone.x[1]), random(zone.y[0], zone.y[1])];
}
const SMALL_SCREEN = "(max-width: 1023px)";

class FluidInk extends HTMLElement {
  private frameHandle = 0;
  private startHandle = 0;
  private idle = false;
  private observers: { disconnect(): void }[] = [];
  private cleanups: (() => void)[] = [];
  private booted = false;
  private started = false;
  private paused = false;

  connectedCallback(): void {
    if (this.booted) return;
    this.booted = true;

    // Follow the site's motion toggle. Turning motion off hides the canvas
    // (CSS) and stops the frame loop; turning it on boots or resumes it.
    const onMotion = (event: Event) => {
      const on = (event as CustomEvent<string>).detail === "on";
      this.paused = !on;
      if (on && !this.started && !window.matchMedia(SMALL_SCREEN).matches) this.schedule();
    };
    window.addEventListener("motionchange", onMotion);
    this.cleanups.push(() => window.removeEventListener("motionchange", onMotion));

    // On phones the hero is one column of text, so the ink would sit right
    // behind it; the static wash is enough there, and it saves battery.
    if (window.matchMedia(SMALL_SCREEN).matches) return;

    if (document.documentElement.dataset.motion === "off") {
      this.paused = true;
      return;
    }
    this.schedule();
  }

  private schedule(): void {
    this.started = true;
    // Compiling the programs is main-thread work; wait until the page has
    // settled so it never competes with the first paint.
    const idle: typeof window.requestIdleCallback | undefined = window.requestIdleCallback;
    if (idle) {
      this.idle = true;
      this.startHandle = idle(() => this.boot(), { timeout: 1500 });
    } else {
      this.startHandle = window.setTimeout(() => this.boot(), 250);
    }
  }

  private boot(): void {
    if (!this.isConnected) return;

    const canvas = document.createElement("canvas");
    canvas.style.cssText = "width:100%;height:100%;display:block";

    const gl = canvas.getContext("webgl2", {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
    });
    if (!gl) return;

    this.appendChild(canvas);
    this.setAttribute("data-ink-active", "");
    gl.getExtension("EXT_color_buffer_float");

    // ---- palette -------------------------------------------------------
    const probe = document.createElement("span");
    probe.style.cssText = "position:absolute;width:0;height:0;visibility:hidden;pointer-events:none";
    this.appendChild(probe);
    const readColor = (property: string, fallback: Rgb): Rgb => {
      probe.style.color = "";
      probe.style.color = `var(${property})`;
      return parseCssColor(getComputedStyle(probe).color, fallback);
    };

    let ink: Rgb = [0.11, 0.1, 0.08];
    let wash: Rgb = [0.36, 0.42, 0.49];
    let red: Rgb = [0.72, 0.27, 0.18];
    let opacity = 1;
    const readPalette = () => {
      ink = readColor("--ink-pigment", ink);
      wash = readColor("--ink-wash", wash);
      red = readColor("--ink-red", red);
      // Pale ink on a dark page reads as smoke if it is as strong as black ink on paper.
      opacity = Number(getComputedStyle(this).getPropertyValue("--ink-opacity")) || 1;
    };
    readPalette();
    const themeObserver = new MutationObserver(readPalette);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    this.observers.push(themeObserver);

    // ---- gl plumbing ---------------------------------------------------
    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const compile = (source: string, type: number): WebGLShader => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };

    const link = (fragment: string): Program => {
      const program = gl.createProgram()!;
      gl.attachShader(program, compile(VERTEX, gl.VERTEX_SHADER));
      gl.attachShader(program, compile(fragment, gl.FRAGMENT_SHADER));
      gl.linkProgram(program);
      const position = gl.getAttribLocation(program, "aPos");
      const cache = new Map<string, WebGLUniformLocation | null>();
      return {
        handle: program,
        use() {
          gl.useProgram(program);
          gl.bindBuffer(gl.ARRAY_BUFFER, quad);
          gl.enableVertexAttribArray(position);
          gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
        },
        uniform(name) {
          if (!cache.has(name)) cache.set(name, gl.getUniformLocation(program, name));
          return cache.get(name) ?? null;
        },
      };
    };

    const programs = {} as Record<ProgramName, Program>;
    for (const name of Object.keys(FRAGMENT) as ProgramName[]) programs[name] = link(FRAGMENT[name]);

    // Where supported, the driver compiles in the background and we poll.
    const parallel = gl.getExtension("KHR_parallel_shader_compile");
    const compiling = Object.values(programs);
    let compiled = !parallel;
    const programsReady = () =>
      compiling.every((program) => gl.getProgramParameter(program.handle, parallel!.COMPLETION_STATUS_KHR));

    const createFbo = (width: number, height: number): Fbo => {
      const texture = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, width, height, 0, gl.RGBA, gl.HALF_FLOAT, null);
      const framebuffer = gl.createFramebuffer()!;
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      return {
        texture,
        framebuffer,
        width,
        height,
        texel: [1 / width, 1 / height],
        attach(unit) {
          gl.activeTexture(gl.TEXTURE0 + unit);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          return unit;
        },
      };
    };

    const createDoubleFbo = (width: number, height: number): DoubleFbo => {
      let front = createFbo(width, height);
      let back = createFbo(width, height);
      return {
        get read() {
          return front;
        },
        get write() {
          return back;
        },
        swap() {
          [front, back] = [back, front];
        },
        texel: [1 / width, 1 / height],
        width,
        height,
      };
    };

    let velocity: DoubleFbo;
    let dye: DoubleFbo;
    let divergence: Fbo;
    let curl: Fbo;
    let pressure: DoubleFbo;
    let paper: Fbo | null = null;
    let aspect = 1;

    // The solve runs at a fixed resolution; fluid is low frequency.
    const initSimulation = (ratio: number) => {
      const velocityRows = 160;
      const dyeRows = 640;
      velocity = createDoubleFbo(Math.round(velocityRows * ratio), velocityRows);
      dye = createDoubleFbo(Math.round(dyeRows * ratio), dyeRows);
      divergence = createFbo(velocity.width, velocity.height);
      curl = createFbo(velocity.width, velocity.height);
      pressure = createDoubleFbo(velocity.width, velocity.height);
    };

    const blit = (target: Fbo | null) => {
      if (target) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, target.framebuffer);
        gl.viewport(0, 0, target.width, target.height);
      } else {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const renderPaper = () => {
      paper = createFbo(canvas.width, canvas.height);
      programs.paper.use();
      gl.uniform1f(programs.paper.uniform("uAspect"), aspect);
      blit(paper);
    };

    // ---- splats --------------------------------------------------------
    const strength = Number(this.dataset.strength ?? "1") || 1;
    const autoFlow = this.dataset.auto !== "0";
    // Fraction of the width, from the left, that is kept free of ink.
    const fadeLeft = Number(this.dataset.clear ?? "0.4");
    const queue: Splat[] = [];
    // Splats scheduled for later, so a brush stroke is laid down over time.
    const pending: { at: number; splat: Splat }[] = [];
    let elapsed = 0;

    const splat = (s: Partial<Splat> & { x: number; y: number }, delay = 0) => {
      const full: Splat = { dx: 0, dy: 0, ink: 0, red: 0, size: 1, ...s };
      if (delay <= 0) queue.push(full);
      else pending.push({ at: elapsed + delay, splat: full });
    };

    const applySplat = (s: Splat) => {
      const program = programs.splat;
      program.use();
      gl.uniform1f(program.uniform("uAspect"), aspect);
      gl.uniform2f(program.uniform("uPoint"), s.x, s.y);
      gl.uniform1i(program.uniform("uTarget"), velocity.read.attach(0));
      gl.uniform1f(program.uniform("uRadius"), 0.002 * s.size);
      gl.uniform3f(program.uniform("uColor"), s.dx, s.dy, 0);
      blit(velocity.write);
      velocity.swap();

      if (s.ink > 0 || s.red > 0) {
        gl.uniform1i(program.uniform("uTarget"), dye.read.attach(0));
        gl.uniform1f(program.uniform("uRadius"), 0.0012 * s.size);
        gl.uniform3f(program.uniform("uColor"), s.ink * strength, s.red * strength, 0);
        blit(dye.write);
        dye.swap();
      }
    };

    /** A drop of ink landing in water: a dense core that blooms outwards. */
    const drop = (x: number, y: number, amount: number, vermilion = false, delay = 0) => {
      // Vermilion is used sparingly and stays small, like a seal on a painting.
      const core = vermilion ? { red: amount * 0.7, ink: amount * 0.03 } : { ink: amount * 0.8 };
      splat({ x, y, size: vermilion ? 0.8 : 1.5, ...core }, delay);
      const spokes = 6;
      const turn = random(0, Math.PI * 2);
      for (let i = 0; i < spokes; i++) {
        const a = turn + (i / spokes) * Math.PI * 2;
        // Uneven spokes, so the bloom is never a perfect circle.
        const v = random(30, 110);
        const r = random(0.006, 0.016);
        splat({ x: x + Math.cos(a) * r, y: y + Math.sin(a) * r, dx: Math.cos(a) * v * (vermilion ? 0.4 : 1), dy: Math.sin(a) * v * (vermilion ? 0.4 : 1), size: random(0.5, 0.9), ...(vermilion ? {} : { ink: amount * random(0.03, 0.09) }) }, delay + 30);
      }
    };

    /**
     * A tapered brush stroke: pressure rises, holds and lifts off, and the
     * path bends a little, so it reads as a hand, not a line.
     */
    const stroke = (x: number, y: number, angle: number, length: number, amount: number, delay = 0) => {
      const steps = 26;
      let a = angle;
      const bend = random(-0.9, 0.9) / steps;
      let px = x;
      let py = y;
      for (let i = 0; i < steps; i++) {
        const t = i / (steps - 1);
        const pressure = Math.pow(Math.sin(Math.PI * Math.min(1, t * 1.15)), 0.7) * (1 - 0.45 * t);
        a += bend;
        const step = length / steps;
        px += (Math.cos(a) * step) / aspect;
        py += Math.sin(a) * step;
        // Dry brush: the stroke breaks up a little towards the end.
        const dry = t > 0.7 && Math.random() < (t - 0.7) * 1.6 ? 0.25 : 1;
        splat(
          { x: px, y: py, dx: Math.cos(a) * 170 * pressure, dy: Math.sin(a) * 170 * pressure, ink: amount * 0.5 * pressure * dry, size: 0.22 + pressure * 0.45 },
          delay + i * 24,
        );
      }
    };

    // Opening composition: a long vertical stroke down the right margin,
    // like the edge of a hanging scroll, a bloom in the gap beside the text,
    // a lighter one below the photo, and one vermilion drop, like a seal.
    const opening = () => {
      stroke(0.94, 0.92, -Math.PI / 2 - 0.08, 0.8, 1, 150);
      drop(0.52, 0.62, 0.9, false, 900);
      drop(0.74, 0.08, 0.5, false, 1400);
      drop(0.9, 0.93, 0.6, true, 2000);
    };

    // ---- input ---------------------------------------------------------
    if (window.matchMedia("(pointer: fine)").matches) {
      let last: { x: number; y: number } | null = null;
      const toUv = (event: PointerEvent) => {
        const rect = this.getBoundingClientRect();
        return { x: (event.clientX - rect.left) / rect.width, y: 1 - (event.clientY - rect.top) / rect.height };
      };
      const onPointerMove = (event: PointerEvent) => {
        const { x, y } = toUv(event);
        if (last) {
          const dx = (x - last.x) * 900;
          const dy = (y - last.y) * 900;
          const speed = Math.min(1, Math.hypot(dx, dy) / 60);
          // Moving the cursor stirs the water and leaves only a faint trail.
          if (speed > 0.01) splat({ x, y, dx, dy, ink: speed * 0.06, size: 0.7 });
        }
        last = { x, y };
      };
      const onPointerLeave = () => {
        last = null;
      };
      let clicks = 0;
      const onPointerDown = (event: PointerEvent) => {
        const target = event.target as Element | null;
        if (target?.closest("a, button, img, h1, p, dl")) return;
        const { x, y } = toUv(event);
        clicks += 1;
        drop(x, y, 0.9, clicks % 4 === 0);
      };
      const host = this.parentElement ?? this;
      host.addEventListener("pointermove", onPointerMove);
      host.addEventListener("pointerleave", onPointerLeave);
      host.addEventListener("pointerdown", onPointerDown);
      this.cleanups.push(() => {
        host.removeEventListener("pointermove", onPointerMove);
        host.removeEventListener("pointerleave", onPointerLeave);
        host.removeEventListener("pointerdown", onPointerDown);
      });
    }

    // ---- frame loop ----------------------------------------------------
    let visible = true;
    const visibility = new IntersectionObserver((entries) => {
      visible = entries[0]?.isIntersecting ?? false;
    });
    visibility.observe(this);
    this.observers.push(visibility);

    const resize = (): boolean => {
      const rect = this.getBoundingClientRect();
      if (!rect.width || !rect.height) return false;
      // Capping the pixel ratio is the single biggest win on laptops.
      const dpr = Math.min(1.5, window.devicePixelRatio || 1);
      const width = Math.round(rect.width * dpr);
      const height = Math.round(rect.height * dpr);
      aspect = rect.width / rect.height;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        if (!velocity) initSimulation(Math.max(0.4, Math.min(3.2, aspect)));
        renderPaper();
      }
      return true;
    };

    let openingDone = false;
    let nextDrop = 2600;
    let nextStroke = 5200;
    let lastFrame = performance.now();
    let started = lastFrame;

    const frame = (now: number) => {
      this.frameHandle = requestAnimationFrame(frame);

      if (!compiled) {
        if (!programsReady()) {
          lastFrame = now;
          return;
        }
        compiled = true;
        started = now;
      }

      if (this.paused || !resize() || !visible) {
        lastFrame = now;
        return;
      }

      const dt = Math.min(0.033, (now - lastFrame) / 1000);
      lastFrame = now;
      elapsed = now - started;

      if (!openingDone) {
        openingDone = true;
        opening();
      }

      if (autoFlow) {
        // Keep the painting on the right, around the portrait, so the text
        // on the left stays easy to read.
        if (elapsed > nextDrop) {
          nextDrop = elapsed + random(2400, 4200);
          const [x, y] = spot();
          drop(x, y, random(0.4, 0.8), Math.random() < 0.08);
        }
        if (elapsed > nextStroke) {
          nextStroke = elapsed + random(6500, 10000);
          // Either a vertical stroke down one of the side gaps, or a
          // horizontal sweep under the photo.
          if (Math.random() < 0.65) {
            const right = Math.random() < 0.5;
            stroke(right ? random(0.9, 0.97) : random(0.49, 0.55), random(0.75, 0.9), -Math.PI / 2 + random(-0.15, 0.15), random(0.4, 0.65), random(0.7, 1));
          } else {
            stroke(random(0.58, 0.66), random(0.06, 0.12), random(-0.1, 0.12), random(0.5, 0.75), random(0.6, 0.9));
          }
        }
      }

      for (let i = pending.length - 1; i >= 0; i--) {
        if (pending[i].at <= elapsed) {
          queue.push(pending[i].splat);
          pending.splice(i, 1);
        }
      }
      while (queue.length) applySplat(queue.shift()!);

      // Vorticity confinement: a coarse grid bleeds angular momentum.
      programs.curl.use();
      gl.uniform2f(programs.curl.uniform("uTexel"), velocity.texel[0], velocity.texel[1]);
      gl.uniform1i(programs.curl.uniform("uVel"), velocity.read.attach(0));
      blit(curl);

      programs.vorticity.use();
      gl.uniform2f(programs.vorticity.uniform("uTexel"), velocity.texel[0], velocity.texel[1]);
      gl.uniform1i(programs.vorticity.uniform("uVel"), velocity.read.attach(0));
      gl.uniform1i(programs.vorticity.uniform("uCurl"), curl.attach(1));
      gl.uniform1f(programs.vorticity.uniform("uDt"), dt);
      gl.uniform1f(programs.vorticity.uniform("uEps"), 18);
      blit(velocity.write);
      velocity.swap();

      programs.divergence.use();
      gl.uniform2f(programs.divergence.uniform("uTexel"), velocity.texel[0], velocity.texel[1]);
      gl.uniform1i(programs.divergence.uniform("uVel"), velocity.read.attach(0));
      blit(divergence);

      programs.pressure.use();
      gl.uniform2f(programs.pressure.uniform("uTexel"), velocity.texel[0], velocity.texel[1]);
      gl.uniform1i(programs.pressure.uniform("uDiv"), divergence.attach(1));
      for (let i = 0; i < 22; i++) {
        gl.uniform1i(programs.pressure.uniform("uPre"), pressure.read.attach(0));
        blit(pressure.write);
        pressure.swap();
      }

      programs.gradient.use();
      gl.uniform2f(programs.gradient.uniform("uTexel"), velocity.texel[0], velocity.texel[1]);
      gl.uniform1i(programs.gradient.uniform("uPre"), pressure.read.attach(0));
      gl.uniform1i(programs.gradient.uniform("uVel"), velocity.read.attach(1));
      blit(velocity.write);
      velocity.swap();

      programs.advect.use();
      gl.uniform2f(programs.advect.uniform("uTexel"), velocity.texel[0], velocity.texel[1]);
      gl.uniform1f(programs.advect.uniform("uDt"), dt * 60);
      // Water slows down quickly, so ink settles instead of swirling forever.
      // Dissipation is per 1/60 s, so the look does not depend on frame rate.
      gl.uniform1f(programs.advect.uniform("uDiss"), Math.pow(0.985, dt * 60));
      gl.uniform1i(programs.advect.uniform("uVel"), velocity.read.attach(0));
      gl.uniform1i(programs.advect.uniform("uSrc"), velocity.read.attach(0));
      blit(velocity.write);
      velocity.swap();

      // Ink fades slowly, like a wash drying into the paper.
      gl.uniform1f(programs.advect.uniform("uDiss"), Math.pow(0.997, dt * 60));
      gl.uniform1i(programs.advect.uniform("uVel"), velocity.read.attach(0));
      gl.uniform1i(programs.advect.uniform("uSrc"), dye.read.attach(1));
      blit(dye.write);
      dye.swap();

      programs.display.use();
      gl.uniform1i(programs.display.uniform("uDye"), dye.read.attach(0));
      gl.uniform1i(programs.display.uniform("uPaper"), paper!.attach(1));
      gl.uniform2f(programs.display.uniform("uTexel"), dye.texel[0], dye.texel[1]);
      gl.uniform3f(programs.display.uniform("uInk"), ink[0], ink[1], ink[2]);
      gl.uniform3f(programs.display.uniform("uWash"), wash[0], wash[1], wash[2]);
      gl.uniform3f(programs.display.uniform("uRed"), red[0], red[1], red[2]);
      gl.uniform1f(programs.display.uniform("uDither"), 1 / 255);
      gl.uniform1f(programs.display.uniform("uFade"), fadeLeft);
      gl.uniform1f(programs.display.uniform("uOpacity"), opacity);
      gl.clearColor(0, 0, 0, 0);
      blit(null);
    };

    this.frameHandle = requestAnimationFrame(frame);
  }

  disconnectedCallback(): void {
    cancelAnimationFrame(this.frameHandle);
    if (this.startHandle) {
      if (this.idle) cancelIdleCallback(this.startHandle);
      else clearTimeout(this.startHandle);
      this.startHandle = 0;
    }
    for (const observer of this.observers) observer.disconnect();
    for (const cleanup of this.cleanups) cleanup();
    this.observers = [];
    this.cleanups = [];
    this.booted = false;
  }
}

if (!customElements.get("fluid-ink")) {
  customElements.define("fluid-ink", FluidInk);
}
