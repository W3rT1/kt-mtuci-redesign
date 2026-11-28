/* =========================================================
   КТ МТУСИ — публичная часть сайта.
   Все тексты берутся из data/content.json (редактируется в админ-панели).
   ========================================================= */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const app = $('#app');
  let D = null;           // данные сайта
  let IDX = [];           // поисковый индекс

  // ---------------- иконки ----------------
  const P = {
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>', chev: '<path d="m6 9 6 6 6-6"/>', left: '<path d="m15 6-6 6 6 6"/>', right: '<path d="m9 6 6 6-6 6"/>', up: '<path d="m6 15 6-6 6 6"/>',
    ext: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>', pin: '<path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>', camera: '<path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.5"/>',
    brand: '<circle cx="13.5" cy="6.5" r="1.5"/><circle cx="17.5" cy="10.5" r="1.5"/><circle cx="8.5" cy="7.5" r="1.5"/><circle cx="6.5" cy="12.5" r="1.5"/><path d="M12 2a10 10 0 0 0 0 20c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.3 0-1.1.9-2 2-2h2.3A5.6 5.6 0 0 0 22 10c0-4.4-4.5-8-10-8z"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>', users: '<circle cx="9" cy="8" r="3.5"/><path d="M2 20a7 7 0 0 1 14 0M16 4.5a3.5 3.5 0 0 1 0 7M18 13.5a7 7 0 0 1 4 6.5"/>',
    grad: '<path d="m2 9 10-5 10 5-10 5z"/><path d="M6 11v5c3 2.5 9 2.5 12 0v-5M22 9v6"/>', building: '<path d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6M9 10h.01M15 10h.01"/>',
    book: '<path d="M4 4h6a3 3 0 0 1 3 3v14a2 2 0 0 0-2-2H4zM20 4h-6a3 3 0 0 0-3 3"/><path d="M20 4v15h-7"/>', file: '<path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
    download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>', sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>', eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>', x: '<path d="M6 6l12 12M18 6 6 18"/>',
    spark: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8zM5 2l.6 1.4L7 4l-1.4.6L5 6l-.6-1.4L3 4l1.4-.6z"/>',
    send: '<path d="M4 12 20 4l-6 16-3-7z"/>', news: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h10M7 12h10M7 16h6"/>', shield: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>',
    star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z"/>', wifi: '<path d="M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0"/><circle cx="12" cy="19.5" r="1"/>',
    code: '<path d="m8 8-5 4 5 4M16 8l5 4-5 4M14 4l-4 16"/>', cpu: '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M10 10h4v4h-4zM9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',
    radio: '<circle cx="12" cy="12" r="2"/><path d="M16.2 7.8a6 6 0 0 1 0 8.4M7.8 16.2a6 6 0 0 1 0-8.4M19 5a10 10 0 0 1 0 14M5 19A10 10 0 0 1 5 5"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>', megaphone: '<path d="M3 11v2a1 1 0 0 0 1 1h3l6 4V6L7 10H4a1 1 0 0 0-1 1zM17 8a5 5 0 0 1 0 8"/>',
    network: '<rect x="9" y="2" width="6" height="5" rx="1"/><rect x="2" y="17" width="6" height="5" rx="1"/><rect x="16" y="17" width="6" height="5" rx="1"/><path d="M12 7v5M5 17v-2h14v2"/>',
    award: '<circle cx="12" cy="9" r="6"/><path d="m8.5 14-1.5 8 5-3 5 3-1.5-8"/>', globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5h.01"/>', clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', compare: '<path d="M8 3v18M16 3v18M3 8h5M16 16h5M3 16h5M16 8h5"/>',
    quiz: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17.5h.01"/>', home: '<path d="m3 11 9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  };
  const ic = (n, cls = '') => `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true">${P[n] || P.file}</svg>`;
  const iconFor = t => {
    t = (t || '').toLowerCase();
    const map = [['распис', 'calendar'], ['календар', 'calendar'], ['мероприят', 'calendar'], ['специальн', 'grad'], ['документ', 'file'], ['правил', 'file'], ['приказ', 'file'], ['списки', 'users'], ['результат', 'chart'], ['иностран', 'globe'], ['библиот', 'book'], ['воспит', 'users'], ['аттестац', 'award'], ['руковод', 'users'], ['комисс', 'users'], ['террор', 'shield'], ['дополнит', 'star'], ['достиж', 'award'], ['партн', 'users'], ['самообслед', 'chart'], ['качеств', 'chart'], ['брендбук', 'brand'], ['сведения', 'building'], ['общая', 'info'], ['основная', 'info'], ['фото', 'camera'], ['медиа', 'camera'], ['новост', 'news'], ['контакт', 'phone'], ['доступн', 'eye'], ['конкурс', 'star']];
    const m = map.find(([k]) => t.includes(k)); return m ? m[1] : 'file';
  };
  const specIcon = code => ({ '09.02.06': 'network', '09.02.11': 'code', '09.02.13': 'cpu', '10.02.04': 'shield', '11.02.15': 'wifi', '11.02.18': 'radio', '38.02.01': 'chart', '42.02.01': 'megaphone' }[code] || 'grad');

  // ---------------- фирменный паттерн (по брендбуку: элементы знака МТУСИ) ----------------
  // Плитки из четвертей круга, полукругов, квадратов и диагоналей. Раскладка
  // детерминирована (seed), поэтому одинакова при каждом показе.
  function brandPattern(cols, rows, seed = 1, opt = {}) {
    let s = seed * 9301 + 49297;
    const rnd = () => { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; };
    const T = 100, G = (opt.gap == null ? 8 : opt.gap), W = cols * T + (cols - 1) * G, H = rows * T + (rows - 1) * G;
    const shapes = [
      ['M0 0H100A100 100 0 0 1 0 100Z', 5],         // четверть круга
      ['M0 0H50A50 50 0 0 1 50 100H0Z', 4],          // «D» — полукруг на прямоугольнике
      ['M0 0H100V100H0Z', 2],                        // квадрат
      ['M0 0H100V100Z', 3],                          // диагональ
      ['M50 0A50 50 0 1 1 50 100A50 50 0 1 1 50 0Z', 2], // круг
      ['M0 0H100V50H0Z', 2],                         // полоса
      ['', 3],                                       // пусто
    ];
    const total = shapes.reduce((a, x) => a + x[1], 0);
    const pick = () => { let r = rnd() * total; for (const sh of shapes) { if ((r -= sh[1]) < 0) return sh[0]; } return ''; };
    let out = '', spins = opt.spin || 0;
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
      const d = pick(); if (!d) continue;
      const rot = Math.floor(rnd() * 4) * 90, alt = rnd() < 0.22, spin = spins > 0 && rnd() < 0.18;
      if (spin) spins--;
      const tx = x * (T + G), ty = y * (T + G);
      out += `<g transform="translate(${tx} ${ty}) rotate(${rot} 50 50)"><path class="t${alt ? ' alt' : ''}${spin ? ' spin' : ''}" style="animation-delay:${((x + y) * 0.06).toFixed(2)}s${spin ? `,${(2 + rnd() * 5).toFixed(1)}s` : ''}" d="${d}"/></g>`;
    }
    return `<svg class="bp" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMaxYMid meet" aria-hidden="true">${out}</svg>`;
  }
  // ---------------- тематические анимации (связь, сети, IT) ----------------
  // Анимированные иконки специальностей: каждая показывает суть профессии.
  const SA = (cls, body) => `<svg class="sa ${cls}" viewBox="0 0 48 48" aria-hidden="true">${body}</svg>`;
  const mv = (path, dur, begin) => `<circle class="sa-pk" r="2.2"><animateMotion dur="${dur}s" begin="${begin}s" repeatCount="indefinite" path="${path}"/></circle>`;
  const SPEC_ANIM = {
    // сетевое администрирование: пакеты бегут по связям между узлами
    '09.02.06': () => SA('sa-net', `<path class="sa-ln" d="M24 22V12M20.5 27.5 11 34M27.5 27.5 37 34"/>
      <circle class="sa-node n1" cx="24" cy="8" r="4"/><circle class="sa-node n2" cx="8" cy="37" r="4"/><circle class="sa-node n3" cx="40" cy="37" r="4"/><circle class="sa-hub" cx="24" cy="25.5" r="4.6"/>
      ${mv('M24 21V12', 1.6, 0)}${mv('M20.5 28 11 34.5', 1.6, .5)}${mv('M27.5 28 37 34.5', 1.6, 1)}`),
    // разработка ПО: </> и печатающийся слэш
    '09.02.11': () => SA('sa-code', `<path class="sa-l" d="M15 15 6 24l9 9"/><path class="sa-r" d="M33 15l9 9-9 9"/><path class="sa-slash" d="M27.5 12 20.5 36"/>`),
    // ИИ: нейросеть загорается слой за слоем
    '09.02.13': () => SA('sa-ai', `<path class="sa-ln" d="M10 16 24 10M10 16 24 24M10 16 24 38M10 32 24 10M10 32 24 24M10 32 24 38M24 10 38 18M24 24 38 18M24 38 38 18M24 10 38 30M24 24 38 30M24 38 38 30"/>
      <circle class="sa-n l1" cx="10" cy="16" r="3.4"/><circle class="sa-n l1" cx="10" cy="32" r="3.4"/><circle class="sa-n l2" cx="24" cy="10" r="3.4"/><circle class="sa-n l2" cx="24" cy="24" r="3.4"/><circle class="sa-n l2" cx="24" cy="38" r="3.4"/><circle class="sa-n l3" cx="38" cy="18" r="3.4"/><circle class="sa-n l3" cx="38" cy="30" r="3.4"/>`),
    // информационная безопасность: щит, сканирующий луч и галочка
    '10.02.04': () => SA('sa-sec', `<defs><clipPath id="saShield"><path d="M24 5 9 11v11c0 10 6.5 17 15 21 8.5-4 15-11 15-21V11z"/></clipPath></defs>
      <path class="sa-sh" d="M24 5 9 11v11c0 10 6.5 17 15 21 8.5-4 15-11 15-21V11z"/><g clip-path="url(#saShield)"><rect class="sa-scan" x="6" y="4" width="36" height="5"/></g><path class="sa-ok" d="m17 24 5 5 9-10"/>`),
    // инфокоммуникационные сети: дуги сигнала заполняются по очереди
    '11.02.15': () => SA('sa-wifi', `<path class="sa-a a1" d="M17.5 30.5a9 9 0 0 1 13 0"/><path class="sa-a a2" d="M12 24.5a17 17 0 0 1 24 0"/><path class="sa-a a3" d="M6.5 18.5a25 25 0 0 1 35 0"/><circle class="sa-dot" cx="24" cy="37" r="3"/>`),
    // радиосвязь и телерадиовещание: мачта излучает волны
    '11.02.18': () => SA('sa-radio', `<path class="sa-mast" d="M24 20 17 43M24 20l7 23M19.5 35h9M21 28h6"/><circle class="sa-top" cx="24" cy="17" r="3"/>
      <path class="sa-w w1" d="M16.5 10.5a10 10 0 0 0 0 13M31.5 10.5a10 10 0 0 1 0 13"/><path class="sa-w w2" d="M11 6a17 17 0 0 0 0 22M37 6a17 17 0 0 1 0 22"/>`),
    // экономика и бухучёт: растущие столбцы
    '38.02.01': () => SA('sa-chart', `<path class="sa-ax" d="M6 42h36M6 42V6"/><rect class="sa-bar b1" x="11" y="26" width="7" height="16" rx="1.5"/><rect class="sa-bar b2" x="21" y="18" width="7" height="24" rx="1.5"/><rect class="sa-bar b3" x="31" y="10" width="7" height="32" rx="1.5"/>`),
    // реклама: громкоговоритель и звуковые волны
    '42.02.01': () => SA('sa-ad', `<path class="sa-mega" d="M7 20v8h6l13 8V12l-13 8z"/><path class="sa-s s1" d="M31 19.5a6 6 0 0 1 0 9"/><path class="sa-s s2" d="M35.5 15a12 12 0 0 1 0 18"/><path class="sa-s s3" d="M40 10.5a18 18 0 0 1 0 27"/>`),
  };
  const specAnim = code => (SPEC_ANIM[code] ? SPEC_ANIM[code]() : ic(specIcon(code)));

  // Дорожки печатной платы по бокам баннера специальности: прорисовываются при загрузке,
  // по ним от края к названию бегут «импульсы сигнала». Раскладка зависит от кода специальности.
  function pcbTraces(side, seed = 1) {
    let s = seed * 9301 + 49297;
    const rnd = () => { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; };
    const H = 480, W = 420, lanes = 13, step = (H - 40) / (lanes - 1);
    let traces = '', pulses = '', vias = '';
    for (let k = 0; k < lanes; k++) {
      if (rnd() < 0.18) continue; // пропуски — как на настоящей плате
      const y0 = 20 + k * step + (rnd() - .5) * 6;
      let x = 0, y = y0, d = `M0 ${y0.toFixed(1)}`;
      const segs = 1 + Math.floor(rnd() * 3);
      for (let j = 0; j < segs; j++) {
        x += 30 + rnd() * 90; d += ` H${x.toFixed(1)}`;              // прямой участок
        const dd = 14 + rnd() * 34, dir = rnd() < .5 ? -1 : 1;
        if (y + dir * dd < 10 || y + dir * dd > H - 10) continue;
        x += dd; y += dir * dd; d += ` L${x.toFixed(1)} ${y.toFixed(1)}`; // поворот под 45°
      }
      x += 20 + rnd() * 70; d += ` H${x.toFixed(1)}`;
      if (x > W - 12) continue;
      const delay = (k * .07).toFixed(2), pdur = (3.2 + rnd() * 2.6).toFixed(2), pdel = (1 + rnd() * 4).toFixed(2);
      traces += `<path class="pcb-t" pathLength="1" d="${d}" style="animation-delay:${delay}s"/>`;
      pulses += `<path class="pcb-p" pathLength="100" d="${d}" style="animation-duration:${pdur}s;animation-delay:${pdel}s"/>`;
      vias += `<circle class="pcb-v" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4" style="animation-delay:${(+delay + .6).toFixed(2)}s,${(+pdel + +pdur * .92).toFixed(2)}s;animation-duration:.5s,${pdur}s"/>`;
      if (rnd() < .35) vias += `<circle class="pcb-dot" cx="${(x - 10 - rnd() * 30).toFixed(1)}" cy="${(y + (rnd() < .5 ? -9 : 9)).toFixed(1)}" r="2.2" style="animation-delay:${(+delay + .8).toFixed(2)}s"/>`;
    }
    const flip = side === 'right' ? ` transform="translate(${W} 0) scale(-1 1)"` : '';
    return `<svg class="pcb pcb-${side}" viewBox="0 0 ${W} ${H}" preserveAspectRatio="${side === 'right' ? 'xMaxYMid' : 'xMinYMid'} slice" aria-hidden="true"><g${flip}>${traces}${pulses}${vias}</g></svg>`;
  }

  // «Сетевой трафик» для мозаики первого экрана: пакеты бегут по зазорам между плитками от логотипа к краям
  function heroPackets() {
    const C = [104, 212, 320, 428], E = 532, mid = 266;
    const routes = [
      `M104 ${mid}V0`, `M104 ${mid}V${E}`, `M428 ${mid}V0`, `M428 ${mid}V${E}`,
      `M212 212V0`, `M320 212V0`, `M212 320V${E}`, `M320 320V${E}`,
      `M${mid} 212H0`, `M${mid} 212H${E}`, `M${mid} 320H0`, `M${mid} 320H${E}`,
    ];
    return `<g class="packets">${routes.map((d, i) => {
      const dur = (2.6 + (i % 4) * 0.35).toFixed(2), begin = (i * 0.45).toFixed(2);
      return `<g><rect class="pk${i % 3 === 0 ? ' pk-alt' : ''}" x="-8" y="-2.5" width="16" height="5" rx="2.5" opacity="0"><animateMotion dur="${dur}s" begin="${begin}s" repeatCount="indefinite" rotate="auto" path="${d}"/><animate attributeName="opacity" dur="${dur}s" begin="${begin}s" repeatCount="indefinite" values="0;1;1;0" keyTimes="0;.12;.78;1"/></rect></g>`;
    }).join('')}</g>`;
  }

  // «Радиосигнал» внизу первого экрана: бесшовно бегущие синусоиды
  function signalWaves() {
    const wave = (amp, len, y) => { let d = `M0 ${y}`; for (let x = 0; x < 2400; x += len) d += ` q${len / 4} ${-amp} ${len / 2} 0 t${len / 2} 0`; return d; };
    return `<div class="signal" aria-hidden="true"><svg viewBox="0 0 2400 60" preserveAspectRatio="none">
      <path class="sg sg1" d="${wave(16, 300, 30)}"/><path class="sg sg2" d="${wave(10, 200, 34)}"/><path class="sg sg3" d="${wave(6, 120, 28)}"/></svg></div>`;
  }

  // Пауза анимаций вне экрана (экономия батареи на телефонах)
  let animObs;
  function watchAnimations() {
    if (!('IntersectionObserver' in window)) return;
    if (!animObs) animObs = new IntersectionObserver(es => es.forEach(e => {
      e.target.classList.toggle('anim-off', !e.isIntersecting);
      e.target.querySelectorAll('svg').forEach(s => { if (s.pauseAnimations) { try { e.isIntersecting ? s.unpauseAnimations() : s.pauseAnimations(); } catch (_) {} } });
    }), { rootMargin: '80px' });
    $$('.hero, .cta-band, .spec-card, .spec-hero, .aud__card').forEach(el => animObs.observe(el));
  }

  // Мозаика первого экрана: логотип колледжа в центре, плитки вокруг поворачиваются
  // волной от логотипа к краям (как сигнал от передатчика). Цикл бесшовный:
  // 4 поворота по 90° = полный оборот, плитка возвращается в исходное положение.
  // Мозаика с бесшовной «волной» поворотов (как на первом экране), без логотипа.
  // ox/oy — точка в клетках, откуда расходится волна (например, со стороны текста).
  function brandWave(cols, rows, seed = 5, opt = {}) {
    let s = seed * 9301 + 49297;
    const rnd = () => { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; };
    const T = 100, G = (opt.gap == null ? 8 : opt.gap), W = cols * T + (cols - 1) * G, H = rows * T + (rows - 1) * G;
    const ox = (opt.ox == null ? -1 : opt.ox), oy = (opt.oy == null ? (rows - 1) / 2 : opt.oy);
    const shapes = [['M0 0H100A100 100 0 0 1 0 100Z', 6], ['M0 0H50A50 50 0 0 1 50 100H0Z', 4], ['M0 0H100V100Z', 3], ['M50 0A50 50 0 1 1 50 100A50 50 0 1 1 50 0Z', 2], ['M0 0H100V50H0Z', 2], ['', 2]];
    const total = shapes.reduce((a, x) => a + x[1], 0);
    const pick = () => { let r = rnd() * total; for (const sh of shapes) if ((r -= sh[1]) < 0) return sh[0]; return shapes[0][0]; };
    let cells = '';
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
      const d = pick(); if (!d) continue;
      const rot = Math.floor(rnd() * 4) * 90, alt = rnd() < 0.24;
      const delay = (Math.hypot(x - ox, y - oy) * 0.4 + rnd() * 0.2).toFixed(2);
      cells += `<g transform="translate(${x * (T + G)} ${y * (T + G)})"><g class="cell" style="animation-delay:${delay}s"><rect width="100" height="100" fill="none"/><g transform="rotate(${rot} 50 50)"><path class="t${alt ? ' alt' : ''}" style="animation-delay:${((x + y) * 0.06).toFixed(2)}s${alt ? `,${(rnd() * 6).toFixed(1)}s` : ''}" d="${d}"/></g></g></g>`;
    }
    return `<svg class="bp bp-wave" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" aria-hidden="true">${cells}</svg>`;
  }

  function brandHeroArt(seed = 7) {
    let s = seed * 9301 + 49297;
    const rnd = () => { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; };
    const N = 5, T = 100, G = 8, W = N * T + (N - 1) * G, LOGO_ROW = 2;
    const shapes = [['M0 0H100A100 100 0 0 1 0 100Z', 6], ['M0 0H50A50 50 0 0 1 50 100H0Z', 4], ['M0 0H100V100Z', 3], ['M50 0A50 50 0 1 1 50 100A50 50 0 1 1 50 0Z', 2], ['M0 0H100V50H0Z', 2], ['M0 0H100V100H0Z', 1]];
    const total = shapes.reduce((a, x) => a + x[1], 0);
    const pick = () => { let r = rnd() * total; for (const sh of shapes) if ((r -= sh[1]) < 0) return sh[0]; return shapes[0][0]; };
    let cells = '';
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      if (y === LOGO_ROW && x >= 1 && x <= 3) continue; // место под логотип
      const dist = Math.max(Math.abs(y - LOGO_ROW), x < 1 ? 1 - x : x > 3 ? x - 3 : 0);
      const d = pick(), rot = Math.floor(rnd() * 4) * 90, alt = rnd() < 0.24;
      const delay = (dist * 0.45 + rnd() * 0.2).toFixed(2);
      cells += `<g transform="translate(${x * (T + G)} ${y * (T + G)})"><g class="cell" style="animation-delay:${delay}s"><rect width="100" height="100" fill="none"/><g transform="rotate(${rot} 50 50)"><path class="t${alt ? ' alt' : ''}" style="animation-delay:${((x + y) * 0.06).toFixed(2)}s${alt ? `,${(rnd() * 6).toFixed(1)}s` : ''}" d="${d}"/></g></g></g>`;
    }
    const lx = T + G, ly = LOGO_ROW * (T + G), lw = 3 * T + 2 * G, cx = lx + lw / 2, cy = ly + T / 2;
    // логотип рисуется прямо в SVG (фирменный семиугольник + подпись) — не зависит от внешнего сайта
    const hx = lx + 22, hy = ly + 18, hs = 64;
    const hepta = HEPTA.split(' ').map(p => { const [x, y] = p.split(',').map(Number); return `${(hx + x * hs / 100).toFixed(1)},${(hy + y * hs / 100).toFixed(1)}`; }).join(' ');
    return `<svg class="bp bp-hero" viewBox="0 0 ${W} ${W}" aria-label="${esc(D.site.name)}" role="img">
      <g class="rings">${[0, 1, 2].map(i => `<circle cx="${cx}" cy="${cy}" r="${lw / 2}" style="animation-delay:${i * 2}s"/>`).join('')}</g>
      ${cells}
      ${heroPackets()}
      <g class="logo-card"><rect x="${lx}" y="${ly}" width="${lw}" height="${T}" rx="18"/>
        <polygon class="lc-hepta" points="${hepta}"/>
        <text class="lc-name" x="${lx + 104}" y="${ly + 54}" textLength="150" lengthAdjust="spacingAndGlyphs">МТУСИ</text>
        <text class="lc-sub" x="${lx + 105}" y="${ly + 74}" textLength="186" lengthAdjust="spacingAndGlyphs">КОЛЛЕДЖ ТЕЛЕКОММУНИКАЦИЙ</text></g>
    </svg>`;
  }
  const seedOf = str => [...String(str)].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 9973, 7);

  // ---------------- утилиты ----------------
  const MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  const fmtDate = iso => { if (!iso) return ''; const [y, m, d] = iso.split('-'); return `${+d} ${MONTHS[+m - 1]} ${y}`; };
  const linkOf = it => it.url ? it.url : '#' + it.route;
  const isExt = href => /^https?:/i.test(href);
  const aAttrs = href => isExt(href) ? ` href="${esc(href)}" target="_blank" rel="noopener"` : ` href="${esc(href)}"`;
  // текст без разметки; на месте переносов строк и границ блоков ставим пробел, чтобы слова не слипались
  const stripHtml = h => { const d = document.createElement('div'); d.innerHTML = String(h || '').replace(/<br\s*\/?>/gi, ' ').replace(/<\/(p|div|li|h[1-6]|td|th|tr|dt|dd|blockquote|figcaption)>/gi, ' $&'); return d.textContent.replace(/\s+/g, ' ').trim(); };
  const norm = s => (s || '').toLowerCase().replace(/ё/g, 'е');
  const currentRoute = () => { const h = decodeURIComponent(location.hash.slice(1) || '/'); const [p, q] = h.split('?'); let path = p || '/'; if (!path.endsWith('/') && !/\.\w+$/.test(path)) path += '/'; return { path, query: new URLSearchParams(q || '') }; };
  const sectionOf = route => D.sections.find(s => s.route === route) || D.sections.find(s => s.items.some(i => i.route === route));
  const factVal = (sp, kw, mode = 0) => { const f = sp.facts.find(f => norm(f.label).includes(kw)); return f ? stripHtml((f.values[mode] == null ? f.values[0] : f.values[mode]) || '') : ''; };

  // Фирменный знак МТУСИ — семиугольник — и подпись в духе официального логотипа:
  // «МТУСИ» крупно, «колледж телекоммуникаций» — дескриптор под ним.
  const HEPTA = '50,10 81.3,25.1 89,58.9 67.4,86 32.6,86 11,58.9 18.7,25.1';
  const heptagon = (cls = '') => `<svg class="hepta ${cls}" viewBox="0 0 100 100" aria-hidden="true"><polygon points="${HEPTA}"/></svg>`;
  const logoLockup = () => `<span class="logo__mark">${heptagon()}</span><span class="logo__text"><b>МТУСИ</b><small>Колледж<br>телекоммуникаций</small></span>`;
  // ---------------- оболочка ----------------
  function renderShell() {
    const s = D.site;
    document.title = s.name;
    $('#topbar').innerHTML = `<div class="container">
      <div class="dd"><button>${ic('pin')} ${esc(s.city)} ${ic('chev')}</button><div class="dd-menu">${s.branches.map(b => `<a${aAttrs(b.url)}>${esc(b.name)}</a>`).join('')}</div></div>
      <a class="hide-m" href="tel:${s.phones[1] ? s.phones[1].number.replace(/[^\d+]/g, '') : ''}">${ic('phone')} ${esc(s.phones[1] ? s.phones[1].number : '')}</a>
      <a class="hide-m" href="mailto:${esc(s.email)}">${ic('mail')} ${esc(s.email)}</a>
      <span class="grow"></span>
      <button id="a11yBtn" title="Версия для слабовидящих">${ic('eye')} <span class="hide-m">Версия для слабовидящих</span></button>
      ${s.lkUrl ? `<a${aAttrs(s.lkUrl)} title="Личный кабинет">${ic('user')} <span class="hide-m">Личный кабинет</span></a>` : ''}
    </div>`;
    $('#header').innerHTML = `<div class="container">
      <a class="logo" href="#/" aria-label="${esc(s.name)} — на главную">${logoLockup()}</a>
      <nav class="nav" aria-label="Основное меню">${D.sections.map(sec => sec.items.length ? `
        <div class="nav__item" data-sec="${sec.id}"><button class="nav__link" aria-expanded="false">${esc(sec.title)} ${ic('chev', 'chev')}</button>
          <div class="mega"><div class="mega__head"><b>${esc(sec.title)}</b><a class="btn btn-sm" href="#${sec.route}">Обзор раздела ${ic('arrow')}</a></div>
          ${sec.items.map(it => `<a${aAttrs(linkOf(it))}>${ic(iconFor(it.title))}<span>${esc(it.title)}</span>${it.url ? ic('ext', 'ext') : ''}</a>`).join('')}</div></div>` :
        `<div class="nav__item"><a class="nav__link" href="#${sec.route}">${esc(sec.title)}</a></div>`).join('')}</nav>
      <div class="header__actions">
        <button class="search-trigger" id="searchBtn" aria-label="Поиск">${ic('search')}<span>Поиск по сайту</span><kbd>Ctrl K</kbd></button>
        <button class="icon-btn" id="themeBtn" aria-label="Сменить тему">${ic('moon')}</button>
        <button class="icon-btn burger" id="burger" aria-label="Меню">${ic('menu')}</button>
      </div></div>`;
    $('#drawer .drawer__panel').innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><b>Меню</b><button class="icon-btn" data-close>${ic('x')}</button></div>
      <a class="btn btn-primary" style="width:100%;margin-bottom:10px" href="#/">${ic('home')} Главная</a>
      ${D.sections.map(sec => sec.items.length ? `<details><summary>${esc(sec.title)} ${ic('chev')}</summary><a href="#${sec.route}"><b>Обзор раздела</b></a>${sec.items.map(it => `<a${aAttrs(linkOf(it))}>${esc(it.title)}</a>`).join('')}</details>` : `<details><summary><a href="#${sec.route}" style="padding:0">${esc(sec.title)}</a></summary></details>`).join('')}
      <div style="margin-top:16px;display:grid;gap:8px">${s.phones.map(p => `<a href="tel:${p.number.replace(/[^\d+]/g, '')}">${ic('phone')} ${esc(p.number)} <small class="muted">${esc(p.label)}</small></a>`).join('')}</div>`;
    $('#footer').innerHTML = `<div class="container">${brandPattern(26, 1, 11, { gap: 10 })}<div class="footer__grid">
      <div><a class="logo logo--light" href="#/" aria-label="${esc(s.name)} — на главную">${logoLockup()}</a>
        <p style="margin-top:18px;font-size:.9rem">${esc(s.address)}</p>
        ${s.admission && s.admission.enabled !== false && s.admission.address ? `<p style="font-size:.9rem;margin-top:-6px"><b style="color:#fff">${esc(s.admission.title || 'Приёмная комиссия')}</b>${s.admission.note ? ` (${esc(s.admission.note.toLowerCase())})` : ''}: ${esc(s.admission.address)}<br>${(s.admission.phones || []).map(p => `<a href="tel:${p.replace(/[^\d+]/g, '')}">${esc(p)}</a>`).join(', ')}${s.admission.email ? ` · <a href="mailto:${esc(s.admission.email)}">${esc(s.admission.email)}</a>` : ''}</p>` : ''}
        ${s.phones.map(p => `<div><a href="tel:${p.number.replace(/[^\d+]/g, '')}">${esc(p.number)}</a> — ${esc(p.label)}</div>`).join('')}
        <div><a href="mailto:${esc(s.email)}">${esc(s.email)}</a></div>
        <div class="socials">${s.socials.map(x => `<a${aAttrs(x.url)} title="${esc(x.name)}">${esc(x.name.slice(0, 2).toUpperCase())}</a>`).join('')}</div></div>
      ${D.sections.filter(x => x.items.length).slice(0, 3).map(sec => `<div><h4>${esc(sec.title)}</h4><ul>${sec.items.map(it => `<li><a${aAttrs(linkOf(it))}>${esc(it.title)}</a></li>`).join('')}</ul></div>`).join('')}
    </div>
    <div class="footer__bottom">
      <div><a${aAttrs(s.parentOrg.url)}>${esc(s.parentOrg.text)}</a></div>
      <div class="footer__min">${s.ministries.map(m => `<a${aAttrs(m.url)}>${esc(m.name)}</a>`).join('')}</div>
      <div style="display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap"><span>${esc(s.copyright)}</span><span><a href="#/media-room/">Медиа-рум</a> · <a href="#/news/">Новости</a> · <a href="#/events/">Мероприятия</a> · <a href="#/abitur/contacts/">Контакты</a></span></div>
    </div></div>`;
    $('#cookie').innerHTML = `<p style="margin:0 0 12px">${esc(s.cookieText)}</p><button class="btn btn-primary btn-sm" id="cookieOk">Я согласен</button>`;
    bindShell();
  }

  function bindShell() {
    // мега-меню: наведение + клик + клавиатура
    $$('.nav__item').forEach(item => {
      const btn = $('button', item); if (!btn) return;
      let t;
      item.addEventListener('mouseenter', () => { clearTimeout(t); $$('.nav__item.open').forEach(o => o !== item && o.classList.remove('open')); item.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); });
      item.addEventListener('mouseleave', () => { t = setTimeout(() => { item.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }, 180); });
      btn.addEventListener('click', () => { const o = item.classList.toggle('open'); btn.setAttribute('aria-expanded', o); });
    });
    document.addEventListener('click', e => { if (!e.target.closest('.nav__item')) $$('.nav__item.open').forEach(o => o.classList.remove('open')); });
    $('#burger').onclick = () => $('#drawer').classList.add('open');
    $('#drawer').addEventListener('click', e => { if (e.target.closest('[data-close]') || e.target.classList.contains('drawer__bg') || e.target.closest('a[href^="#"]')) $('#drawer').classList.remove('open'); });
    $('#searchBtn').onclick = () => openSearch();
    $('#themeBtn').onclick = () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
    $('#a11yBtn').onclick = () => $('#a11y').classList.toggle('open');
    // меню городов (филиалы): открывается по нажатию — удобно и на телефоне; закрывается кликом мимо и Esc
    $$('.topbar .dd').forEach(dd => {
      const btn = $('button', dd);
      btn.setAttribute('aria-haspopup', 'true'); btn.setAttribute('aria-expanded', 'false');
      btn.onclick = e => { e.stopPropagation(); const o = dd.classList.toggle('open'); btn.setAttribute('aria-expanded', o); };
    });
    document.addEventListener('click', e => { if (!e.target.closest('.topbar .dd')) $$('.topbar .dd.open').forEach(d => { d.classList.remove('open'); $('button', d).setAttribute('aria-expanded', 'false'); }); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') $$('.topbar .dd.open').forEach(d => d.classList.remove('open')); });
    if (!localStorage.getItem('cookieOk')) $('#cookie').classList.add('show');
    $('#cookieOk').onclick = () => { localStorage.setItem('cookieOk', '1'); $('#cookie').classList.remove('show'); };
    const header = $('#header'), toTop = $('#toTop'), bar = $('#progress');
    addEventListener('scroll', () => {
      const y = scrollY; header.classList.toggle('scrolled', y > 10); toTop.classList.toggle('show', y > 700);
      const h = document.documentElement.scrollHeight - innerHeight; bar.style.width = (h > 0 ? y / h * 100 : 0) + '%';
    }, { passive: true });
    toTop.onclick = () => scrollTo({ top: 0, behavior: 'smooth' });
  }

  function setTheme(t) { document.documentElement.dataset.theme = t; localStorage.setItem('theme', t); const b = $('#themeBtn'); if (b) b.innerHTML = ic(t === 'dark' ? 'sun' : 'moon'); }

  // ---- версия для слабовидящих ----
  function initA11y() {
    const el = $('#a11y'); const root = document.documentElement;
    const st = JSON.parse(localStorage.getItem('a11y') || '{}');
    const apply = () => {
      ['size', 'color', 'img'].forEach(k => { if (st[k] && st[k] !== '0' && st[k] !== 'on' && st[k] !== 'normal') root.setAttribute('data-a11y-' + k, st[k]); else root.removeAttribute('data-a11y-' + k); });
      $$('button[data-k]', el).forEach(b => b.classList.toggle('active', (st[b.dataset.k] || ({ size: '0', color: 'normal', img: 'on' })[b.dataset.k]) === b.dataset.v));
      localStorage.setItem('a11y', JSON.stringify(st));
    };
    el.innerHTML = `<div class="container">
      <div class="grp">Размер: <button data-k="size" data-v="0" style="font-size:14px">A</button><button data-k="size" data-v="1" style="font-size:18px">A</button><button data-k="size" data-v="2" style="font-size:22px">A</button></div>
      <div class="grp">Цвет: <button data-k="color" data-v="normal">Ц</button><button data-k="color" data-v="bw" style="background:#fff;color:#000">C</button><button data-k="color" data-v="wb" style="background:#000;color:#fff">C</button><button data-k="color" data-v="blue" style="background:#9dd1ff;color:#063462">C</button></div>
      <div class="grp">Изображения: <button data-k="img" data-v="on">Вкл.</button><button data-k="img" data-v="off">Выкл.</button></div>
      <button id="a11yReset" style="padding:0 14px">Обычная версия сайта</button>
      <button id="a11yClose" style="margin-left:auto" aria-label="Закрыть">${ic('x')}</button></div>`;
    el.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.k) { st[b.dataset.k] = b.dataset.v; apply(); }
      if (b.id === 'a11yReset') { delete st.size; delete st.color; delete st.img; apply(); el.classList.remove('open'); }
      if (b.id === 'a11yClose') el.classList.remove('open');
    });
    apply();
  }

  // ---------------- маршрутизация ----------------
  function route() {
    const { path, query } = currentRoute();
    $$('.nav__item').forEach(n => n.classList.remove('open'));
    $$('.nav__link').forEach(l => l.classList.remove('active'));
    const sec = sectionOf(path); if (sec) { const n = $(`.nav__item[data-sec="${sec.id}"] .nav__link`); if (n) n.classList.add('active'); }
    app.classList.add('leaving');
    setTimeout(() => {
      let html;
      try { html = view(path, query); } catch (e) { console.error(e); html = notFound(path); }
      app.innerHTML = html;
      app.classList.remove('leaving'); app.classList.remove('entering'); void app.offsetWidth; app.classList.add('entering');
      if (!query.get('q')) scrollTo({ top: 0 });
      after(path, query);
    }, app.innerHTML.trim() ? 160 : 0);
  }

  function view(path, q) {
    if (path === '/') return viewHome();
    if (path === '/abitur/specialties/') return viewSpecialties(q);
    if (path === '/abitur/specialties/compare/') return viewCompare();
    if (path === '/quiz/') return viewQuiz();
    const sm = path.match(/^\/abitur\/specialties\/([^/]+)\/$/);
    if (sm) { const sp = D.specialties.find(s => s.code === sm[1]); if (sp) return viewSpecialty(sp); }
    if (path === '/news/') return viewNews(q);
    const nm = path.match(/^\/news\/([^/]+)\/$/);
    if (nm) { const n = D.news.find(x => x.slug === nm[1]); if (n) return viewNewsItem(n); }
    const sec = D.sections.find(s => s.route === path && s.items.length);
    if (sec) return viewSection(sec);
    if (D.pages[path]) return viewPage(path, D.pages[path], q);
    const lone = D.sections.find(s => s.route === path); // раздел без подпунктов (например, «Контакты»)
    if (lone) return viewPage(path, { title: lone.title, html: lone.intro || '', section: lone.id, layout: 'auto' }, q);
    return notFound(path);
  }

  // ---------------- главная ----------------
  function viewHome() {
    const s = D.site, h = D.home;
    const budget = D.specialties.reduce((a, sp) => a + (parseInt(factVal(sp, 'бюджет')) || 0), 0);
    const stats = h.stats && h.stats.length ? h.stats : [
      { value: D.specialties.length, label: 'специальностей' },
      budget ? { value: budget, label: 'бюджетных мест' } : null,
      { value: '9 и 11', label: 'классов — база для поступления' },
    ].filter(Boolean);
    const latest = D.news.slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
    const ab = D.sections.find(x => x.id === 'abitur'), st = D.sections.find(x => x.id === 'students'), co = D.sections.find(x => x.id === 'about_the_college');
    const audCard = (sec, icon, text) => sec ? `<article class="aud__card reveal">${brandPattern(3, 3, seedOf(sec.id))}
      <div class="aud__icon">${ic(icon)}</div><h3>${esc(sec.title)}</h3><p class="muted" style="margin-top:-6px">${esc(text)}</p>
      <ul>${sec.items.map(it => `<li><a${aAttrs(linkOf(it))}>${esc(it.title)} ${ic(it.url ? 'ext' : 'arrow')}</a></li>`).join('')}</ul>
      <a class="btn" href="#${sec.route}">Весь раздел ${ic('arrow')}</a></article>` : '';
    return `
    <section class="hero">
      ${signalWaves()}
      <div class="container">
        <div class="reveal">
          <span class="hero__eyebrow"><span class="dot"></span>${esc(h.eyebrow || 'Структурное подразделение МТУСИ')}</span>
          <h1>${esc(h.title || 'Колледж') } <span class="grad">${esc(h.titleAccent || 'телекоммуникаций МТУСИ')}</span></h1>
          <p class="hero__lead">${esc(h.lead || '')}</p>
          <form class="hero__search" id="heroSearch" role="search">${ic('search')}<input name="q" placeholder="Спросите: «где находится колледж», «стоимость обучения»…" autocomplete="off"><button class="btn">${ic('spark')} Спросить</button></form>
          <div class="hero__chips">${(h.chips || ['Специальности', 'Документы для поступления', 'Расписание занятий', 'Общежитие', 'Стоимость обучения']).map(c => `<button data-q="${esc(c)}">${esc(c)}</button>`).join('')}</div>
          <div class="hero__stats">${stats.map(x => `<div><b data-count="${esc(x.value)}">${esc(x.value)}</b><span>${esc(x.label)}</span></div>`).join('')}</div>
        </div>
        <div class="hero__art reveal reveal-d2">
          ${brandHeroArt()}
        </div>
      </div>
    </section>

    <div class="container quick"><div class="quick__grid">
      ${h.slides.length ? `<a class="quick__item quick__item--ann reveal reveal-d1" id="annItem" href="#/"><span class="ic">${ic('megaphone')}</span><span class="qa"><small>Анонс</small><b id="annTitle"></b></span>${h.slides.length > 1 ? `<span class="ann-dots" aria-hidden="true">${h.slides.map(() => '<i></i>').join('')}</span>` : ''}</a>` : ''}
      ${h.quickLinks.map((q, i) => `<a class="quick__item reveal reveal-d${i % 3 + 1}"${aAttrs(q.url)}><span class="ic">${ic(q.icon || iconFor(q.title))}</span>${esc(q.title)}</a>`).join('')}
      <a class="quick__item reveal reveal-d3" href="#/quiz/"><span class="ic">${ic('quiz')}</span>Подобрать специальность</a>
    </div></div>

    <section class="section"><div class="container">
      <div class="section__head reveal"><div><span class="eyebrow">Навигация</span><h2>Всё важное — на одном экране</h2><p>Выберите, кто вы, — и сразу увидите все нужные разделы, без поиска по вложенным меню.</p></div></div>
      <div class="aud">${audCard(ab, 'grad', 'Поступление, специальности, документы и приказы')}${audCard(st, 'book', 'Расписание, учебный процесс, библиотека')}${audCard(co, 'building', 'О колледже, руководство, документы организации')}</div>
    </div></section>

    <section class="section section--soft"><div class="container">
      <div class="section__head reveal"><div><span class="eyebrow">Поступление</span><h2>Специальности</h2><p>Нажмите на карточку, чтобы увидеть места, стоимость, сроки и описание программы.</p></div>
        <div style="display:flex;gap:8px;flex-wrap:wrap"><a class="btn" href="#/abitur/specialties/compare/">${ic('compare')} Сравнить</a><a class="btn btn-primary" href="#/abitur/specialties/">Все специальности ${ic('arrow')}</a></div></div>
      <div class="spec-grid">${D.specialties.map((sp, i) => specCard(sp, i)).join('')}</div>
    </div></section>

    <section class="section"><div class="container">
      <div class="cta-band cta-band--quiz reveal">
        <div class="cta-band__art" aria-hidden="true">${brandWave(4, 3, 5, { ox: -1, oy: 1 })}</div>
        <div class="cta-band__text"><span class="eyebrow">Подбор специальности</span><h2>Не знаете, какую специальность выбрать?</h2><p>Ответьте на ${quizQ().length} коротких вопросов — подскажем, какие направления колледжа подходят вам больше всего. Это займёт около минуты.</p>
          <div class="cta-band__btns"><a class="btn btn-white" href="#/quiz/">${ic('quiz')} Пройти тест</a><button class="btn btn-light" data-ai-open>${ic('spark')} Спросить помощника</button></div></div>
        ${ctaQuizCard()}
      </div>
    </div></section>

    <section class="section" style="padding-top:0"><div class="container">
      <div class="section__head reveal"><div><span class="eyebrow">Медиа-рум</span><h2>Новости</h2></div><a class="btn" href="#/news/">Все новости ${ic('arrow')}</a></div>
      <div class="news-grid">${latest.map((n, i) => newsCard(n, i === 0 ? 'news-card--big' : '', i)).join('')}</div>
    </div></section>

    ${contactsBlock()}`;
  }

  function specCard(sp, i = 0) {
    const budget = factVal(sp, 'бюджет'), cost = factVal(sp, 'стоимост');
    return `<a class="spec-card reveal reveal-d${i % 3 + 1}" href="#/abitur/specialties/${esc(sp.code)}/">
      <span class="spec-card__icon">${specAnim(sp.code)}</span>
      <span class="spec-card__code">${esc(sp.code)}</span><h3>${esc(sp.name)}</h3><div class="spec-card__forms">${esc(sp.forms || sp.modes.join(', '))}</div>
      <div class="spec-card__facts"><div><b>${esc(budget || '—')}</b><span>бюджетных мест</span></div><div><b>${esc(cost || '—')}</b><span>за семестр (платно)</span></div></div></a>`;
  }
  function newsCard(n, cls = '', i = 0) {
    return `<a class="news-card ${cls} reveal reveal-d${i % 3 + 1}" href="#/news/${encodeURIComponent(n.slug)}/">
      <div class="news-card__img">${n.image ? `<img src="${esc(n.image)}" alt="" loading="lazy">` : ''}</div>
      <div class="news-card__body"><div class="news-card__meta">${ic('clock')} ${fmtDate(n.date)} ${(n.tags || []).map(t => `<span class="tag">#${esc(t)}</span>`).join('')}</div><h3>${esc(n.title)}</h3></div></a>`;
  }

  function contactsBlock() {
    const s = D.site;
    return `<section class="section section--soft" id="contacts"><div class="container">
      <div class="section__head reveal"><div><span class="eyebrow">Связь</span><h2>Контакты и обратная связь</h2></div></div>
      <div class="contact-grid">
        <div class="card reveal">
          <div class="seg" id="formSeg" role="group" aria-label="Тип обращения"><button type="button" class="active" data-f="question" aria-pressed="true">Задать вопрос</button><button type="button" data-f="apply" aria-pressed="false">Заявка на обучение</button></div>
          <form class="form-grid" id="feedback">
            <div class="two"><input class="input" name="name" placeholder="Ваше имя *" required><input class="input" name="email" type="email" placeholder="Электронная почта *" required></div>
            <div class="fold" data-apply-wrap><div class="fold__in"><input class="input" name="phone" type="tel" placeholder="Телефон *" data-apply disabled></div></div>
            <textarea class="textarea" name="message" placeholder="Ваш вопрос"></textarea>
            <label class="check"><input type="checkbox" required> <span>Нажимая на кнопку «Отправить», вы даете согласие на <a${aAttrs(s.privacyUrl)}>обработку своих персональных данных</a></span></label>
            <button class="btn btn-primary" style="justify-self:start">${ic('send')} Отправить</button>
          </form>
          <div style="margin-top:18px;display:flex;gap:10px;align-items:center;flex-wrap:wrap"><a class="btn btn-sm"${aAttrs(s.chatbot.url)}>${ic('spark')} ${esc(s.chatbot.label)}</a></div>
        </div>
        <div class="card reveal reveal-d2" style="display:flex;flex-direction:column;gap:16px">
          ${admissionCard()}
          <div>
            <div class="contact-line"><span class="ic">${ic('pin')}</span><div><small>Колледж — здесь проходит обучение</small><b>${esc(s.address)}</b></div></div>
            ${s.phones.map(p => `<div class="contact-line"><span class="ic">${ic('phone')}</span><div><small>${esc(p.label)}</small><a href="tel:${p.number.replace(/[^\d+]/g, '')}">${esc(p.number)}</a></div></div>`).join('')}
            <div class="contact-line"><span class="ic">${ic('mail')}</span><div><small>Электронная почта</small><a href="mailto:${esc(s.email)}">${esc(s.email)}</a></div></div>
          </div>
          ${admOn() ? `<div class="seg" id="mapSeg" style="margin:0"><button class="active" data-map="${esc(s.admission.mapQuery || s.admission.address)}">Приёмная комиссия</button><button data-map="${esc(s.mapQuery || s.address)}">Колледж</button></div>` : ''}
          <div class="map" style="flex:1"><iframe id="mapFrame" loading="lazy" title="Где мы находимся" src="https://yandex.ru/map-widget/v1/?text=${encodeURIComponent(admOn() ? (s.admission.mapQuery || s.admission.address) : (s.mapQuery || s.address))}&z=16"></iframe></div>
        </div>
      </div></div></section>`;
  }

  const admOn = () => D.site.admission && D.site.admission.enabled !== false && D.site.admission.address;
  const tel = n => n.replace(/[^\d+]/g, '');
  function admissionCard() {
    if (!admOn()) return '';
    const a = D.site.admission;
    return `<div class="adm-card"><div class="adm-card__head">${ic('pin')}<div><b>${esc(a.title || 'Приёмная комиссия')}</b>${a.note ? `<small>${esc(a.note)}</small>` : ''}</div></div>
      <div class="adm-card__addr">${esc(a.address)}</div>${a.route ? `<div class="adm-card__row">${esc(a.route)}</div>` : ''}
      <div class="adm-card__grid">
        ${(a.phones || []).length ? `<div><small>Телефоны</small>${a.phones.map(p => `<a href="tel:${tel(p)}">${esc(p)}</a>`).join('')}</div>` : ''}
        ${a.email ? `<div><small>Почта</small><a href="mailto:${esc(a.email)}">${esc(a.email)}</a></div>` : ''}
        ${a.hours ? `<div><small>Часы работы</small><span>${esc(a.hours)}</span></div>` : ''}
      </div></div>`;
  }

  // ---------------- разделы ----------------
  function viewSection(sec) {
    return `${pageHero(sec.title, [])}
    <div class="container"><div class="page-layout page-layout--wide">
      ${sec.intro ? `<div class="prose reveal">${sec.intro}</div>` : ''}
      <div class="spec-grid">${sec.items.map((it, i) => {
        const pg = it.route && D.pages[it.route];
        const desc = pg ? stripHtml(pg.html).slice(0, 120) : (it.route === '/abitur/specialties/' ? D.specialties.length + ' специальностей' : it.route === '/news/' ? D.news.length + ' новостей' : it.url ? 'Внешний ресурс' : '');
        return `<a class="spec-card reveal reveal-d${i % 3 + 1}" style="min-height:0"${aAttrs(linkOf(it))}><span class="spec-card__icon">${ic(iconFor(it.title))}</span><h3 style="padding-right:50px">${esc(it.title)}</h3><p class="muted" style="font-size:.88rem;margin:0">${esc(desc)}${desc.length >= 120 ? '…' : ''}</p></a>`;
      }).join('')}</div>
    </div></div>`;
  }

  function pageHero(title, crumbs) {
    return `<header class="page-hero">${brandPattern(4, 2, seedOf(title))}<div class="container"><nav class="crumbs" aria-label="Хлебные крошки"><a href="#/">Главная</a>${crumbs.map(c => `<span class="sep">/</span>${c.href ? `<a href="${esc(c.href)}">${esc(c.title)}</a>` : `<span>${esc(c.title)}</span>`}`).join('')}</nav><h1>${esc(title)}</h1></div></header>`;
  }
  function sideNav(sec, path) {
    if (!sec || !sec.items.length) return '';
    return `<aside class="side"><div class="side__title">${esc(sec.title)}</div>${sec.items.map(it => `<a${aAttrs(linkOf(it))} class="${it.route === path ? 'active' : ''}"><span class="side__txt">${esc(it.title)}</span>${it.url ? ic('ext', 'ext') : ''}</a>`).join('')}</aside>`;
  }

  // ---------------- обычная страница (с авто-вкладками) ----------------
  function splitSections(html) {
    const box = document.createElement('div'); box.innerHTML = html;
    const kids = [...box.childNodes];
    const count = lvl => box.querySelectorAll(':scope > ' + lvl).length;
    const lvl = count('h2') >= 3 ? 'H2' : count('h3') >= 3 ? 'H3' : null;
    if (!lvl) return null;
    const intro = document.createElement('div'); const parts = [];
    let cur = null;
    kids.forEach(n => {
      if (n.nodeType === 1 && n.tagName === lvl) { cur = { title: n.textContent.trim(), body: document.createElement('div') }; parts.push(cur); }
      else (cur ? cur.body : intro).appendChild(n.cloneNode(true));
    });
    return { intro: intro.innerHTML.trim(), parts: parts.map(p => ({ title: p.title, html: p.body.innerHTML })) };
  }

  function viewPage(path, pg, q) {
    const sec = sectionOf(path) || D.sections.find(s => s.id === pg.section);
    const crumbs = sec && sec.route !== path ? [{ title: sec.title, href: '#' + sec.route }, { title: pg.title }] : [{ title: pg.title }];
    let body = pg.html || '';
    const textLen = stripHtml(body).length;
    const layout = pg.layout || 'auto';
    const split = (layout === 'tabs' || layout === 'accordion' || (layout === 'auto' && textLen > 3500)) ? splitSections(body) : null;
    if (split && split.parts.length >= 3) {
      if (layout === 'accordion') {
        body = `${split.intro ? `<div>${split.intro}</div>` : ''}${split.parts.map((p, i) => `<details class="acc" ${i === 0 ? 'open' : ''}><summary>${esc(p.title)}</summary><div class="acc__body">${p.html}</div></details>`).join('')}`;
      } else {
        body = `${split.intro ? `<div>${split.intro}</div>` : ''}
        <div class="toc-note">${ic('info')} Страница разделена на вкладки для удобства. <button class="btn btn-sm btn-ghost" id="showAll">Показать всё одной страницей</button></div>
        <div class="tabs" role="tablist">${split.parts.map((p, i) => `<button role="tab" data-t="${i}" class="${i === 0 ? 'active' : ''}">${esc(p.title.length > 42 ? p.title.slice(0, 40) + '…' : p.title)}</button>`).join('')}</div>
        ${split.parts.map((p, i) => `<section class="tab-panel" data-p="${i}" ${i ? 'hidden' : ''}><h2>${esc(p.title)}</h2>${p.html}</section>`).join('')}`;
      }
    }
    const extra = path === '/abitur/contacts/' ? contactsBlock() : '';
    return `${pageHero(pg.title, crumbs)}
      <div class="container"><div class="page-layout ${sec && sec.items.length ? '' : 'page-layout--wide'}">${sideNav(sec, path)}<article class="prose" id="prose">${body || '<p class="muted">Раздел пока пуст.</p>'}</article></div></div>${extra}`;
  }

  // ---------------- специальности ----------------
  function viewSpecialties(q) {
    const sec = sectionOf('/abitur/specialties/');
    const forms = ['Все', 'Очная', 'Очно-заочная', 'Заочная'];
    return `${pageHero('Специальности', [{ title: sec.title, href: '#' + sec.route }, { title: 'Специальности' }])}
      <div class="container" style="padding:36px 24px 80px">
        <div style="display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;align-items:center;margin-bottom:8px">
          <div class="filters" id="specFilters">${forms.map((f, i) => `<button class="chip ${i ? '' : 'active'}" data-f="${f}">${f}</button>`).join('')}</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap"><a class="btn" href="#/quiz/">${ic('quiz')} Подобрать по интересам</a><a class="btn" href="#/abitur/specialties/compare/">${ic('compare')} Сравнить все</a></div>
        </div>
        <div class="spec-grid" id="specGrid">${D.specialties.map((sp, i) => specCard(sp, i)).join('')}</div>
      </div>`;
  }

  function viewSpecialty(sp) {
    const sec = sectionOf('/abitur/specialties/');
    const hasModes = sp.modes.length > 1 && sp.facts.some(f => f.values.length > 1);
    return `<header class="spec-hero">${pcbTraces('left', seedOf(sp.code))}${pcbTraces('right', seedOf(sp.code) + 7)}<div class="spec-hero__ic" aria-hidden="true">${specAnim(sp.code)}</div><div class="container">
        <nav class="crumbs"><a href="#/">Главная</a><span class="sep">/</span><a href="#${sec.route}">${esc(sec.title)}</a><span class="sep">/</span><a href="#/abitur/specialties/">Специальности</a></nav>
        <div class="spec-hero__code">${esc(sp.code)}</div><h1 class="${sp.name.length > 48 ? 'is-long' : ''}">${esc(sp.name)}</h1>
        ${hasModes ? `<div><small style="opacity:.8">Форма обучения:</small><br><div class="mode-switch" id="modeSwitch">${sp.modes.map((m, i) => `<button data-m="${i}" class="${i ? '' : 'active'}">${esc(m)}</button>`).join('')}</div></div>` : `<p style="opacity:.85">Форма обучения: ${esc(sp.modes.join(', '))}</p>`}
        ${sp.base ? `<p style="opacity:.85;margin-top:12px">${sp.base}</p>` : ''}
        <div style="height:30px"></div></div></header>
      <div class="container">
        <div class="facts" id="facts">${sp.facts.map(f => `<div class="fact reveal"><span>${esc(f.label)}</span><b data-vals='${esc(JSON.stringify(f.values))}'>${f.values[0] || '—'}</b></div>`).join('')}</div>
        <div class="page-layout">
          <aside class="side"><div class="side__title">Специальности</div>${D.specialties.map(s => `<a href="#/abitur/specialties/${esc(s.code)}/" class="side-spec ${s === sp ? 'active' : ''}"><b class="side-code">${esc(s.code)}</b><span class="side__txt">${esc(s.name)}</span></a>`).join('')}</aside>
          <article class="prose" id="prose">${sp.html}
            <div class="card" style="margin-top:32px;background:var(--grad-soft)"><h3 style="margin-top:0">Хотите поступить на эту специальность?</h3><p>Оставьте заявку — приёмная комиссия свяжется с вами.</p>
            <div style="display:flex;gap:10px;flex-wrap:wrap"><a class="btn btn-primary" href="#/abitur/documents_for_admission/" style="text-decoration:none">${ic('file')} Документы для поступления</a><button class="btn" data-apply-for="${esc(sp.code + ' ' + sp.name)}">${ic('send')} Оставить заявку</button></div></div>
          </article>
        </div></div>${contactsBlock()}`;
  }

  function viewCompare() {
    const labels = [...new Set(D.specialties.flatMap(s => s.facts.map(f => f.label)))];
    return `${pageHero('Сравнение специальностей', [{ title: 'Абитуриенту', href: '#/abitur/' }, { title: 'Специальности', href: '#/abitur/specialties/' }, { title: 'Сравнение' }])}
      <div class="container" style="padding:36px 24px 80px"><p class="muted">Все данные взяты со страниц специальностей. Если у специальности несколько форм обучения, значения указаны через «/».</p>
      <div class="compare reveal"><table><thead><tr><th></th>${D.specialties.map(s => `<td><a href="#/abitur/specialties/${esc(s.code)}/">${esc(s.code)}</a><div style="font-weight:600;font-size:.82rem;color:var(--muted)">${esc(s.name)}</div></td>`).join('')}</tr></thead><tbody>
      <tr><th>Формы обучения</th>${D.specialties.map(s => `<td>${esc(s.modes.join(' / '))}</td>`).join('')}</tr>
      ${labels.map(l => `<tr><th>${esc(l)}</th>${D.specialties.map(s => { const f = s.facts.find(x => x.label === l); return `<td>${f ? f.values.map(v => v || '—').join(' / ') : '—'}</td>`; }).join('')}</tr>`).join('')}
      </tbody></table></div></div>`;
  }

  // ---------------- квиз «Подбор специальности» ----------------
  const DEFAULT_QUIZ = [
    { q: 'Что вам интереснее всего?', o: [['💻', 'Писать программы и создавать приложения', { '09.02.11': 3, '09.02.13': 2 }], ['🌐', 'Разбираться, как устроены сети и серверы', { '09.02.06': 3, '11.02.15': 2 }], ['📡', 'Радио, мобильная связь, телевидение', { '11.02.18': 3, '11.02.15': 1 }], ['📊', 'Цифры, финансы, учёт', { '38.02.01': 3 }], ['🎨', 'Креатив, тексты, дизайн, продвижение', { '42.02.01': 3 }]] },
    { q: 'Какие школьные предметы вам нравятся?', o: [['🧮', 'Математика и информатика', { '09.02.11': 2, '09.02.13': 2, '38.02.01': 1 }], ['⚡', 'Физика', { '11.02.15': 2, '11.02.18': 2, '09.02.06': 1 }], ['📚', 'Литература, обществознание', { '42.02.01': 2, '38.02.01': 1 }], ['🔐', 'Люблю головоломки и логику', { '10.02.04': 2, '09.02.13': 1, '09.02.11': 1 }]] },
    { q: 'Что вам ближе в работе?', o: [['🛠️', 'Работать руками с оборудованием', { '11.02.15': 2, '11.02.18': 2, '09.02.06': 2 }], ['🧠', 'Решать сложные задачи за компьютером', { '09.02.11': 2, '09.02.13': 2, '10.02.04': 1 }], ['🤝', 'Общаться с людьми и командой', { '42.02.01': 2, '38.02.01': 1 }], ['📋', 'Аккуратность, порядок, документы', { '38.02.01': 2, '10.02.04': 1 }]] },
    { q: 'Какая тема звучит круче всего?', o: [['🤖', 'Искусственный интеллект и нейросети', { '09.02.13': 3 }], ['🛡️', 'Защита от хакеров и кибербезопасность', { '10.02.04': 3 }], ['☁️', 'Облака, виртуализация, DevOps', { '09.02.06': 2, '09.02.11': 1 }], ['📢', 'Реклама и соцсети', { '42.02.01': 3 }], ['🏦', 'Экономика компаний и банков', { '38.02.01': 3 }]] },
    { q: 'Где вы видите себя после колледжа?', o: [['🏢', 'В IT-компании', { '09.02.11': 2, '09.02.13': 2, '09.02.06': 1 }], ['📶', 'У оператора связи или в дата-центре', { '11.02.15': 2, '09.02.06': 2, '11.02.18': 1 }], ['🎬', 'На телевидении, радио или в медиа', { '11.02.18': 2, '42.02.01': 2 }], ['💼', 'В бухгалтерии или финансовом отделе', { '38.02.01': 3 }], ['🔒', 'В службе информационной безопасности', { '10.02.04': 3 }]] },
    { q: 'Как вам комфортнее учиться?', o: [['🏫', 'Очно — каждый день в колледже', {}], ['🌙', 'Очно-заочно — совмещать с работой', { '09.02.06': 1, '09.02.11': 1 }], ['📮', 'Заочно', { '11.02.15': 1 }]] },
  ];
  const quizQ = () => (D.quiz && D.quiz.length) ? D.quiz : DEFAULT_QUIZ;
  let quizState = null, quizPending = null, quizKeysBound = false;
  const quizReset = () => ({ i: 0, scores: {}, hist: [] });
  const RM = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Блок на главной: первый вопрос теста прямо в баннере — ответ сразу переносит на второй вопрос
  function ctaQuizCard() {
    const Q = quizQ(), q = Q[0]; if (!q) return '';
    return `<div class="cta-quiz" id="ctaQuiz">
      <div class="cta-quiz__head"><span>Вопрос 1 из ${Q.length}</span><span class="cta-quiz__bar"><i style="width:${Math.round(100 / Q.length)}%"></i></span></div>
      <h3>${esc(q.q)}</h3>
      <div class="cta-quiz__opts">${q.o.map((o, k) => `<button type="button" data-k="${k}"><span class="em" aria-hidden="true">${o[0]}</span><span class="tx">${esc(o[1])}</span>${ic('arrow')}</button>`).join('')}</div>
    </div>`;
  }
  function bindCtaQuiz() {
    $$('#ctaQuiz button').forEach(b => b.onclick = () => {
      b.classList.add('picked');
      quizPending = +b.dataset.k;
      setTimeout(() => { location.hash = '#/quiz/'; }, RM() ? 0 : 260);
    });
  }

  function viewQuiz() {
    quizState = quizReset();
    return `${pageHero('Подбор специальности', [{ title: 'Абитуриенту', href: '#/abitur/' }, { title: 'Тест' }])}<div class="container"><div class="quiz" id="quiz" aria-live="polite"></div></div><div id="quizContacts"></div>`;
  }
  function quizAnswer(k) {
    const q = quizQ()[quizState.i]; if (!q || !q.o[k]) return;
    const sc = q.o[k][2] || {};
    for (const c in sc) quizState.scores[c] = (quizState.scores[c] || 0) + sc[c];
    quizState.hist.push(k); quizState.i++;
  }
  function quizBack() {
    if (!quizState.hist.length) return;
    quizState.i--; const k = quizState.hist.pop();
    const sc = (quizQ()[quizState.i].o[k] || [])[2] || {};
    for (const c in sc) quizState.scores[c] -= sc[c];
  }
  // смена экрана теста: старый вопрос уезжает, новый въезжает (назад — в обратную сторону)
  function quizGo(fn, dir) {
    const box = $('#quiz'), cur = box && $('.quiz__q', box);
    if (!cur || RM()) { fn(); renderQuiz(dir); return; }
    if (box.dataset.busy) return; box.dataset.busy = '1';
    cur.classList.add(dir === 'back' ? 'q-out-back' : 'q-out');
    setTimeout(() => { delete box.dataset.busy; fn(); renderQuiz(dir); }, 230);
  }
  function renderQuiz(dir) {
    const box = $('#quiz'); if (!box) return;
    const Q = quizQ();
    if (quizPending != null && quizState.i === 0) { quizAnswer(quizPending); dir = 'fwd'; }
    quizPending = null;
    if (!quizKeysBound) {                // 1–9 — выбрать ответ, Backspace — назад
      quizKeysBound = true;
      addEventListener('keydown', e => {
        if (!$('#quiz .quiz__opts') || /input|textarea|select/i.test((e.target.tagName || '')) || e.ctrlKey || e.metaKey || e.altKey) return;
        const n = parseInt(e.key, 10);
        if (n >= 1) { const b = $(`#quiz .quiz__opt[data-k="${n - 1}"]`); if (b) { e.preventDefault(); b.click(); } }
        else if (e.key === 'Backspace' && quizState.hist.length) { e.preventDefault(); quizGo(quizBack, 'back'); }
      });
    }
    const inCls = dir === 'back' ? ' q-in-back' : dir ? ' q-in' : '';
    const pct = Math.round(quizState.i / Q.length * 100);
    if (quizState.i >= Q.length) { renderQuizResult(box, Q, inCls); return; }
    const q = Q[quizState.i];
    box.innerHTML = `<div class="quiz__top"><div class="quiz__progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}"><i style="width:${pct}%"></i></div>
        <div class="quiz__steps">${Q.map((_, k) => `<i class="${k < quizState.i ? 'done' : k === quizState.i ? 'cur' : ''}"></i>`).join('')}</div></div>
      <div class="quiz__q${inCls}"><div class="quiz__meta"><span class="eyebrow">Вопрос ${quizState.i + 1} из ${Q.length}</span>${quizState.hist.length ? `<button type="button" class="quiz__back" id="quizBack">← Назад</button>` : ''}</div>
      <h2>${esc(q.q)}</h2>
      <div class="quiz__opts">${q.o.map((o, k) => `<button type="button" class="quiz__opt" data-k="${k}" style="--d:${k * 45}ms"><span class="em" aria-hidden="true">${o[0]}</span><span class="tx">${esc(o[1])}</span>${k < 9 ? `<kbd aria-hidden="true">${k + 1}</kbd>` : ''}</button>`).join('')}</div>
      <p class="quiz__hint muted">Можно отвечать цифрами на клавиатуре.</p></div>`;
    $$('.quiz__opt', box).forEach(b => b.onclick = () => {
      if (box.dataset.busy) return;
      $$('.quiz__opt', box).forEach(x => x.classList.toggle('picked', x === b));
      const k = +b.dataset.k;
      setTimeout(() => quizGo(() => quizAnswer(k), 'fwd'), RM() ? 0 : 160);
    });
    const back = $('#quizBack'); if (back) back.onclick = () => quizGo(quizBack, 'back');
    const qc = $('#quizContacts'); if (qc && qc.innerHTML) qc.innerHTML = '';
  }
  function renderQuizResult(box, Q, inCls) {
    // максимум баллов, который могла набрать каждая специальность, — чтобы «совпадение» было честным
    const possible = {};
    Q.forEach(q => { const best = {}; q.o.forEach(o => { const sc = o[2] || {}; for (const c in sc) best[c] = Math.max(best[c] || 0, sc[c]); }); for (const c in best) possible[c] = (possible[c] || 0) + best[c]; });
    const ranked = D.specialties.map(sp => {
      const s = quizState.scores[sp.code] || 0;
      return { sp, s, pct: possible[sp.code] ? Math.min(100, Math.round(s / possible[sp.code] * 100)) : 0 };
    }).sort((a, b) => b.s - a.s || b.pct - a.pct).slice(0, 3);
    box.innerHTML = `<div class="quiz__top"><div class="quiz__progress"><i style="width:100%"></i></div><div class="quiz__steps">${Q.map(() => '<i class="done"></i>').join('')}</div></div>
      <div class="quiz__q${inCls}"><div class="quiz__meta"><span class="eyebrow">Результат</span><button type="button" class="quiz__back" id="quizBack">← Изменить ответ</button></div>
      <h2>Вам могут подойти</h2>
      <div class="quiz-result">${ranked.map((r, i) => `<div class="qr${i === 0 ? ' qr--top' : ''}" style="--d:${i * 90}ms">
          ${i === 0 ? '<span class="qr__badge">Лучшее совпадение</span>' : ''}
          ${specCard(r.sp, i).replace('</a>', `<div class="match" aria-hidden="true"><i style="--w:${r.pct}%"></i></div><small class="muted">Совпадение с вашими ответами: <b>${r.pct}%</b></small></a>`)}
          <div class="qr__acts"><button type="button" class="btn btn-sm btn-primary" data-quiz-apply="${esc(r.sp.code + ' ' + r.sp.name)}">${ic('send')} Оставить заявку</button><button type="button" class="btn btn-sm" data-quiz-ask="${esc(r.sp.name)}">${ic('spark')} Спросить помощника</button></div>
        </div>`).join('')}</div>
      <p class="muted" style="margin-top:20px">Тест — только подсказка. Подробности о каждой специальности — на её странице, а ответы на вопросы даст приёмная комиссия.</p>
      <div style="display:flex;gap:10px;flex-wrap:wrap"><button type="button" class="btn" id="quizAgain">Пройти заново</button><a class="btn btn-primary" href="#/abitur/specialties/compare/">${ic('compare')} Сравнить специальности</a></div></div>`;
    $('#quizAgain').onclick = () => quizGo(() => { quizState = quizReset(); }, 'back');
    $('#quizBack').onclick = () => quizGo(quizBack, 'back');
    // полосы совпадения заполняются после появления
    setTimeout(() => $$('.qr .match i', box).forEach(el => { el.style.width = el.style.getPropertyValue('--w'); }), 60);
    // форма заявки — прямо под результатом
    const qc = $('#quizContacts');
    $$('.qr .reveal', box).forEach(el => el.classList.add('in'));   // карточки появляются своей анимацией .qr
    if (qc && !qc.innerHTML) { qc.innerHTML = contactsBlock(); bindForms(); }
    observeReveal();
    $$('[data-quiz-apply]', box).forEach(b => b.onclick = () => {
      const seg = $('#formSeg button[data-f="apply"]'); if (seg) seg.click();
      const ta = $('#feedback textarea'); if (ta) ta.value = 'Хочу поступить на специальность ' + b.dataset.quizApply;
      const c = $('#contacts'); if (c) c.scrollIntoView({ behavior: 'smooth' });
    });
    $$('[data-quiz-ask]', box).forEach(b => b.onclick = () => openAI('Расскажи о специальности ' + b.dataset.quizAsk));
  }

  // ---------------- новости ----------------
  function viewNews(q) {
    const tag = q.get('tag') || '';
    const tags = D.newsTags && D.newsTags.length ? D.newsTags : [...new Set(D.news.flatMap(n => n.tags || []))];
    return `${pageHero('Новости', [{ title: 'Медиа-рум', href: '#/media-room/' }, { title: 'Новости' }])}
      <div class="container"><div class="news-layout">
        <aside><div class="side"><div class="side__title">Разделы</div><a href="#/news/" class="${tag ? '' : 'active'}">Все новости</a>${tags.map(t => `<a href="#/news/?tag=${encodeURIComponent(t)}" class="${t === tag ? 'active' : ''}">${esc(t)}</a>`).join('')}</div></aside>
        <div><input class="input" id="newsFilter" placeholder="Найти в новостях…" style="margin-bottom:20px"><div class="news-list" id="newsList"></div><div style="text-align:center;margin-top:28px"><button class="btn" id="moreNews">Показать ещё</button></div></div>
      </div></div>`;
  }
  function bindNews(q) {
    const tag = q.get('tag') || '';
    let list = D.news.slice().sort((a, b) => b.date.localeCompare(a.date)).filter(n => !tag || (n.tags || []).includes(tag));
    let shown = 12, filter = '';
    const draw = () => {
      const f = norm(filter);
      const arr = f ? list.filter(n => norm(n.title + ' ' + stripHtml(n.html)).includes(f)) : list;
      $('#newsList').innerHTML = arr.slice(0, shown).map((n, i) => newsCard(n, '', i)).join('') || `<div class="empty">Новостей не найдено</div>`;
      $('#moreNews').hidden = arr.length <= shown;
      observeReveal();
    };
    $('#moreNews').onclick = () => { shown += 12; draw(); };
    $('#newsFilter').oninput = e => { filter = e.target.value; shown = 12; draw(); };
    draw();
  }
  function viewNewsItem(n) {
    const sorted = D.news.slice().sort((a, b) => b.date.localeCompare(a.date));
    const i = sorted.indexOf(n); const prev = sorted[i + 1], next = sorted[i - 1];
    return `${pageHero(n.title, [{ title: 'Медиа-рум', href: '#/media-room/' }, { title: 'Новости', href: '#/news/' }])}
      <div class="container"><article class="news-article">
        <div class="news-article__meta">${ic('calendar')} ${fmtDate(n.date)} ${(n.tags || []).map(t => `<a class="tag" href="#/news/?tag=${encodeURIComponent(t)}">#${esc(t)}</a>`).join('')}</div>
        <div class="prose" id="prose">${n.html}</div>
        <div style="display:flex;justify-content:space-between;gap:12px;margin-top:40px;flex-wrap:wrap">${prev ? `<a class="btn" href="#/news/${encodeURIComponent(prev.slug)}/">${ic('left')} Предыдущая</a>` : '<span></span>'}${next ? `<a class="btn" href="#/news/${encodeURIComponent(next.slug)}/">Следующая ${ic('right')}</a>` : ''}</div>
      </article></div>`;
  }

  function notFound(path) {
    return `${pageHero('Страница не найдена', [])}<div class="container" style="padding:40px 24px 80px"><p>Страницы <code>${esc(path)}</code> нет. Попробуйте поиск — он понимает вопросы обычными словами.</p><button class="btn btn-primary" onclick="window.KT.openSearch()">${ic('search')} Открыть поиск</button></div>`;
  }

  // ---------------- после отрисовки ----------------
  function after(path, q) {
    enhanceProse();
    observeReveal();
    watchAnimations();
    const act = $('.side a.active'); if (act && innerWidth < 760) act.parentElement.scrollLeft = act.offsetLeft - 16;
    if (path === '/') { bindHome(); bindCtaQuiz(); }
    if (path === '/news/') bindNews(q);
    if (path === '/quiz/') renderQuiz();
    bindForms();
    // вкладки
    $$('.tabs button').forEach(b => b.onclick = () => activateTab(+b.dataset.t));
    const sa = $('#showAll'); if (sa) sa.onclick = () => { $$('.tab-panel').forEach(p => p.hidden = false); $('.tabs').remove(); sa.parentElement.remove(); };
    // фильтр специальностей
    $$('#specFilters .chip').forEach(c => c.onclick = () => {
      $$('#specFilters .chip').forEach(x => x.classList.toggle('active', x === c));
      const f = norm(c.dataset.f);
      $$('#specGrid .spec-card').forEach((card, i) => { const sp = D.specialties[i]; const forms = norm((sp.forms || '') + ' ' + sp.modes.join(' ')).replace('очно-заочн', 'очная-заочн'); const ok = f === 'все' || (f === 'очная' ? /очн(ая|о)(?!-)/.test(forms) || forms.startsWith('очн') : f === 'очно-заочная' ? /очн(ая|о)-заочн/.test(forms) : /(^|\s|и )заочн/.test(forms)); card.style.display = ok ? '' : 'none'; });
    });
    // переключатель формы обучения
    // тумблер формы обучения: «таблетка» плавно скользит, цифры в карточках мягко сменяются
    const ms = $('#modeSwitch');
    if (ms) {
      const moveThumb = sliderThumb(ms);
      $$('button', ms).forEach(b => b.onclick = () => {
        if (b.classList.contains('active')) return;
        $$('button', ms).forEach(x => { x.classList.toggle('active', x === b); x.setAttribute('aria-pressed', x === b); });
        moveThumb(b);
        const m = +b.dataset.m;
        $$('#facts b[data-vals]').forEach((el, k) => {
          const v = JSON.parse(el.dataset.vals); const nv = (v[m] == null ? v[0] : v[m]) || '—';
          if (el.innerHTML === nv) return;
          setTimeout(() => {                      // небольшая «волна» по карточкам
            el.classList.add('val-out');
            setTimeout(() => {
              el.innerHTML = nv;
              el.classList.remove('val-out'); el.classList.add('val-from');
              void el.offsetWidth;
              el.classList.remove('val-from');
            }, 260);
          }, k * 45);
        });
      });
    }
    $$('[data-apply-for]').forEach(b => b.onclick = () => { const seg = $('#formSeg button[data-f="apply"]'); seg && seg.click(); const ta = $('#feedback textarea'); if (ta) ta.value = 'Хочу поступить на специальность ' + b.dataset.applyFor; $('#contacts').scrollIntoView({ behavior: 'smooth' }); });
    // подсветка найденного (переход из поиска)
    const term = q.get('q');
    if (term) highlightTerm(term);
  }

  // Скользящая подложка для переключателя из кнопок (тумблер). Возвращает функцию «переехать к кнопке».
  function sliderThumb(box) {
    box.classList.add('has-thumb');
    const thumb = document.createElement('span'); thumb.className = 'sw-thumb'; thumb.setAttribute('aria-hidden', 'true');
    box.prepend(thumb);
    const place = (btn, instant) => {
      if (!btn) return;
      if (instant) thumb.style.transition = 'none';
      thumb.style.width = btn.offsetWidth + 'px'; thumb.style.height = btn.offsetHeight + 'px';
      thumb.style.transform = `translate(${btn.offsetLeft}px, ${btn.offsetTop}px)`;
      if (instant) { void thumb.offsetWidth; thumb.style.transition = ''; }
    };
    const active = () => $('button.active', box);
    place(active(), true);
    // шрифт мог догрузиться позже, а окно — изменить размер: пересчитываем без анимации
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => place(active(), true));
    addEventListener('resize', () => { if (box.isConnected) place(active(), true); });
    return btn => place(btn, false);
  }

  function activateTab(i) {
    $$('.tabs button').forEach(b => b.classList.toggle('active', +b.dataset.t === i));
    $$('.tab-panel').forEach(p => p.hidden = +p.dataset.p !== i);
  }

  function highlightTerm(term) {
    const prose = $('#prose'); if (!prose) return;
    const words = tokens(term).map(stem).filter(w => w.length > 2);
    if (!words.length) return;
    const walker = document.createTreeWalker(prose, NodeFilter.SHOW_TEXT);
    let node, target = null;
    while ((node = walker.nextNode())) { const t = norm(node.textContent); if (words.some(w => t.includes(w))) { target = node; break; } }
    if (!target) return;
    const panel = target.parentElement.closest('.tab-panel'); if (panel) activateTab(+panel.dataset.p);
    const el = target.parentElement;
    el.style.transition = 'background .6s'; el.style.background = 'color-mix(in srgb, var(--accent) 25%, transparent)'; el.style.borderRadius = '6px';
    setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 250);
    setTimeout(() => { el.style.background = ''; }, 3500);
  }

  // документы: значки PDF/DOC, галереи: лайтбокс
  function enhanceProse() {
    $$('.prose a[href]').forEach(a => {
      const href = a.getAttribute('href');
      // значок-документ со старого сайта (огромный SVG без размеров) заменяем компактной карточкой
      a.querySelectorAll('img[src*="icon-document"], img[src*="/assets/img/svg/"]').forEach(i => i.remove());
      if (!a.querySelector('img') && /\/upload\/iblock\//.test(href) && !/\.(jpe?g|png|gif|webp|jfif|svg)(\?|$)/i.test(href) && !a.classList.contains('doc')) {
        if (!/\.\w{2,5}(\?|$)/.test(href)) a.setAttribute('data-ext', 'file');
      }
      const m = href.match(/\.(pdf|docx?|xlsx?|pptx?|zip|rar|rtf|odt)(\?|$)/i);
      if (m && !a.querySelector('img') && !a.classList.contains('doc')) {
        const ext = m[1].toLowerCase(); const cls = ext === 'pdf' ? '' : ext.startsWith('doc') || ext === 'rtf' || ext === 'odt' ? 'doc-word' : ext.startsWith('xls') ? 'doc-xls' : 'doc-other';
        a.classList.add('doc'); a.setAttribute('target', '_blank');
        a.innerHTML = `<span class="badge ${cls}">${ext.toUpperCase()}</span><span>${a.innerHTML}</span>${ic('download', 'dl')}`;
      }
    });
    // несколько документов подряд — компактная сетка (проще листать до нужного файла)
    $$('.prose').forEach(pr => {
      const parents = new Set($$('a.doc', pr).map(a => a.parentElement));
      parents.forEach(p => { if (p && p.querySelectorAll(':scope > a.doc').length >= 2) p.classList.add('doc-grid'); });
      // списки документов — сетка без опоры на :has() (для старых браузеров)
      $$('ul', pr).forEach(u => { if (u.querySelector(':scope > li > a.doc')) u.classList.add('doc-grid', 'doc-list'); });
      // документы, каждый в своём абзаце/строке — объединяем соседние в одну сетку
      $$('a.doc', pr).forEach(a => {
        const wrap = a.parentElement;
        if (!wrap || !/^(P|DIV)$/.test(wrap.tagName) || wrap.classList.contains('doc-grid') || wrap === pr || wrap.children.length !== 1 || wrap.textContent.trim() !== a.textContent.trim()) return;
        const prev = wrap.previousElementSibling;
        if (prev && prev.classList.contains('doc-grid') && prev.dataset.auto) { prev.appendChild(a); wrap.remove(); }
        else { const g = document.createElement('div'); g.className = 'doc-grid'; g.dataset.auto = '1'; wrap.replaceWith(g); g.appendChild(a); }
      });
    });
    $$('.prose a').forEach(a => { if (/\.(jpe?g|png|gif|webp|jfif)(\?|$)/i.test(a.getAttribute('href') || '')) a.dataset.lb = '1'; });
    $$('.prose img').forEach(img => { if (!img.closest('a')) img.style.cursor = 'zoom-in'; });
  }

  let revealObs;
  function observeReveal() {
    if (!revealObs) revealObs = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); revealObs.unobserve(e.target); } }), { rootMargin: '0px 0px -40px 0px', threshold: 0.05 });
    $$('.reveal:not(.in)').forEach(el => revealObs.observe(el));
  }

  function bindHome() {
    // блок «Анонс» в ряду быстрых ссылок: анонсы (слайды из админки) сменяются по очереди
    const ann = $('#annItem'), slides = D.home.slides || []; let i = 0, timer, paused = false;
    const draw = () => {
      const sl = slides[i];
      $('#annTitle', ann).textContent = sl.title;
      ann.title = sl.text && sl.text !== sl.title ? sl.text : sl.title;
      const link = sl.link || '#/';
      ann.setAttribute('href', link);
      if (isExt(link)) { ann.target = '_blank'; ann.rel = 'noopener'; } else { ann.removeAttribute('target'); ann.removeAttribute('rel'); }
      $$('.ann-dots i', ann).forEach((d, k) => d.classList.toggle('on', k === i));
    };
    const show = n => {
      if (!ann || !ann.isConnected) return clearTimeout(timer);
      i = (n + slides.length) % slides.length;
      // плавная смена в две фазы: старый текст уходит вверх, новый поднимается снизу
      const qa = $('.qa', ann);
      qa.classList.add('ann-out');
      setTimeout(() => {
        draw();
        qa.classList.remove('ann-out'); qa.classList.add('ann-from');
        void qa.offsetWidth;            // зафиксировать стартовое положение
        qa.classList.remove('ann-from');
      }, 420);
      plan();
    };
    const plan = () => { clearTimeout(timer); if (slides.length > 1 && !paused) timer = setTimeout(() => show(i + 1), 6000); };
    if (ann && slides.length) {
      draw(); plan();
      ann.addEventListener('mouseenter', () => { paused = true; clearTimeout(timer); });
      ann.addEventListener('mouseleave', () => { paused = false; plan(); });
      ann.addEventListener('focus', () => { paused = true; clearTimeout(timer); });
      ann.addEventListener('blur', () => { paused = false; plan(); });
    }
    const hs = $('#heroSearch'); hs.onsubmit = e => { e.preventDefault(); const v = hs.q.value.trim(); if (v) openAI(v); };
    // готовые запросы под строкой «Спросите…» отправляются помощнику, как и сама строка
    $$('.hero__chips button').forEach(b => b.onclick = () => openAI(b.dataset.q));
    // счётчики
    $$('[data-count]').forEach(el => { const target = parseInt(el.dataset.count); if (!target || String(target) !== el.dataset.count) return; let start = null; const step = t => { if (start === null) start = t; const p = Math.min(1, (t - start) / 1200); el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); }; requestAnimationFrame(step); });
  }

  // ---------------- формы ----------------
  function bindForms() {
    const ms = $('#mapSeg');
    if (ms && !ms.classList.contains('has-thumb')) {
      const moveMap = sliderThumb(ms);
      ms.onclick = e => { const b = e.target.closest('button'); if (!b || b.classList.contains('active')) return; $$('button', ms).forEach(x => x.classList.toggle('active', x === b)); moveMap(b); $('#mapFrame').src = `https://yandex.ru/map-widget/v1/?text=${encodeURIComponent(b.dataset.map)}&z=16`; };
    }
    const seg = $('#formSeg'); const form = $('#feedback'); if (!form || !seg || seg.classList.contains('has-thumb')) return;
    let type = 'question';
    // тумблер «Задать вопрос / Заявка на обучение»: подложка скользит, поле телефона плавно раскрывается
    const moveSeg = sliderThumb(seg);
    const wrap = $('[data-apply-wrap]', form), ph = $('[data-apply]', form), ta = $('textarea', form);
    seg.onclick = e => {
      const b = e.target.closest('button'); if (!b || b.classList.contains('active')) return;
      type = b.dataset.f;
      $$('button', seg).forEach(x => { x.classList.toggle('active', x === b); x.setAttribute('aria-pressed', x === b); });
      moveSeg(b);
      const apply = type === 'apply';
      wrap.classList.toggle('open', apply);
      ph.disabled = !apply; ph.required = apply;
      ta.classList.add('ph-swap');
      setTimeout(() => { ta.placeholder = apply ? 'Какая специальность интересует? Удобное время для звонка' : 'Ваш вопрос'; ta.classList.remove('ph-swap'); }, 180);
    };
    form.onsubmit = async e => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form)); data.type = type === 'apply' ? 'Заявка на обучение' : 'Вопрос'; data.date = new Date().toISOString(); data.page = location.hash;
      let ok = false;
      try { const r = await fetch('api/request', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); ok = r.ok; } catch { }
      form.outerHTML = ok ? `<div class="form-ok">${ic('send')} Спасибо за обращение, Ваш запрос был успешно отправлен!</div>`
        : `<div class="form-ok" style="color:var(--warn);background:color-mix(in srgb,var(--warn) 12%,transparent)">Это демонстрационная версия сайта — отправка формы отключена. Свяжитесь с приёмной комиссией по телефону +7 (499) 458-84-67.</div>`;
    };
  }

  // =========================================================
  //  УМНЫЙ ПОИСК: морфология «на коленке» + синонимы + ранжирование
  // =========================================================
  const STOP = new Set('и в во на с со по для как что где когда ли а о об у к ко из за же не ни мне меня я мы вы есть это то какие какой какая каких сколько можно нужно ли бы до от при про или также еще уже вас нас ваш наш там тут'.split(' '));
  const tokens = s => norm(s).split(/[^a-zа-я0-9.]+/).filter(w => w && !STOP.has(w));
  const ENDINGS = /(ями|ами|иями|ого|его|ому|ему|ыми|ими|ией|ия|ие|ий|ья|ье|ов|ев|ей|ам|ям|ах|ях|ою|ею|ой|ей|ый|ий|ая|яя|ое|ее|ые|ие|ую|юю|ть|ти|ешь|ет|ем|ете|ут|ют|ит|им|ите|ат|ят|ал|ял|ила|ыла|ена|ено|ены|ать|ять|а|я|о|е|ы|и|у|ю|ь)$/;
  const stem = w => (w.length > 4 ? w.replace(ENDINGS, '') : w);

  function buildIndex() {
    IDX = [];
    const add = (o) => { o.nt = norm(o.title); o.nx = norm(o.text); IDX.push(o); };
    D.sections.forEach(sec => {
      if (sec.items.length) add({ type: 'Разделы', title: sec.title, text: sec.items.map(i => i.title).join(', ') + ' ' + stripHtml(sec.intro), url: '#' + sec.route, icon: iconFor(sec.title) });
      sec.items.filter(i => i.url).forEach(i => add({ type: 'Разделы', title: i.title, text: sec.title + ' — внешний ресурс', url: i.url, icon: iconFor(i.title) }));
    });
    Object.entries(D.pages).forEach(([route, pg]) => {
      add({ type: 'Страницы', title: pg.title, text: stripHtml(pg.html), url: '#' + route, icon: iconFor(pg.title), route });
      const sp = splitSections(pg.html || '');
      if (sp) sp.parts.forEach(p => add({ type: 'Страницы', title: p.title, parent: pg.title, text: stripHtml(p.html), url: '#' + route + '?q=' + encodeURIComponent(p.title), icon: iconFor(pg.title), route, sub: true }));
    });
    D.specialties.forEach(sp => add({ type: 'Специальности', title: `${sp.code} ${sp.name}`, text: sp.facts.map(f => f.label + ': ' + f.values.map(stripHtml).join(' / ')).join('. ') + '. ' + stripHtml(sp.html), url: `#/abitur/specialties/${sp.code}/`, icon: specIcon(sp.code), spec: sp }));
    D.news.forEach(n => add({ type: 'Новости', title: n.title, text: stripHtml(n.html), url: `#/news/${encodeURIComponent(n.slug)}/`, icon: 'news', date: n.date }));
    const s = D.site;
    add({ type: 'Страницы', title: 'Контакты', text: `${s.address}. ${s.phones.map(p => p.label + ' ' + p.number).join('. ')}. ${s.email}`, url: '#/abitur/contacts/', icon: 'phone' });
  }

  function expand(q) {
    let s = norm(q);
    const syn = (D.ai && D.ai.synonyms) || {};
    Object.keys(syn).sort((a, b) => b.length - a.length).forEach(k => { if (s.includes(norm(k))) s += ' ' + norm(syn[k]); });
    return s;
  }

  function search(q, limit = 30) {
    const terms = [...new Set(tokens(expand(q)).map(stem).filter(w => w.length >= 2))];
    if (!terms.length) return [];
    const res = [];
    for (const d of IDX) {
      let score = 0, hit = 0;
      for (const t of terms) {
        const re = new RegExp('(^|[^a-zа-я0-9])' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        const inTitle = (d.nt.match(re) || []).length;
        const inText = Math.min((d.nx.match(re) || []).length, 12);
        if (inTitle || inText) hit++;
        score += inTitle * 12 + inText * (d.sub ? 1.4 : 1);
      }
      if (!hit) continue;
      score *= Math.pow(hit / terms.length, 2) * (d.type === 'Новости' ? 0.55 : 1) * (d.type === 'Специальности' ? 1.2 : 1);
      if (d.type === 'Новости' && d.date) score *= 1 + (Math.max(0, 4 - (2026 - +d.date.slice(0, 4))) * 0.05);
      res.push({ d, score, terms });
    }
    return res.sort((a, b) => b.score - a.score).slice(0, limit);
  }

  function snippet(text, terms, len = 180) {
    const t = norm(text); let pos = -1;
    for (const w of terms) { const p = t.indexOf(w); if (p >= 0 && (pos < 0 || p < pos)) pos = p; }
    let start = Math.max(0, pos - 60); const raw = text.slice(start, start + len);
    let out = esc((start ? '…' : '') + raw + (start + len < text.length ? '…' : ''));
    terms.forEach(w => { if (w.length > 2) out = out.replace(new RegExp('(' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[а-яa-z]*)', 'gi'), '<mark>$1</mark>'); });
    return out;
  }

  // ---- модальное окно поиска ----
  let selIdx = 0;
  function openSearch(initial = '') {
    const m = $('#searchModal'); m.classList.add('open');
    const inp = $('#searchInput'); inp.value = initial; setTimeout(() => inp.focus(), 30);
    drawResults(initial);
  }
  function closeSearch() { $('#searchModal').classList.remove('open'); }
  function drawResults(q) {
    const box = $('#searchResults'); selIdx = 0;
    if (!q.trim()) {
      box.innerHTML = `<div class="sr-group">Популярное</div>${['Специальности', 'Документы для поступления', 'Расписание занятий', 'Стоимость обучения', 'Общежитие', 'Контакты приёмной комиссии'].map(s => `<div class="sr-item" data-q="${esc(s)}"><span class="ic">${ic('search')}</span><div><b>${esc(s)}</b></div></div>`).join('')}`;
      $$('.sr-item', box).forEach(it => it.onclick = () => { $('#searchInput').value = it.dataset.q; drawResults(it.dataset.q); });
      return;
    }
    const r = search(q, 24);
    const groups = {};
    r.forEach(x => { if (!groups[x.d.type]) groups[x.d.type] = []; groups[x.d.type].push(x); });
    const order = Object.keys(groups).sort((a, b) => groups[b][0].score - groups[a][0].score);
    let html = `<div class="sr-ai" data-ai="${esc(q)}"><span class="ic" style="background:var(--grad);color:#fff;width:36px;height:36px;border-radius:10px;display:grid;place-items:center">${ic('spark')}</span><div><b>Спросить ИИ-помощника</b><small class="muted">«${esc(q)}» — получить ответ своими словами со ссылками</small></div></div>`;
    if (!r.length) html += `<div class="sr-empty">Ничего не нашлось. Попробуйте другие слова или спросите помощника.</div>`;
    order.forEach(g => { if (!groups[g]) return; html += `<div class="sr-group">${g}</div>` + groups[g].slice(0, g === 'Новости' ? 5 : 7).map(x => `<a class="sr-item"${aAttrs(x.d.url + (x.d.url.startsWith('#/') && !x.d.url.includes('?') ? '?q=' + encodeURIComponent(q) : ''))}><span class="ic">${ic(x.d.icon)}</span><div><b>${esc(x.d.title)}${x.d.parent ? ` <span class="muted" style="font-weight:500">· ${esc(x.d.parent)}</span>` : ''}</b><small>${snippet(x.d.text, x.terms)}</small></div></a>`).join(''); });
    box.innerHTML = html;
    $('.sr-ai', box).onclick = () => { closeSearch(); openAI(q); };
    $$('a.sr-item', box).forEach(a => a.addEventListener('click', closeSearch));
    markSel();
  }
  function markSel() { const items = $$('#searchResults .sr-item, #searchResults .sr-ai'); items.forEach((x, i) => x.classList.toggle('sel', i === selIdx)); const s = items[selIdx]; s && s.scrollIntoView({ block: 'nearest' }); }

  function bindSearch() {
    const m = $('#searchModal');
    m.innerHTML = `<div class="modal__bg"></div><div class="modal__box" role="dialog" aria-label="Поиск по сайту">
      <div class="search-box__input">${ic('search')}<input id="searchInput" placeholder="Что вы ищете? Можно вопросом: «какие документы нужны»" autocomplete="off"><button class="icon-btn" data-close aria-label="Закрыть">${ic('x')}</button></div>
      <div class="search-box__results" id="searchResults"></div>
      <div class="search-box__foot"><span><kbd>↑</kbd><kbd>↓</kbd> выбор</span><span><kbd>Enter</kbd> открыть</span><span><kbd>Esc</kbd> закрыть</span></div></div>`;
    let t;
    $('#searchInput').addEventListener('input', e => { clearTimeout(t); t = setTimeout(() => drawResults(e.target.value), 90); });
    $('#searchInput').addEventListener('keydown', e => {
      const items = $$('#searchResults .sr-item, #searchResults .sr-ai');
      if (e.key === 'ArrowDown') { selIdx = Math.min(items.length - 1, selIdx + 1); markSel(); e.preventDefault(); }
      if (e.key === 'ArrowUp') { selIdx = Math.max(0, selIdx - 1); markSel(); e.preventDefault(); }
      if (e.key === 'Enter') { const it = items[selIdx]; if (it) it.click(); e.preventDefault(); }
    });
    m.addEventListener('click', e => { if (e.target.classList.contains('modal__bg') || e.target.closest('[data-close]')) closeSearch(); });
    document.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'л')) { e.preventDefault(); openSearch(); }
      if (e.key === '/' && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) { e.preventDefault(); openSearch(); }
      if (e.key === 'Escape') { closeSearch(); closeLB(); $('#aiPanel').classList.remove('open'); }
    });
  }

  // =========================================================
  //  ИИ-ПОМОЩНИК: находит ответ в содержимом сайта (RAG).
  //  Если в server-config.json подключена языковая модель — отвечает ею,
  //  иначе формирует ответ из найденных фрагментов локально (без внешних сервисов).
  // =========================================================
  // ---------------------------------------------------------
  //  Помощник работает как бот Aimylogic: у каждой темы (интента) есть
  //  ключевые фразы. Вопрос сравнивается с фразами с учётом окончаний,
  //  опечаток и «веса» слов (редкие слова важнее частых). Если тема не
  //  найдена уверенно — помощник уточняет, а затем ищет по сайту.
  // ---------------------------------------------------------
  let aiRemote = null;
  let AI_IDX = null;
  function buildAI() { AI_IDX = { byId: Object.fromEntries(((D.ai && D.ai.intents) || []).map(i => [i.id, i])) }; }
  function matchIntents(q) { if (!AI_IDX) buildAI(); return window.KTMatch(q, D.ai.intents || []); }
  // подстановки из данных сайта, чтобы ответы всегда совпадали с сайтом
  function fillTokens(text) {
    const val = (sp, kw) => { const f = sp.facts.find(f => norm(f.label).includes(kw)); return f ? f.values.slice(0, Math.max(1, sp.modes.length)).map((v, i) => [stripHtml(v), sp.modes[i]]).filter(([v], i) => i === 0 || (v && v !== '-')) : []; };
    const fmt = arr => arr.length > 1 ? arr.map(([v, m]) => `${v || '—'} (${m})`).join(' / ') : (arr[0] ? arr[0][0] || '—' : '—');
    return text
      .replace('{{specialties}}', D.specialties.map(s => `${s.code} ${s.name}`).join('\n'))
      .replace('{{prices}}', D.specialties.map(s => `${s.code} ${s.name}: ${fmt(val(s, 'стоимост'))}`).join('\n'))
      .replace('{{places}}', D.specialties.map(s => `${s.code} ${s.name}: бюджет ${fmt(val(s, 'бюджет'))}, платно ${fmt(val(s, 'платн'))}`).join('\n'));
  }
  const linkify = s => s.replace(/(https?:\/\/[^\s<]+[^\s<.,;:)!?»])/g, '<a href="$1" target="_blank" rel="noopener">$1</a>')
    .replace(/(^|[\s(])([\w.+-]+@[\w-]+\.[\w.]+)/g, '$1<a href="mailto:$2">$2</a>')
    .replace(/(\+7[\d\s()-]{9,16}\d)/g, m => `<a href="tel:${m.replace(/[^\d+]/g, '')}">${m}</a>`);
  const chips = btns => btns && btns.length ? `<div class="msg-btns">${btns.map(b => /^(#|https?:)/.test(b.to) ? `<a class="mb"${aAttrs(b.to)}>${esc(b.t)}</a>` : `<button class="mb" data-intent="${esc(b.to)}">${esc(b.t)}</button>`).join('')}</div>` : '';
  const HOME_BTN = { t: '🏠 В главное меню', to: '__menu' };

  function intentHtml(it, extra = []) {
    const text = linkify(esc(fillTokens(it.answer || ''))).replace(/\n/g, '<br>');
    const btns = [...(it.buttons || []), ...extra];
    if (!btns.some(b => b.to === '__menu')) btns.push(HOME_BTN);
    return `${it.image ? `<img class="msg-img" src="${esc(it.image)}" alt="" loading="lazy">` : ''}<div>${text}</div>${chips(btns)}`;
  }
  function menuHtml(text) { return `<div>${esc(text).replace(/\n/g, '<br>')}</div>${chips(D.ai.menu || [])}`; }

  function bindAI() {
    buildAI();
    const p = $('#aiPanel');
    p.innerHTML = `<div class="ai-head"><span class="ai-ava">${ic('spark')}</span><div><b>Помощник приёмной комиссии</b><small>Отвечает по материалам сайта</small></div><button data-close aria-label="Закрыть">${ic('x')}</button></div>
      <div class="ai-msgs" id="aiMsgs"></div>
      <form class="ai-form" id="aiForm"><input class="input" placeholder="Напишите вопрос…" autocomplete="off"><button aria-label="Отправить">${ic('send')}</button></form>`;
    addMsg('bot', menuHtml(D.ai.greeting || 'Здравствуйте!'));
    $('#aiFab').onclick = () => { p.classList.toggle('open'); if (p.classList.contains('open')) $('#aiForm input').focus(); };
    $('[data-close]', p).onclick = () => p.classList.remove('open');
    $('#aiForm').onsubmit = e => { e.preventDefault(); const i = $('#aiForm input'); const v = i.value.trim(); if (v) { i.value = ''; ask(v); } };
    p.addEventListener('click', e => {
      const b = e.target.closest('[data-intent]'); if (b) { showIntent(b.dataset.intent, b.textContent); return; }
      const a = e.target.closest('a.mb'); if (a && innerWidth < 760 && a.getAttribute('href').startsWith('#')) p.classList.remove('open');
    });
    document.addEventListener('click', e => { if (e.target.closest('[data-ai-open]')) { p.classList.add('open'); $('#aiForm input').focus(); } });
  }
  function openAI(q) { $('#aiPanel').classList.add('open'); if (q) ask(q); }
  function addMsg(who, html) { const d = document.createElement('div'); d.className = 'msg ' + who; d.innerHTML = html; $('#aiMsgs').appendChild(d); d.scrollIntoView({ block: 'start', behavior: 'smooth' }); return d; }

  function showIntent(id, label) {
    addMsg('me', esc(label.trim()));
    if (id === '__menu') return addMsg('bot', menuHtml('Выберите, что вас интересует 👇'));
    if (!AI_IDX) buildAI(); // индекс тем мог ещё не строиться (до первого набранного вопроса)
    const it = AI_IDX.byId[id];
    addMsg('bot', it ? intentHtml(it) : 'Раздел не найден.');
  }

  async function ask(q) {
    addMsg('me', esc(q));
    const m = matchIntents(q);
    const top = m[0];
    // 1) уверенное совпадение с темой бота
    if (top && top.score >= 0.5 && top.it.id === 'hello') { addMsg('bot', menuHtml(top.it.answer)); return; }
    if (top && top.score >= 0.5) {
      const close = m.slice(1, 3).filter(x => x.score >= 0.45 && x.score > top.score - 0.12).map(x => ({ t: '↪ ' + x.it.title, to: x.it.id }));
      addMsg('bot', intentHtml(top.it, close));
      return;
    }
    // 2) похоже на несколько тем — уточняем, как бот
    if (top && top.score >= 0.3) {
      const site = search(q, 10).filter(r => r.d.type !== 'Новости')[0];
      addMsg('bot', `<div>Уточните, пожалуйста, что вы имели в виду:</div>${chips(m.slice(0, 3).map(x => ({ t: x.it.title, to: x.it.id })).concat(site ? [{ t: '📄 ' + (site.d.parent || site.d.title), to: site.d.url }] : [], [HOME_BTN]))}`);
      return;
    }
    // 3) ничего не нашлось среди тем — ищем по сайту (новости — только если спрашивают о них)
    const wantNews = /новост|мероприят|событи/.test(norm(q));
    const results = search(q, 20).filter(r => wantNews || r.d.type !== 'Новости');
    const srcs = results.filter((r, i, a) => a.findIndex(x => x.d.url.split('?')[0] === r.d.url.split('?')[0]) === i).slice(0, 3);
    let answer = null;
    if (aiRemote !== false && srcs.length) {
      try {
        const ctx = srcs.map(r => `### ${r.d.title}\n${r.d.text.slice(0, 1500)}`).join('\n\n');
        const res = await fetch('api/ask', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question: q, context: ctx }) });
        if (res.ok) { const j = await res.json(); if (j.answer) { answer = linkify(esc(j.answer)).replace(/\n/g, '<br>'); aiRemote = true; } }
        else if (res.status === 501 || res.status === 404) aiRemote = false;
      } catch { aiRemote = false; }
    }
    const links = srcs.map(r => ({ t: (r.d.parent ? r.d.parent + ' · ' : '') + r.d.title, to: r.d.url }));
    addMsg('bot', `<div>${answer || esc(D.ai.fallback || 'Я не нашёл точного ответа. Вот что есть на сайте:')}</div>${chips(links.concat([HOME_BTN]))}`);
  }

  // ---------------- лайтбокс ----------------
  let lbList = [], lbI = 0;
  function openLB(list, i) { lbList = list; lbI = i; const lb = $('#lightbox'); lb.classList.add('open'); drawLB(); }
  function drawLB() { $('#lightbox img').src = lbList[lbI]; $('#lightbox .lb-count').textContent = `${lbI + 1} / ${lbList.length}`; }
  function closeLB() { $('#lightbox').classList.remove('open'); }
  function bindLB() {
    const lb = $('#lightbox');
    lb.innerHTML = `<img alt=""><button class="lb-close" aria-label="Закрыть">${ic('x')}</button><button class="lb-prev" aria-label="Назад">${ic('left')}</button><button class="lb-next" aria-label="Вперёд">${ic('right')}</button><div class="lb-count"></div>`;
    lb.addEventListener('click', e => { if (e.target.closest('.lb-prev')) { lbI = (lbI - 1 + lbList.length) % lbList.length; drawLB(); } else if (e.target.closest('.lb-next')) { lbI = (lbI + 1) % lbList.length; drawLB(); } else if (e.target.tagName !== 'IMG') closeLB(); });
    document.addEventListener('keydown', e => { if (!lb.classList.contains('open')) return; if (e.key === 'ArrowLeft') $('.lb-prev').click(); if (e.key === 'ArrowRight') $('.lb-next').click(); });
    document.addEventListener('click', e => {
      const a = e.target.closest('.prose a[data-lb]'); const img = !a && e.target.closest('.prose img');
      if (!a && !img) return;
      e.preventDefault();
      const scope = (a || img).closest('.gallery') || $('#prose');
      const list = a ? $$('a[data-lb]', scope).map(x => x.getAttribute('href')) : $$('img', scope).filter(x => !x.closest('a')).map(x => x.src);
      const cur = a ? a.getAttribute('href') : img.src;
      openLB(list, Math.max(0, list.indexOf(cur)));
    });
  }

  // ---------------- старт ----------------
  async function init() {
    setTheme(localStorage.getItem('theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
    initA11y();
    try {
      const r = await fetch('data/content.json?v=' + Date.now());
      if (!r.ok) throw new Error(r.status);
      D = await r.json();
    } catch (e) {
      app.innerHTML = `<div class="container" style="padding:80px 24px"><h1>Данные сайта ещё не загружены</h1><p>Запустите <a href="import.html">импорт содержимого</a> с текущего сайта.</p></div>`;
      return;
    }
    if (!D.home) D.home = { slides: [], quickLinks: [] };
    if (D.home.eyebrow == null) D.home.eyebrow = `${D.site.city} · ${D.site.address.replace(/^\d+,\s*/, '').replace(/^Москва,\s*/, '')}`;
    if (D.home.lead == null) D.home.lead = D.site.parentOrg.text;
    // приёмная комиссия на время приёма документов (данные из бота приёмной комиссии; меняются в админке)
    if (D.site.admission == null) D.site.admission = {
      enabled: true,
      title: 'Приёмная комиссия',
      note: 'В период приёма документов',
      address: 'Москва, ул. Авиамоторная, д. 8, с. 39, Конгресс-центр',
      route: 'Маршрут от станции метро Авиамоторная (Большая кольцевая линия)',
      phones: ['+7 (499) 458-84-67', '+7 (499) 457-55-34'],
      email: 'pk@ct.mtuci.ru',
      hours: 'Пн-чт: 10:00-17:00, Пт-Сб: 10:00-16:00, без перерывов',
      mapQuery: 'Москва, Авиамоторная улица, 8с39',
    };
    if (!D.ai) D.ai = { greeting: 'Здравствуйте!', synonyms: {} };
    if (!D.ai.intents) { // темы помощника ещё не сохранены в админке — берём перенесённые из бота
      try { const s = await (await fetch('data/assistant-seed.json')).json(); Object.assign(D.ai, { greeting: s.greeting, menu: s.menu, fallback: s.fallback, intents: s.intents }); } catch { D.ai.intents = []; }
    }
    renderShell();
    if (window.KT_DEMO || /github\.io$/.test(location.hostname)) { // публичная демо-версия — явная пометка
      const b = document.createElement('div'); b.className = 'demo-bar';
      b.innerHTML = 'Демонстрационная версия редизайна сайта для обсуждения. Официальный сайт колледжа — <a href="https://ct.mtuci.ru/" target="_blank" rel="noopener">ct.mtuci.ru</a>';
      document.body.prepend(b);
    }
    bindSearch(); bindAI(); bindLB();
    buildIndex();
    addEventListener('hashchange', route);
    route();
  }
  // Если фото не загрузилось (сервер с фото недоступен) — аккуратная фирменная заглушка вместо «битой» картинки
  addEventListener('error', e => {
    const img = e.target;
    if (!img || img.tagName !== 'IMG' || img.dataset.fallback) return;
    img.dataset.fallback = '1';
    const ph = document.createElement('span');
    ph.className = 'img-fallback';
    ph.setAttribute('role', 'img');
    ph.setAttribute('aria-label', img.alt || 'Фото временно недоступно');
    ph.innerHTML = `<svg viewBox="0 0 100 100" aria-hidden="true"><polygon points="${HEPTA}"/></svg><small>Фото временно недоступно</small>`;
    img.replaceWith(ph);
  }, true);

  window.KT = { openSearch, openAI };
  init();
})();
