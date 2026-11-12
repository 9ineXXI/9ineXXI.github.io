(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  (() => {
    const $ = (id) => document.getElementById(id);
    const DEF = {
      cols: 140,
      dot: 74,
      shape: "round",
      tint: "#2f5bff",
      tintAmt: 100,
      punch: 60,
      bloom: 55,
      star: true,
      hud: false,
      drip: true,
      scan: true,
      sig: true,
      sigText: "\u661F\u6838 STAR CORE",
      ratio: "0.75",
      size: "1440",
      sx: 0.5,
      sy: 0.4
    };
    let P = __spreadValues({}, DEF);
    const SKEY = "starcore-led";
    const mt = () => window.xhs && window.xhs.miniTool || null;
    function clientVer() {
      try {
        const lo = window.xhs && window.xhs.launchOptions;
        const v = lo && lo.miniToolEnv && lo.miniToolEnv.buildVersion;
        return v ? Math.floor(+v / 1e3) : 0;
      } catch (_) {
        return 0;
      }
    }
    const canStore = () => {
      const m = mt();
      return !!(m && typeof m.setStorage === "function" && typeof m.getStorage === "function" && clientVer() >= 9460);
    };
    function applySaved(raw) {
      try {
        const s = typeof raw === "string" ? JSON.parse(raw) : raw;
        if (!s || typeof s !== "object") return;
        for (const k of Object.keys(DEF)) if (k !== "sx" && k !== "sy" && k in s) P[k] = s[k];
        if (!["1080", "1440", "2048"].includes(String(P.size))) P.size = DEF.size;
      } catch (_) {
      }
    }
    try {
      applySaved(localStorage.getItem(SKEY));
    } catch (_) {
    }
    let saveT = 0;
    const persist = () => {
      clearTimeout(saveT);
      saveT = setTimeout(() => {
        const k = {};
        for (const key of Object.keys(DEF)) if (key !== "sx" && key !== "sy") k[key] = P[key];
        const str = JSON.stringify(k);
        try {
          localStorage.setItem(SKEY, str);
        } catch (_) {
        }
        if (canStore()) {
          try {
            const r = mt().setStorage({ key: SKEY, data: str });
            if (r && r.catch) r.catch(() => {
            });
          } catch (_) {
          }
        }
      }, 400);
    };
    async function loadStored() {
      if (!canStore()) return;
      try {
        const r = await mt().getStorage({ key: SKEY });
        if (r && r.data) {
          applySaved(r.data);
          syncUI();
          queue();
        }
      } catch (_) {
      }
    }
    let SRC = null, srcLabel = "\u793A\u4F8B \xB7 \u661F\u95E8", baseName = "starcore", autoStar = true, split = 0.7;
    const led = $("led"), orig = $("orig"), frame = $("frame"), stage = $("stage");
    function sample() {
      const W = 1200, H = 1500, c = document.createElement("canvas");
      c.width = W;
      c.height = H;
      const x = c.getContext("2d");
      let g = x.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, "#02030c");
      g.addColorStop(0.55, "#0a1450");
      g.addColorStop(1, "#03040a");
      x.fillStyle = g;
      x.fillRect(0, 0, W, H);
      let s = 7;
      const r = () => (s = s * 16807 % 2147483647) / 2147483647;
      for (let i = 0; i < 900; i++) {
        const a = r();
        x.fillStyle = `rgba(200,220,255,${a * 0.9})`;
        const z = a > 0.97 ? 3 : 1.4;
        x.fillRect(r() * W, r() * H * 0.75, z, z);
      }
      g = x.createRadialGradient(600, 560, 0, 600, 560, 620);
      g.addColorStop(0, "rgba(110,150,255,.75)");
      g.addColorStop(0.35, "rgba(40,70,255,.35)");
      g.addColorStop(1, "rgba(20,30,120,0)");
      x.fillStyle = g;
      x.fillRect(0, 0, W, H);
      x.save();
      x.translate(600, 640);
      x.strokeStyle = "rgba(220,235,255,.95)";
      x.lineWidth = 26;
      x.shadowColor = "#5b84ff";
      x.shadowBlur = 60;
      x.beginPath();
      x.moveTo(-230, 420);
      x.lineTo(-230, -60);
      x.arc(0, -60, 230, Math.PI, 0);
      x.lineTo(230, 420);
      x.stroke();
      x.lineWidth = 6;
      x.beginPath();
      x.moveTo(-170, 420);
      x.lineTo(-170, -60);
      x.arc(0, -60, 170, Math.PI, 0);
      x.lineTo(170, 420);
      x.stroke();
      x.restore();
      g = x.createRadialGradient(600, 560, 0, 600, 560, 90);
      g.addColorStop(0, "#ffffff");
      g.addColorStop(0.3, "rgba(180,215,255,.9)");
      g.addColorStop(1, "rgba(60,100,255,0)");
      x.fillStyle = g;
      x.beginPath();
      x.arc(600, 560, 90, 0, 7);
      x.fill();
      for (let i = 0; i < 9; i++) {
        const y = 1060 + i * 48, w = 300 + i * 70;
        x.fillStyle = `rgb(${20 + i * 4},${30 + i * 6},${90 + i * 10})`;
        x.fillRect(600 - w / 2, y, w, 48);
        x.fillStyle = "rgba(170,200,255,.6)";
        x.fillRect(600 - w / 2, y, w, 3);
      }
      x.fillStyle = "#04061a";
      x.beginPath();
      x.moveTo(0, 1180);
      for (let i = 0; i <= 12; i++) x.lineTo(i * 100, 1120 - Math.abs(Math.sin(i * 1.7)) * 160 + (i > 3 && i < 9 ? 140 : 0));
      x.lineTo(1200, 1500);
      x.lineTo(0, 1500);
      x.fill();
      x.fillStyle = "#020309";
      x.beginPath();
      x.ellipse(600, 1e3, 20, 24, 0, 0, 7);
      x.fill();
      x.fillRect(582, 1018, 36, 52);
      return c;
    }
    function cropFor(iw, ih) {
      const R = +P.ratio || iw / ih;
      let sw = iw, sh = iw / R;
      if (sh > ih) {
        sh = ih;
        sw = ih * R;
      }
      return { sx: (iw - sw) / 2, sy: (ih - sh) / 2, sw, sh, R };
    }
    function outSize(R) {
      const L = +P.size;
      return R >= 1 ? [L, Math.round(L / R)] : [Math.round(L * R), L];
    }
    const rng = (seed) => () => (seed = seed * 16807 % 2147483647) / 2147483647;
    const tiles = /* @__PURE__ */ new Map();
    function dotTile(cell, shape, size) {
      const key = cell + shape + size;
      if (tiles.has(key)) return tiles.get(key);
      const t = document.createElement("canvas");
      t.width = t.height = cell;
      const c = t.getContext("2d"), m = cell / 2, f = size / 100;
      if (shape === "square") {
        const s = Math.max(1, Math.round(cell * f)), o = (cell - s) / 2;
        c.fillStyle = "#fff";
        c.fillRect(o, o, s, s);
      } else {
        const g = c.createRadialGradient(m, m, 0, m, m, m * f * 1.18);
        g.addColorStop(0, "#fff");
        g.addColorStop(0.62, "#fff");
        g.addColorStop(0.8, "rgba(255,255,255,.3)");
        g.addColorStop(1, "rgba(255,255,255,0)");
        c.fillStyle = g;
        c.fillRect(0, 0, cell, cell);
      }
      tiles.set(key, t);
      return t;
    }
    const hexA = (hex, a) => {
      const n = parseInt(hex.slice(1), 16);
      return `rgba(${n >> 16},${n >> 8 & 255},${n & 255},${a})`;
    };
    function brightest(sm) {
      try {
        const d = sm.getContext("2d").getImageData(0, 0, sm.width, sm.height).data;
        let best = -1, bi = 0;
        for (let i = 0; i < d.length; i += 4) {
          const l = d[i] * 0.3 + d[i + 1] * 0.59 + d[i + 2] * 0.11;
          if (l > best) {
            best = l;
            bi = i / 4;
          }
        }
        return [(bi % sm.width + 0.5) / sm.width, (Math.floor(bi / sm.width) + 0.5) / sm.height];
      } catch (_) {
        return [0.5, 0.4];
      }
    }
    function sparkle(c, x, y, s, a, tint) {
      const g = c.createRadialGradient(x, y, 0, x, y, s * 2.4);
      g.addColorStop(0, `rgba(245,250,255,${a})`);
      g.addColorStop(0.22, `rgba(190,220,255,${a * 0.6})`);
      g.addColorStop(1, hexA(tint, 0));
      c.fillStyle = g;
      c.beginPath();
      c.arc(x, y, s * 2.4, 0, 6.283);
      c.fill();
      c.fillStyle = `rgba(236,246,255,${a})`;
      const t = Math.max(1, s * 0.09);
      c.fillRect(x - s * 3.6, y - t / 2, s * 7.2, t);
      c.fillRect(x - t / 2, y - s * 3.6, t, s * 7.2);
    }
    function render(src, W, H, crop) {
      const accent = P.tint === "none" ? "#2f5bff" : P.tint;
      const cell = Math.max(2, Math.round(Math.max(W, H) / P.cols));
      const cols = Math.ceil(W / cell), rows = Math.ceil(H / cell);
      const mid = document.createElement("canvas");
      mid.width = cols * 4;
      mid.height = rows * 4;
      const mx = mid.getContext("2d");
      mx.imageSmoothingQuality = "high";
      mx.fillStyle = "#000";
      mx.fillRect(0, 0, mid.width, mid.height);
      mx.drawImage(src, crop.sx, crop.sy, crop.sw, crop.sh, 0, 0, W / cell * 4, H / cell * 4);
      const sm = document.createElement("canvas");
      sm.width = cols;
      sm.height = rows;
      const sx = sm.getContext("2d", { willReadFrequently: true });
      sx.imageSmoothingQuality = "high";
      sx.drawImage(mid, 0, 0, cols, rows);
      const k = P.punch / 100;
      if (k > 0) {
        sx.globalAlpha = k;
        sx.globalCompositeOperation = "multiply";
        sx.drawImage(sm, 0, 0);
        sx.globalAlpha = 0.6 * k;
        sx.globalCompositeOperation = "lighter";
        sx.drawImage(sm, 0, 0);
      }
      if (P.tint !== "none" && P.tintAmt > 0) {
        sx.globalAlpha = P.tintAmt / 100;
        sx.globalCompositeOperation = "color";
        sx.fillStyle = P.tint;
        sx.fillRect(0, 0, cols, rows);
      }
      sx.globalAlpha = 1;
      sx.globalCompositeOperation = "source-over";
      const star = autoStar ? brightest(sm) : [P.sx, P.sy];
      if (autoStar) {
        P.sx = star[0];
        P.sy = star[1];
      }
      const lay = document.createElement("canvas");
      lay.width = W;
      lay.height = H;
      const lx = lay.getContext("2d");
      lx.imageSmoothingEnabled = false;
      lx.drawImage(sm, 0, 0, cols * cell, rows * cell);
      lx.globalCompositeOperation = "destination-in";
      lx.fillStyle = lx.createPattern(dotTile(cell, P.shape, P.dot), "repeat");
      lx.fillRect(0, 0, W, H);
      const out = document.createElement("canvas");
      out.width = W;
      out.height = H;
      const o = out.getContext("2d");
      o.fillStyle = "#03040a";
      o.fillRect(0, 0, W, H);
      const b = P.bloom / 100;
      if (b > 0) {
        o.imageSmoothingEnabled = true;
        o.globalAlpha = 0.45 * b;
        o.drawImage(sm, 0, 0, cols * cell, rows * cell);
        if ("filter" in o) {
          o.filter = `blur(${Math.round(cell * 1.6)}px)`;
          o.globalCompositeOperation = "lighter";
          o.globalAlpha = 0.7 * b;
          o.drawImage(lay, 0, 0);
          o.filter = "none";
        }
        o.globalAlpha = 1;
        o.globalCompositeOperation = "source-over";
      }
      o.globalCompositeOperation = "lighter";
      o.drawImage(lay, 0, 0);
      o.globalCompositeOperation = "source-over";
      const u = Math.max(W, H) / 1e3;
      if (P.drip) {
        const r = rng(1234567);
        o.globalAlpha = 0.85;
        for (let i = 0; i < 46; i++) {
          const dx = r(), dw = 4e-3 + r() * 0.012, y0 = 0.45 + r() * 0.43, len = (0.03 + r() * 0.11) * (0.35 + 0.65 * r());
          const x = Math.floor(dx * W / cell) * cell, wd = Math.min(W - x, Math.max(cell, Math.round(dw * W / cell) * cell));
          const y = Math.floor(y0 * H / cell) * cell + (cell >> 1) - 1;
          if (wd > 0) o.drawImage(out, x, y, wd, 2, x, y, wd, len * H);
        }
        o.globalAlpha = 1;
      }
      if (P.scan) {
        o.fillStyle = "rgba(3,4,10,.16)";
        const step = Math.max(3, Math.round(3 * u));
        for (let y = 0; y < H; y += step) o.fillRect(0, y, W, Math.max(1, Math.round(u)));
      }
      if (P.hud) {
        const cx = W / 2, cy = H / 2, R = Math.min(W, H) * 0.42, lw = Math.max(1, u * 1.1);
        o.fillStyle = "rgba(120,170,255,.2)";
        for (let y = 0; y < H; y += 6 * u) o.fillRect(cx - lw / 2, y, lw, 2.5 * u);
        for (let x = 0; x < W; x += 6 * u) o.fillRect(x, cy - lw / 2, 2.5 * u, lw);
        o.save();
        o.translate(cx, cy);
        o.lineWidth = lw;
        o.strokeStyle = "rgba(160,200,255,.55)";
        o.setLineDash([1.5 * u, 4.5 * u]);
        o.beginPath();
        o.arc(0, 0, R, 0, 6.283);
        o.stroke();
        o.setLineDash([]);
        for (let i = 0; i < 72; i++) {
          const a = i / 72 * 6.283, lg = i % 9 === 0, l = lg ? R * 0.05 : R * 0.02;
          o.strokeStyle = lg ? "rgba(170,215,255,.75)" : "rgba(120,160,255,.38)";
          o.beginPath();
          o.moveTo(Math.cos(a) * (R + 4 * u), Math.sin(a) * (R + 4 * u));
          o.lineTo(Math.cos(a) * (R + 4 * u + l), Math.sin(a) * (R + 4 * u + l));
          o.stroke();
        }
        o.restore();
        o.globalCompositeOperation = "lighter";
        [[0, -1], [1, 0], [0, 1], [-1, 0]].forEach(([dx, dy]) => sparkle(o, cx + dx * R, cy + dy * R, R * 0.018, 0.8, accent));
        o.globalCompositeOperation = "source-over";
      }
      if (P.star) {
        const px = star[0] * W, py = star[1] * H, R = Math.min(W, H) * 0.42;
        o.globalCompositeOperation = "lighter";
        const g = o.createRadialGradient(px, py, 0, px, py, R * 0.38);
        g.addColorStop(0, hexA(accent, 0.4));
        g.addColorStop(1, hexA(accent, 0));
        o.fillStyle = g;
        o.beginPath();
        o.arc(px, py, R * 0.38, 0, 6.283);
        o.fill();
        sparkle(o, px, py, R * 0.036, 1, accent);
        o.globalCompositeOperation = "source-over";
      }
      if (P.sig) {
        const pad = Math.round(Math.min(W, H) * 0.045), fs = Math.max(11, Math.round(Math.min(W, H) * 0.028));
        const fg = o.createLinearGradient(0, H - pad * 3.4, 0, H);
        fg.addColorStop(0, "rgba(3,4,10,0)");
        fg.addColorStop(1, "rgba(3,4,10,.7)");
        o.fillStyle = fg;
        o.fillRect(0, H - pad * 3.4, W, pad * 3.4);
        const cm = pad * 0.6, ln = pad * 0.7, lw = Math.max(1, Math.round(u * 1.2));
        o.fillStyle = "rgba(160,205,255,.75)";
        [[cm, cm, 1, 1], [W - cm, cm, -1, 1], [cm, H - cm, 1, -1], [W - cm, H - cm, -1, -1]].forEach(([x2, y, sx2, sy2]) => {
          o.fillRect(sx2 > 0 ? x2 : x2 - ln, sy2 > 0 ? y : y - lw, ln, lw);
          o.fillRect(sx2 > 0 ? x2 : x2 - lw, sy2 > 0 ? y : y - ln, lw, ln);
        });
        const by = H - pad * 1.25;
        o.fillStyle = "#d8eaff";
        o.shadowColor = accent;
        o.shadowBlur = fs * 0.6;
        const sk = fs * 0.9, sx3 = pad * 1.15 + sk / 2, sy3 = by - fs * 0.34;
        o.fillRect(sx3 - sk / 2, sy3 - lw / 2 - 0.5, sk, lw + 1);
        o.fillRect(sx3 - lw / 2 - 0.5, sy3 - sk / 2, lw + 1, sk);
        o.shadowBlur = fs * 0.8;
        o.textBaseline = "alphabetic";
        o.font = `600 ${fs}px "StarCore Serif", "Songti SC", "Noto Serif CJK SC", serif`;
        const txt = (P.sigText || "").trim();
        const m = /^(\S+)\s+(.+)$/.exec(txt), cn = m ? m[1] : txt, rest = m ? m[2] : "";
        let x = pad * 1.15 + sk + fs * 0.55;
        o.fillStyle = "#eaf3ff";
        if ("letterSpacing" in o) o.letterSpacing = `${fs * 0.2}px`;
        o.fillText(cn, x, by);
        x += o.measureText(cn).width + fs * 0.5;
        if (rest) {
          o.font = `400 ${Math.round(fs * 0.55)}px "Silkscreen", "Share Tech Mono", monospace`;
          if ("letterSpacing" in o) o.letterSpacing = `${fs * 0.14}px`;
          o.fillStyle = "#9fd3f7";
          o.fillText(rest, x, by - fs * 0.12);
        }
        o.shadowBlur = 0;
        o.font = `400 ${Math.round(fs * 0.5)}px "Share Tech Mono", monospace`;
        if ("letterSpacing" in o) o.letterSpacing = `${fs * 0.1}px`;
        o.fillStyle = "rgba(142,166,218,.85)";
        o.textAlign = "right";
        o.fillText(`LED ${cols}\xD7${rows}`, W - pad * 1.15, by - fs * 0.1);
        o.textAlign = "left";
        if ("letterSpacing" in o) o.letterSpacing = "0px";
      }
      return { canvas: out, cols, rows };
    }
    let raf = 0, last = null;
    function fit(R) {
      const cs = getComputedStyle(stage);
      const aw = stage.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const ah = Math.max(160, stage.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom));
      let w = aw, h = w / R;
      if (h > ah) {
        h = ah;
        w = h * R;
      }
      frame.style.width = `${Math.floor(w)}px`;
      frame.style.height = `${Math.floor(h)}px`;
    }
    function paint() {
      raf = 0;
      if (!SRC) return;
      $("busy").hidden = false;
      setTimeout(() => {
        const crop = cropFor(SRC.width, SRC.height);
        const [W, H] = outSize(crop.R);
        fit(crop.R);
        const r = render(SRC, W, H, crop);
        last = r;
        led.width = W;
        led.height = H;
        led.getContext("2d").drawImage(r.canvas, 0, 0);
        orig.width = Math.min(W, 1600);
        orig.height = Math.round(orig.width * H / W);
        const ox = orig.getContext("2d");
        ox.imageSmoothingQuality = "high";
        ox.drawImage(SRC, crop.sx, crop.sy, crop.sw, crop.sh, 0, 0, orig.width, orig.height);
        $("gridInfo").textContent = `\u50CF\u7D20 ${r.cols}\xD7${r.rows} \xB7 ${W}\xD7${H}`;
        $("busy").hidden = true;
        setSplit(split);
      }, 0);
    }
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    function setSplit(v) {
      split = Math.min(1, Math.max(0, v));
      led.style.clipPath = `inset(0 ${(1 - split) * 100}% 0 0)`;
      $("seam").style.left = $("knob").style.left = `${split * 100}%`;
      $("knob").setAttribute("aria-valuenow", String(Math.round(split * 100)));
    }
    const ranges = ["cols", "dot", "tintAmt", "punch", "bloom"];
    const fmt = { cols: (v) => v, dot: (v) => v + "%", tintAmt: (v) => v + "%", punch: (v) => v + "%", bloom: (v) => v + "%" };
    function syncUI() {
      for (const k of ranges) {
        const el = $(k);
        el.value = P[k];
        $("o_" + k).textContent = fmt[k](P[k]);
        el.style.setProperty("--p", `${(P[k] - el.min) / (el.max - el.min) * 100}%`);
      }
      document.querySelectorAll(".chip[data-k]").forEach((c) => c.setAttribute("aria-pressed", String(String(P[c.dataset.k]) === c.dataset.v)));
      $("tintAmt").disabled = P.tint === "none";
      for (const k of ["star", "hud", "drip", "scan", "sig"]) $(k).checked = !!P[k];
      $("sigText").value = P.sigText;
      $("sigText").hidden = !P.sig;
    }
    const set = (k, v) => {
      P[k] = v;
      syncUI();
      persist();
      queue();
    };
    for (const k of ranges) $(k).addEventListener("input", (e) => set(k, +e.target.value));
    document.querySelectorAll(".chip[data-k]").forEach((c) => c.addEventListener("click", () => set(c.dataset.k, c.dataset.v)));
    for (const k of ["star", "hud", "drip", "scan", "sig"]) $(k).addEventListener("change", (e) => set(k, e.target.checked));
    $("sigText").addEventListener("input", (e) => set("sigText", e.target.value));
    $("resetBtn").addEventListener("click", () => {
      P = __spreadValues({}, DEF);
      autoStar = true;
      syncUI();
      persist();
      queue();
      toast("\u5DF2\u6062\u590D\u9ED8\u8BA4\u53C2\u6570");
    });
    const knob = $("knob");
    let drag = null;
    frame.addEventListener("pointerdown", (e) => {
      const onKnob = knob.contains(e.target);
      drag = { id: e.pointerId, x: e.clientX, y: e.clientY, knob: onKnob };
      try {
        frame.setPointerCapture(e.pointerId);
      } catch (_) {
      }
      e.preventDefault();
    });
    frame.addEventListener("pointermove", (e) => {
      if (!drag || drag.id !== e.pointerId || !drag.knob) return;
      const r = frame.getBoundingClientRect();
      setSplit((e.clientX - r.left) / r.width);
    });
    frame.addEventListener("pointerup", (e) => {
      if (!drag || drag.id !== e.pointerId) return;
      const moved = Math.hypot(e.clientX - drag.x, e.clientY - drag.y) > 5;
      if (!drag.knob && !moved) {
        const r = frame.getBoundingClientRect();
        P.sx = (e.clientX - r.left) / r.width;
        P.sy = (e.clientY - r.top) / r.height;
        autoStar = false;
        if (!P.star) {
          P.star = true;
          syncUI();
          persist();
        }
        queue();
      }
      drag = null;
    });
    frame.addEventListener("pointercancel", () => {
      drag = null;
    });
    knob.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        setSplit(split - 0.05);
        e.preventDefault();
      }
      if (e.key === "ArrowRight") {
        setSplit(split + 0.05);
        e.preventDefault();
      }
    });
    function useFile(f) {
      if (!f) return;
      if (f.type && !f.type.startsWith("image/")) {
        toast("\u8BF7\u9009\u62E9\u56FE\u7247\uFF0C\u89C6\u9891\u4E0D\u80FD\u8F6C\u6362");
        return;
      }
      const fr = new FileReader();
      fr.onerror = () => toast("\u56FE\u7247\u8BFB\u4E0D\u51FA\u6765\uFF0C\u6362\u4E00\u5F20\u8BD5\u8BD5");
      fr.onload = () => {
        const im = new Image();
        im.onload = () => {
          const c = document.createElement("canvas");
          const s = Math.min(1, 3e3 / Math.max(im.naturalWidth, im.naturalHeight));
          c.width = Math.round(im.naturalWidth * s);
          c.height = Math.round(im.naturalHeight * s);
          c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
          SRC = c;
          autoStar = true;
          baseName = (f.name || "image").replace(/\.[^.]+$/, "").slice(0, 60) || "image";
          $("srcName").textContent = `${baseName} \xB7 ${im.naturalWidth}\xD7${im.naturalHeight}`;
          $("tryBtn").hidden = true;
          $("pickLabel").textContent = "\u6362\u4E00\u5F20\u7167\u7247";
          queue();
        };
        im.onerror = () => toast("\u56FE\u7247\u8BFB\u4E0D\u51FA\u6765\uFF0C\u6362\u4E00\u5F20\u8BD5\u8BD5");
        im.src = fr.result;
      };
      fr.readAsDataURL(f);
    }
    $("pickBtn").addEventListener("click", () => $("file").click());
    $("tryBtn").addEventListener("click", (e) => {
      e.stopPropagation();
      $("file").click();
    });
    $("tryBtn").addEventListener("pointerdown", (e) => e.stopPropagation());
    $("tryBtn").addEventListener("pointerup", (e) => e.stopPropagation());
    const tabs = [...document.querySelectorAll(".tab")];
    function openTab(t) {
      for (const x of tabs) {
        const on = x === t;
        x.setAttribute("aria-selected", String(on));
        x.tabIndex = on ? 0 : -1;
        $(x.getAttribute("aria-controls")).hidden = !on;
      }
    }
    tabs.forEach((t, i) => {
      t.addEventListener("click", () => openTab(t));
      t.addEventListener("keydown", (e) => {
        const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (d) {
          const n = tabs[(i + d + tabs.length) % tabs.length];
          openTab(n);
          n.focus();
          e.preventDefault();
        }
      });
    });
    openTab(tabs[0]);
    $("file").addEventListener("change", (e) => {
      useFile(e.target.files && e.target.files[0]);
      e.target.value = "";
    });
    let tt = 0;
    function toast(msg) {
      const t = $("toast");
      t.textContent = msg;
      t.hidden = false;
      clearTimeout(tt);
      tt = setTimeout(() => {
        t.hidden = true;
      }, 2600);
    }
    function showSheet(url, msg) {
      $("sheetImg").src = url;
      $("sheetMsg").textContent = msg;
      $("sheet").hidden = false;
    }
    $("saveBtn").addEventListener("click", async () => {
      if (!last) return;
      const btn = $("saveBtn");
      btn.disabled = true;
      let data;
      try {
        data = last.canvas.toDataURL("image/png");
      } catch (_) {
        data = null;
      }
      if (!data || data.length < 32) {
        btn.disabled = false;
        toast("\u5BFC\u51FA\u5931\u8D25\uFF0C\u8BD5\u8BD5\u5C0F\u4E00\u70B9\u7684\u5C3A\u5BF8");
        return;
      }
      const m = mt();
      if (m && typeof m.saveImageToPhotosAlbum === "function") {
        try {
          let filePath = data;
          if (typeof m.writeTempFile === "function") {
            try {
              const r = await m.writeTempFile({ data });
              if (r && r.filePath) filePath = r.filePath;
            } catch (_) {
            }
          }
          await m.saveImageToPhotosAlbum({ filePath });
          toast("\u5DF2\u4FDD\u5B58\u5230\u76F8\u518C");
        } catch (_) {
          toast("\u6CA1\u80FD\u4FDD\u5B58\uFF0C\u8BF7\u5141\u8BB8\u8BBF\u95EE\u76F8\u518C\u540E\u518D\u8BD5");
        }
        btn.disabled = false;
        return;
      }
      btn.disabled = false;
      // website: trigger a real download, keep the preview sheet for long-press saving on phones
      try {
        const a = document.createElement("a");
        a.href = data; a.download = "starcore-led-" + Date.now() + ".png";
        document.body.appendChild(a); a.click(); a.remove();
      } catch (_) {}
      showSheet(data, "已开始下载。手机上也可以长按图片保存。");
    });
    $("sheetClose").addEventListener("click", () => {
      $("sheet").hidden = true;
    });
    $("sheet").addEventListener("click", (e) => {
      if (e.target.id === "sheet") $("sheet").hidden = true;
    });
    window.addEventListener("resize", () => {
      if (SRC) {
        const c = cropFor(SRC.width, SRC.height);
        fit(c.R);
      }
    });
    syncUI();
    loadStored();
    SRC = sample();
    baseName = "starcore-sample";
    const go = () => queue();
    (document.fonts && document.fonts.load ? Promise.all([
      document.fonts.load('600 20px "StarCore Serif"', "\u661F\u6838"),
      document.fonts.load('12px "Silkscreen"'),
      document.fonts.load('12px "Share Tech Mono"')
    ]).catch(() => {
    }) : Promise.resolve()).then(() => setTimeout(go, 0));
    go();
  })();
})();
