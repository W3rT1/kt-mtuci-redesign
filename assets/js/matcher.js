/* Сопоставление вопроса с темами помощника (как интенты в Aimylogic).
   Общий код для сайта и для проверки в админ-панели. */
(() => {
  const norm = s => (s || '').toLowerCase().replace(/ё/g, 'е');
  const ENDINGS = /(ями|ами|иями|ого|его|ому|ему|ыми|ими|ией|ия|ие|ий|ья|ье|ов|ев|ей|ам|ям|ах|ях|ою|ею|ой|ей|ый|ий|ая|яя|ое|ее|ые|ие|ую|юю|ться|тся|ть|ти|ешь|ет|ем|ете|ут|ют|ит|им|ите|ат|ят|ал|ял|ила|ыла|ена|ено|ены|ать|ять|а|я|о|е|ы|и|у|ю|ь)$/;
  const stem = w => { if (w.length <= 4) return w; const s = w.replace(ENDINGS, ''); return s.length >= 4 ? s : w; };
  const STOP = new Set('и в во на с со по для ли а о об у к ко же не ни мне меня я мы вы вас ваш ваши нас бы ну пожалуйста подскажите скажите это то мой моя есть кто что чем как какой какая какое какие каков какова каковы можно нужно хочу ли'.split(' '));
  const tokens = s => norm(s).replace(/[^a-zа-я0-9.]+/g, ' ').split(' ').filter(w => w && w !== '.' && !STOP.has(w)).map(stem);
  const clean = s => norm(s).replace(/[?!.,«»"]/g, '').replace(/\s+/g, ' ').trim();
  function lev(a, b) {
    const m = a.length, n = b.length; if (Math.abs(m - n) > 2) return 9;
    let prev = Array.from({ length: n + 1 }, (_, j) => j);
    for (let i = 1; i <= m; i++) { const cur = [i]; for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); prev = cur; }
    return prev[n];
  }
  const same = (a, b) => {
    if (a === b) return true;
    const [s, l] = a.length <= b.length ? [a, b] : [b, a];
    if (s.length >= 5 && l.startsWith(s) && (l.length - s.length <= 4 || s.length >= 7)) return true; // «общежит» ↔ «общежития», «кибербез» ↔ «кибербезопасность»
    if (s.slice(0, 2) !== l.slice(0, 2)) return false;                           // опечатки в начале слова не допускаем («не-» меняет смысл)
    if (s.length === 4 && l.length <= 5 && s.slice(0, 3) === l.slice(0, 3)) return lev(a, b) <= 1; // «цена» ↔ «цены»
    return s.length >= 5 && lev(a, b) <= (s.length >= 7 ? 2 : 1);               // опечатки: 1 буква, в длинных словах — 2
  };

  const cache = new WeakMap();
  function index(intents) {
    if (cache.has(intents) && cache.get(intents).sig === sig(intents)) return cache.get(intents);
    const df = {}; let N = 0;
    const items = intents.filter(it => !it.disabled).map(it => {
      const ph = [it.title, ...(it.phrases || [])].filter(Boolean).map(p => ({ raw: p, n: clean(p), t: [...new Set(tokens(p))] }));
      ph.forEach(p => { N++; p.t.forEach(t => { df[t] = (df[t] || 0) + 1; }); });
      return { it, ph };
    });
    // вес слова: чем реже встречается во фразах, тем важнее; незнакомое слово весит как самое редкое
    const known = Object.keys(df);
    const wt = t => { if (df[t]) return Math.log(1 + N / df[t]); const k = known.find(x => same(x, t)); return k ? Math.log(1 + N / df[k]) : Math.log(1 + N); };
    const memo = {};
    const ix = { items, w: t => (t in memo ? memo[t] : (memo[t] = wt(t))), sig: sig(intents) };
    cache.set(intents, ix); return ix;
  }
  const sig = intents => intents.length + ':' + intents.reduce((s, i) => s + (i.phrases || []).length + (i.disabled ? 1 : 0) + (i.title || '').length, 0);

  // Возвращает темы по убыванию совпадения: [{ it, score 0..1, phrase }]
  window.KTMatch = function (q, intents) {
    const qt = [...new Set(tokens(q))]; const nq = clean(q);
    if (!qt.length || !intents || !intents.length) return [];
    const { items, w } = index(intents);
    const wq = qt.reduce((s, t) => s + w(t), 0);
    const res = [];
    for (const { it, ph } of items) {
      let best = 0, bestPh = '';
      for (const p of ph) {
        if (!p.t.length) continue;
        let common = 0, maxHit = 0, maxMiss = 0;
        for (const t of qt) { const m = p.t.find(x => same(x, t)); if (m) { common += Math.max(w(t), w(m)); maxHit = Math.max(maxHit, w(t)); } else maxMiss = Math.max(maxMiss, w(t)); }
        const wp = p.t.reduce((s, t) => s + w(t), 0);
        let sc = Math.min(1, (2 * common) / (wq + wp));
        if (maxMiss > maxHit * 1.5) sc = Math.min(sc, 0.45); // главное слово вопроса не совпало — не уверены
        if (nq === p.n) sc = 1; else if (p.n.length >= 5 && nq.includes(p.n) && p.n.length / nq.length >= 0.6) sc = Math.max(sc, 0.8);
        if (sc > best) { best = sc; bestPh = p.raw; }
      }
      if (best > 0) res.push({ it, score: best, phrase: bestPh });
    }
    return res.sort((a, b) => b.score - a.score);
  };
})();
