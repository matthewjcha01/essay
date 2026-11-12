/* ═══════════════════════════════════════════════════════════════
 *  Mind Grove — Essay outline (아웃라인)
 *  GitHub (matthewjcha01.github.io/essay/outline.js) 에 올리는 파일입니다.
 *  index.html · revision.html · Write.html · Monitor.html · Comments.html 이 함께 씁니다.
 *
 *  MGOutline.editor(el, opts)  학생이 칸을 채우는 화면 (칸 옆 가이드 · 형식 검사 · 색 표시)
 *  MGOutline.view(el, opts)    채운 아웃라인을 그림(흐름)으로 — 글 쓸 때 옆 패널 · 선생님 화면
 *  MGOutline.text(type, data)  글로 (수업 모니터에 보내는 용)
 *  칸 id 는 아웃라인.gs 와 같아야 합니다.
 * ═══════════════════════════════════════════════════════════════ */
(function () {
  if (window.MGOutline) return;

  var CSS = [
    '.mgol{--g:#1b7a3d;--gbg:#e6f4ea;--y:#8a6d00;--ybg:#fff4d6;--r:#b3261e;--rbg:#fce8e6;--ln:#dfe2e6;--mu:#6b7178;--ac:#1a5490;',
    ' font:14px/1.5 -apple-system,"Segoe UI","Apple SD Gothic Neo",sans-serif;color:#1f2328}',
    '.mgol *{box-sizing:border-box}',
    '.mgol button,.mgolv button{min-height:0;width:auto;text-transform:none;letter-spacing:0}',
    '.mgol-head{display:flex;align-items:baseline;justify-content:space-between;gap:10px;flex-wrap:wrap;margin:0 0 12px}',
    '.mgol-head h2{font-size:19px;margin:0}',
    '.mgol-head .sub{color:var(--mu);font-size:13px}',
    '.mgol-banner{border-radius:10px;padding:10px 14px;margin:0 0 14px;font-weight:600;display:flex;gap:10px;align-items:center;flex-wrap:wrap}',
    '.mgol-banner.pass{background:var(--gbg);color:var(--g)}.mgol-banner.work{background:var(--ybg);color:var(--y)}',
    '.mgol-banner.info{background:#eef3fb;color:var(--ac);font-weight:500}.mgol-banner.err{background:var(--rbg);color:var(--r)}',
    '.mgol-banner .sp{flex:1}',
    '.mgol-sec{font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--ac);margin:18px 0 8px;display:flex;align-items:center;gap:10px}',
    '.mgol-sec .x{margin-left:auto;font:12px -apple-system,sans-serif;text-transform:none;letter-spacing:0;background:none;border:0;color:var(--mu);cursor:pointer}',
    '.mgol-row{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.1fr);gap:12px;margin:0 0 10px;align-items:stretch}',
    '.mgol-box{background:#fff;border:1px solid var(--ln);border-left:5px solid var(--ln);border-radius:10px;padding:10px 12px}',
    '.mgol-box.cg{border-left-color:var(--g)}.mgol-box.cy{border-left-color:#e3b400}.mgol-box.cr{border-left-color:var(--r)}',
    '.mgol-box.stale{border-left-style:dashed}',
    '.mgol-lab{font-size:13px;font-weight:700;margin:0 0 6px;display:flex;align-items:center;gap:6px}',
    '.mgol-dot{width:10px;height:10px;border-radius:50%;display:inline-block;flex:none;background:#d0d3d8}',
    '.mgol-dot.g{background:var(--g)}.mgol-dot.y{background:#e3b400}.mgol-dot.r{background:var(--r)}',
    '.mgol input,.mgol textarea{width:100%;border:1px solid var(--ln);border-radius:7px;padding:7px 9px;font:inherit;background:#fbfbfc;color:#1f2328}',
    '.mgol textarea{resize:vertical;min-height:52px;font:15px/1.5 "Times New Roman",Times,serif}',
    '.mgol input:focus,.mgol textarea:focus{outline:2px solid var(--ac);outline-offset:0;background:#fff}',
    '.mgol-line{display:flex;gap:6px;align-items:center;margin:0 0 6px}',
    '.mgol-line .arr{color:var(--mu);flex:none}',
    '.mgol-line .pre{color:var(--mu);font-size:12px;flex:none;min-width:44px}',
    '.mgol-line input.pg{width:64px;flex:none}',
    '.mgol-msg{font-size:13px;margin-top:6px;border-radius:7px;padding:6px 9px}',
    '.mgol-msg.block{background:var(--rbg);color:var(--r);font-weight:600}',
    '.mgol-msg.warn{background:var(--ybg);color:var(--y)}',
    '.mgol-msg.note{background:#f6f7f9;color:#1f2328;border-left:3px solid #e3b400}',
    '.mgol-msg.note.r{border-left-color:var(--r)}',
    '.mgol-guide{background:#f3f6fb;border-radius:10px;padding:10px 12px;font-size:13px;line-height:1.55}',
    '.mgol-guide b{color:var(--ac);font-weight:600}',
    '.mgol-guide .ex{font-family:"Times New Roman",Times,serif;font-size:14px}',
    '.mgol-guide .thin{color:var(--mu)}',
    '.mgol-add{display:flex;gap:8px;flex-wrap:wrap;margin:6px 0 4px}',
    '.mgol-btn{border:1px solid var(--ln);background:#fff;border-radius:8px;padding:7px 12px;font:inherit;font-size:13px;cursor:pointer;color:#1f2328}',
    '.mgol-btn.pri{background:var(--ac);border-color:var(--ac);color:#fff;font-weight:600;padding:10px 18px;font-size:14px}',
    '.mgol-btn.go{background:var(--g);border-color:var(--g);color:#fff;font-weight:600}',
    '.mgol-btn:disabled{opacity:.55;cursor:default}',
    '.mgol-foot{display:flex;gap:10px;align-items:center;justify-content:flex-end;flex-wrap:wrap;margin:16px 0 4px;padding-top:12px;border-top:1px solid var(--ln)}',
    '.mgol-foot .st{margin-right:auto;color:var(--mu);font-size:13px}',
    '.mgol-confirm{background:var(--ybg);color:var(--y);border-radius:10px;padding:10px 14px;margin:12px 0 0;display:flex;gap:10px;align-items:center;flex-wrap:wrap}',
    '.mgol-confirm .sp{flex:1}',
    '.mgol-spin{display:inline-block;width:13px;height:13px;border:2px solid #cfd5dc;border-top-color:var(--ac);border-radius:50%;animation:mgolS .9s linear infinite;vertical-align:-2px;margin-right:6px}',
    '@keyframes mgolS{to{transform:rotate(360deg)}}',
    '@media (max-width:760px){.mgol-row{grid-template-columns:1fr;gap:4px}.mgol-guide{font-size:12.5px}}',
    '.mgol.narrow .mgol-row{grid-template-columns:1fr;gap:4px}.mgol.narrow .mgol-guide{font-size:12.5px}',
    /* view (그림) */
    '.mgolv{font:13px/1.45 -apple-system,"Segoe UI","Apple SD Gothic Neo",sans-serif;color:#1f2328}',
    '.mgolv *{box-sizing:border-box}',
    '.mgolv-card{background:#fff;border:1px solid var(--ln,#dfe2e6);border-left:4px solid #c9ced6;border-radius:8px;padding:7px 10px}',
    '.mgolv-card.main{background:#f2f0fc;border-color:#d9d4f4;border-left-color:#7f77dd}',
    '.mgolv-card.turn{background:#fcefe9;border-color:#f3c9b8;border-left-color:#d85a30}',
    '.mgolv-card.grey{background:#f4f4f2;border-left-color:#a7a6a0}',
    '.mgolv-card.dash{border-style:dashed}',
    '.mgolv-k{font-size:11px;font-weight:700;color:#6b7178;text-transform:uppercase;letter-spacing:.05em;display:flex;align-items:center;gap:5px}',
    '.mgolv-t{font-family:"Times New Roman",Times,serif;font-size:14px;line-height:1.4}',
    '.mgolv-ar{text-align:center;color:#9aa0a6;font-size:13px;line-height:1;margin:3px 0}',
    '.mgolv-pts{display:flex;gap:6px;flex-wrap:wrap}',
    '.mgolv-pt{flex:1 1 120px;background:#e7f4ef;border:1px solid #bfe3d2;border-radius:8px;padding:5px 8px}',
    '.mgolv-body{border:1px solid #e3e6ea;border-radius:10px;padding:6px;margin:0;background:#fafbfc}',
    '.mgolv-body .bh{font-size:11px;font-weight:700;color:#1a5490;margin:0 2px 4px;text-transform:uppercase;letter-spacing:.05em}',
    '.mgolv-li{display:flex;gap:6px;padding:3px 4px;border-radius:6px;align-items:flex-start}',
    '.mgolv-li .lk{flex:none;width:78px;font-size:11px;color:#6b7178;font-weight:600;padding-top:2px}',
    '.mgolv-li .lv{flex:1;min-width:0;font-family:"Times New Roman",Times,serif;font-size:14px;line-height:1.35;overflow-wrap:anywhere}',
    '.mgolv-li.conn{background:#e7f4ef}.mgolv-li.conn .lk{color:#0f6e56}',
    '.mgolv-note{font-size:12px;color:#5b5f66;margin:2px 4px 4px 88px;font-family:-apple-system,sans-serif}',
    '.mgolv-note.y{color:#7a5d00}.mgolv-note.r{color:#b3261e}',
    '.mgolv-li .d,.mgolv-k .d{width:8px;height:8px;border-radius:50%;flex:none;margin-top:5px;background:transparent}',
    '.mgolv-k .d{margin-top:0}',
    '.d.g{background:#1b7a3d!important}.d.y{background:#e3b400!important}.d.r{background:#b3261e!important}',
    '.mgolv-empty{color:#9aa0a6;font-style:italic}'
  ].join('\n');

  function inject() {
    if (document.getElementById('mgol-css')) return;
    var s = document.createElement('style'); s.id = 'mgol-css'; s.textContent = CSS;
    document.head.appendChild(s);
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function words(s) { return (String(s || '').trim().match(/\S+/g) || []).length; }
  var KO = /[ᄀ-ᇿ㄰-㆏가-힯]/g;

  // ── 빈 아웃라인 ──
  function body(last) { var b = { topic: { who: '', verb: '', what: '' }, page: '', quote: '', before: '', after: '', sowhat: '' }; b[last] = ''; return b; }
  function blank(type) {
    if (type === 'pivot') return { question: '', concession: '', points: [''], cbodies: [body('comment')], however: '', rbodies: [body('comment'), body('comment')], significance: '' };
    return { question: '', thesis: '', points: ['', ''], bodies: [body('connection'), body('connection')], car: null, significance: '' };
  }
  function fill(type, d) {
    var o = blank(type), k;
    d = d || {};
    for (k in o) if (d[k] !== undefined && d[k] !== null) o[k] = JSON.parse(JSON.stringify(d[k]));
    if (type !== 'pivot' && d.car === null) o.car = null;
    var last = type === 'pivot' ? 'comment' : 'connection';
    ['bodies', 'cbodies', 'rbodies'].forEach(function (f) {
      if (!o[f]) return;
      o[f] = o[f].map(function (b) { var n = body(last); for (var x in n) if (b && b[x] !== undefined) n[x] = b[x]; if (b && b.topic) n.topic = { who: b.topic.who || '', verb: b.topic.verb || '', what: b.topic.what || '' }; return n; });
    });
    syncPoints(type, o);
    return o;
  }
  function bodiesOf(type, o) { return type === 'pivot' ? o.cbodies : o.bodies; }
  function syncPoints(type, o) {
    var n = bodiesOf(type, o).length;
    o.points = (o.points || []).slice(0, n);
    while (o.points.length < n) o.points.push('');
  }

  // ── 칸 목록 (아웃라인.gs 의 아웃라인칸_ 과 같은 id) ──
  function boxList(type, o) {
    var L = [];
    function bd(b, pre, name, lastName, side) {
      L.push({ id: pre + 't', kind: side === 'c' ? 'ctopic' : side === 'r' ? 'rtopic' : 'topic', label: name + ' · Topic', b: b });
      L.push({ id: pre + 'e', kind: 'example', label: name + ' · Example', b: b });
      L.push({ id: pre + 'g', kind: 'gap', label: name + ' · Before → after', b: b });
      L.push({ id: pre + 'm', kind: side === 'c' ? 'ccomment' : side === 'r' ? 'rcomment' : 'connection', label: name + ' · ' + lastName, b: b });
    }
    if (type === 'pivot') {
      L.push({ id: 'con', kind: 'concession', label: 'Concession' });
      o.points.forEach(function (p, i) { L.push({ id: 'p' + (i + 1), kind: 'point', label: 'Point ' + (i + 1), i: i }); });
      o.cbodies.forEach(function (b, i) { bd(b, 'cb' + (i + 1), 'Concession body ' + (i + 1), 'Comment', 'c'); });
      L.push({ id: 'how', kind: 'however', label: 'However' });
      o.rbodies.forEach(function (b, i) { bd(b, 'rb' + (i + 1), 'Reality body ' + (i + 1), 'Comment', 'r'); });
    } else {
      L.push({ id: 'thesis', kind: 'thesis', label: 'Thesis' });
      o.points.forEach(function (p, i) { L.push({ id: 'p' + (i + 1), kind: 'point', label: 'Point ' + (i + 1), i: i }); });
      o.bodies.forEach(function (b, i) { bd(b, 'b' + (i + 1), 'Body ' + (i + 1), 'Connection'); });
      if (o.car) { L.push({ id: 'carc', kind: 'counter', label: 'Counter + weak spot' }); L.push({ id: 'carr', kind: 'rebut', label: 'Rebut' }); }
    }
    L.push({ id: 'sig', kind: 'significance', label: 'Significance' });
    return L;
  }

  // ── 칸 옆 가이드 (Write / e.g. / Check) ──
  var G = {
    question: { w: 'Copy the essay question you are answering.', e: 'How does Ada find a place where she belongs?', c: '' },
    thesis: { w: 'One full sentence — strong, clear, universal (no character names).', e: 'When people refuse the life others have chosen for them, they find where they truly belong.', c: 'Could anyone find a hole in it? Does it answer every part of the question?' },
    point: { w: '2–4 words for each piece of evidence, in the same order as your body paragraphs. Just a taste.', e: '① no place at home &nbsp;② teaching herself to walk', thin: '① home ② walking', c: 'One point for each body paragraph?' },
    topic: { w: 'who → strong verb → what. The verb is the most important word.', e: 'Ada → refuses → Mam’s locked room', thin: 'Ada → is → sad', c: 'Does your verb make your claim feel certain?' },
    example: { w: 'The page number + the first few words of the quote. Only ONE moment — the best one.', e: 'p.15 “You can’t leave… bombs or no”', thin: 'p.15', c: 'Is this the one best moment for your topic?' },
    gap: { w: '2–3 words on each side of the arrow (what changed). Then one “so what” line that ends at your topic.', e: 'other kids leave safely → Ada stays under bombs / so what: no place in her family', thin: 'bad → worse', c: 'Is there a clear change? Does “so what” lead to your topic?' },
    connection: { w: 'The exact words from your thesis that this paragraph proves. Character names are OK here.', e: '→ “refuse the life others have chosen”', thin: '→ thesis', c: 'Did you copy words from your thesis?' },
    counter: { w: 'The other side’s idea in 3–5 words, and its weak spot. Pick an idea that sounds believable.', e: 'Ada should obey Mam / weak spot: Mam never cared for her', thin: 'some people disagree', c: 'Is it believable — but with a weak spot you can attack?' },
    rebut: { w: 'What we lose if we believe them. Strike back hard.', e: 'we lose the chance to belong anywhere', c: 'Does it hit the weak spot?' },
    significance: { w: 'ONE lesson in 3–6 words. Share it, don’t force it. No “I”.', e: 'belonging begins with one brave choice', thin: 'be brave', c: 'Is it a lesson about people — not a rule, not only about the character?' },
    concession: { w: 'One full sentence: what SEEMS true at first. Use “appears to” or “seems to” — later you will turn it around.', e: 'At first, the Rebellion appears to give the animals the free, fair life they dreamed of.', c: 'Does it sound true now — but only “seems”?' },
    ctopic: { w: 'who → verb → what, with “At first” or “appeared to”.', e: 'At first, the farm → appears to grow → richer every year', c: 'Does it feel like it may not last?' },
    ccomment: { w: 'How things looked on the surface. Don’t say it was false yet.', e: '“On the surface, the farm looked like a success”', c: 'Does it make the reader feel a turn is coming?' },
    however: { w: 'ONE sudden sentence that says the opposite of your Concession. This is your real thesis.', e: 'However, the Rebellion only gives the animals new masters who are crueler than the old ones.', c: 'Is it one sentence? Does it directly turn the Concession around?' },
    rtopic: { w: 'who → verb → what, showing what is really true (“In reality…”).', e: 'In reality, the pigs → rewrite → the Commandments', c: 'Does it show the truth strongly?' },
    rcomment: { w: 'Make clear what is really true.', e: '“the animals were never free”', c: 'Does it make the turn feel right?' }
  };
  function guideHtml(kind) {
    var g = G[kind] || {};
    return '<div><b>Write:</b> ' + g.w + '</div>' +
      (g.e ? '<div><b>e.g.</b> <span class="ex">' + g.e + '</span></div>' : '') +
      (g.thin ? '<div class="thin">Too thin: <span class="ex">' + g.thin + '</span></div>' : '') +
      (g.c ? '<div><b>Check:</b> ' + g.c + '</div>' : '');
  }

  // ── 형식 검사 (막기 / 경고) ──
  var WEAK = /^(is|are|was|were|am|be|been|being|has|have|had|feels?|felt|seems?|gets?|got)$/i;
  var STOP = { the: 1, and: 1, but: 1, for: 1, that: 1, this: 1, with: 1, from: 1, they: 1, their: 1, them: 1, when: 1, what: 1, who: 1, will: 1, can: 1, are: 1, was: 1, were: 1, have: 1, has: 1, not: 1, our: 1, its: 1, into: 1, than: 1, then: 1, even: 1, more: 1, most: 1, only: 1, all: 1, one: 1, own: 1, how: 1, why: 1, where: 1, which: 1 };
  function keyWords(s) {
    var o = {}; (String(s || '').toLowerCase().match(/[a-z']+/g) || []).forEach(function (w) { if (w.length >= 3 && !STOP[w]) o[w] = 1; }); return o;
  }
  function check(type, o) {
    var block = {}, warn = {};
    function need(id, vals, msg) { if (vals.some(function (v) { return !String(v || '').trim(); })) block[id] = msg || 'Fill in this box.'; }
    if (!String(o.question || '').trim()) block.q = 'Write the essay question first.';
    var head = type === 'pivot' ? o.concession : o.thesis;
    boxList(type, o).forEach(function (k) {
      var b = k.b, v;
      switch (k.kind) {
        case 'thesis':
          need(k.id, [o.thesis]);
          if (!block[k.id]) {
            if (words(o.thesis) < 8) warn[k.id] = 'Your thesis looks short. Write one full sentence.';
            else if (!/[.!?]["”']?$/.test(o.thesis.trim())) warn[k.id] = 'End your thesis with a period.';
          }
          break;
        case 'concession':
          need(k.id, [o.concession]);
          if (!block[k.id] && !/\b(appear|appears|appeared|seem|seems|seemed|look|looks|looked|at first|on the surface)\b/i.test(o.concession))
            warn[k.id] = 'Use “appears to” or “seems to” — it should only SEEM true.';
          break;
        case 'however':
          need(k.id, [o.however]);
          if (!block[k.id] && (String(o.however).trim().match(/[.!?]+(\s+|$)/g) || []).length > 1) warn[k.id] = 'Turn it around in ONE sentence.';
          break;
        case 'point':
          v = o.points[k.i];
          need(k.id, [v]);
          if (!block[k.id] && words(v) > 8) warn[k.id] = 'Keep each point to a few words — just a taste.';
          break;
        case 'topic': case 'ctopic': case 'rtopic':
          need(k.id, [b.topic.who, b.topic.verb, b.topic.what], 'Fill in who, verb, and what.');
          if (!block[k.id]) {
            var vb = b.topic.verb.trim();
            if (words(vb) > 3) warn[k.id] = 'Write just the verb in the middle box.';
            else if (WEAK.test(vb.split(/\s+/)[0]) || WEAK.test(vb)) warn[k.id] = 'Your verb is “' + vb + '.” Choose a verb that makes a claim.';
            else if (k.kind === 'ctopic' && !/\b(at first|initially|appear|appears|appeared|seem|seems|seemed)\b/i.test(b.topic.who + ' ' + vb + ' ' + b.topic.what))
              warn[k.id] = 'Use “At first…” or “appeared to…” — this side only seems true.';
          }
          break;
        case 'example':
          need(k.id, [b.page, b.quote], 'Write the page number and the start of the quote.');
          if (!block[k.id] && !/\d/.test(b.page)) block[k.id] = 'Write the page number (a number).';
          if (!block[k.id] && words(b.quote) < 3) warn[k.id] = 'Write the first few words of the quote so you remember the moment.';
          break;
        case 'gap':
          need(k.id, [b.before, b.after, b.sowhat], 'Fill in before, after, and so what.');
          if (!block[k.id]) {
            if (words(b.before) > 10 || words(b.after) > 10) warn[k.id] = 'Keep before and after short (2–3 words each).';
            else if (words(b.sowhat) < 3) warn[k.id] = 'Write one line for “so what” that ends at your topic.';
          }
          break;
        case 'connection':
          need(k.id, [b.connection]);
          if (!block[k.id]) {
            var tw = keyWords(head), n = 0;
            Object.keys(keyWords(b.connection)).forEach(function (w) { if (tw[w]) n++; });
            if (n < 2) warn[k.id] = 'Use at least two words from your thesis.';
          }
          break;
        case 'ccomment': case 'rcomment':
          need(k.id, [b.comment]);
          break;
        case 'counter':
          need(k.id, [o.car.counter, o.car.weak], 'Write the other side and its weak spot.');
          break;
        case 'rebut':
          need(k.id, [o.car.rebut]);
          break;
        case 'significance':
          need(k.id, [o.significance]);
          if (!block[k.id]) {
            if (/\b(i|i'm|i've|me|my|myself)\b/i.test(o.significance)) warn[k.id] = 'Don’t use “I.” Share a lesson about people.';
            else if (words(o.significance) > 10 || words(o.significance) < 2) warn[k.id] = 'Write the lesson in 3–6 words.';
          }
          break;
      }
    });
    return { block: block, warn: warn };
  }

  // ── 글로 (모니터 · 실시간) ──
  function text(type, o) {
    o = fill(type, o);
    var L = ['[OUTLINE]', 'Question: ' + o.question];
    function bt(b, name, last) {
      L.push(name + ' — Topic: ' + [b.topic.who, b.topic.verb, b.topic.what].join(' → '));
      L.push('   Example: p.' + b.page + ' "' + b.quote + '"');
      L.push('   Before → after: ' + b.before + ' → ' + b.after + ' / so what: ' + b.sowhat);
      L.push('   ' + last + ': ' + (b.connection || b.comment || ''));
    }
    if (type === 'pivot') {
      L.push('Concession: ' + o.concession);
      L.push('Points: ' + o.points.join(' / '));
      o.cbodies.forEach(function (b, i) { bt(b, 'Concession body ' + (i + 1), 'Comment'); });
      L.push('However: ' + o.however);
      o.rbodies.forEach(function (b, i) { bt(b, 'Reality body ' + (i + 1), 'Comment'); });
    } else {
      L.push('Thesis: ' + o.thesis);
      L.push('Points: ' + o.points.join(' / '));
      o.bodies.forEach(function (b, i) { bt(b, 'Body ' + (i + 1), 'Connection'); });
      if (o.car) L.push('C.A.R.: ' + o.car.counter + ' / weak spot: ' + o.car.weak + ' / rebut: ' + o.car.rebut);
    }
    L.push('Significance: ' + o.significance);
    return L.join('\n');
  }

  // ═════════ 편집기 ═════════
  function editor(root, opts) {
    inject();
    opts = opts || {};
    var type = opts.type === 'pivot' ? 'pivot' : 'basic';
    var data = fill(type, opts.data);
    if (!data.question && opts.question) data.question = String(opts.question).replace(KO, '');
    // 기기에 남은 더 최근 글
    var resAt = opts.result && opts.result.at || 0;
    if (opts.store) {
      try { var loc = JSON.parse(localStorage.getItem(opts.store) || 'null'); if (loc && loc.at > resAt && loc.data) data = fill(type, loc.data); } catch (e) {}
    }
    var result = opts.result || null;     // { boxes: {id:{c,n}}, pass, at }
    var sent = {};                        // 마지막으로 검사받은 값 (바뀐 칸은 점선)
    var showChecks = false, confirmWarn = false, busy = false, submittedHere = false;
    var last = type === 'pivot' ? 'comment' : 'connection';
    if (result && opts.data) snapshotSent(fill(type, opts.data));

    function snapshotSent(d) { sent = {}; boxList(type, d).forEach(function (k) { sent[k.id] = boxValue(d, k); }); }
    function boxValue(d, k) {
      var b = k.b;
      switch (k.kind) {
        case 'thesis': return d.thesis; case 'concession': return d.concession; case 'however': return d.however;
        case 'point': return d.points[k.i]; case 'significance': return d.significance;
        case 'example': return b.page + '|' + b.quote; case 'gap': return b.before + '|' + b.after + '|' + b.sowhat;
        case 'counter': return d.car.counter + '|' + d.car.weak; case 'rebut': return d.car.rebut;
        case 'connection': return b.connection; case 'ccomment': case 'rcomment': return b.comment;
        default: return b.topic.who + '|' + b.topic.verb + '|' + b.topic.what;
      }
    }
    function save() {
      if (opts.store) try { localStorage.setItem(opts.store, JSON.stringify({ at: Date.now(), data: data })); } catch (e) {}
      if (opts.onChange) opts.onChange(data);
    }

    function inp(path, ph, cls, area) {
      var v = get(path);
      if (area) return '<textarea data-p="' + path + '" placeholder="' + esc(ph) + '" rows="2" maxlength="400">' + esc(v) + '</textarea>';
      return '<input type="text" data-p="' + path + '" placeholder="' + esc(ph) + '" class="' + (cls || '') + '" maxlength="300" value="' + esc(v) + '" autocomplete="off">';
    }
    function get(path) {
      var x = data, ps = path.split('.');
      for (var i = 0; i < ps.length; i++) { if (x == null) return ''; x = x[ps[i]]; }
      return x == null ? '' : x;
    }
    function set(path, v) {
      var x = data, ps = path.split('.');
      for (var i = 0; i < ps.length - 1; i++) x = x[ps[i]];
      x[ps[ps.length - 1]] = v;
    }

    function boxInputs(k) {
      var b = k.b, pre = '';
      if (b) {
        var arr = k.id.indexOf('cb') === 0 ? 'cbodies' : k.id.indexOf('rb') === 0 ? 'rbodies' : 'bodies';
        pre = arr + '.' + (parseInt(k.id.replace(/\D/g, ''), 10) - 1) + '.';
      }
      switch (k.kind) {
        case 'thesis': return inp('thesis', 'One full sentence…', '', true);
        case 'concession': return inp('concession', 'At first, … appears to …', '', true);
        case 'however': return inp('however', 'However, …', '', true);
        case 'point': return inp('points.' + k.i, 'a few words');
        case 'topic': case 'ctopic': case 'rtopic':
          return '<div class="mgol-line"><span class="pre">who</span>' + inp(pre + 'topic.who', k.kind === 'ctopic' ? 'At first, the farm' : k.kind === 'rtopic' ? 'In reality, the pigs' : 'Ada') + '</div>' +
                 '<div class="mgol-line"><span class="pre">verb</span>' + inp(pre + 'topic.verb', 'refuses') + '</div>' +
                 '<div class="mgol-line"><span class="pre">what</span>' + inp(pre + 'topic.what', 'Mam’s locked room') + '</div>';
        case 'example':
          return '<div class="mgol-line"><span class="pre">page</span>' + inp(pre + 'page', '15', 'pg') + '</div>' +
                 '<div class="mgol-line"><span class="pre">quote</span>' + inp(pre + 'quote', '“You can’t leave…”') + '</div>';
        case 'gap':
          return '<div class="mgol-line"><span class="pre">before</span>' + inp(pre + 'before', 'other kids leave safely') + '</div>' +
                 '<div class="mgol-line"><span class="pre">after</span>' + inp(pre + 'after', 'Ada stays under bombs') + '</div>' +
                 '<div class="mgol-line"><span class="pre">so what</span>' + inp(pre + 'sowhat', 'ends at your topic') + '</div>';
        case 'connection': return '<div class="mgol-line"><span class="arr">↩</span>' + inp(pre + 'connection', 'words from your thesis') + '</div>';
        case 'ccomment': case 'rcomment': return inp(pre + 'comment', k.kind === 'ccomment' ? 'On the surface, …' : 'what is really true');
        case 'counter':
          return '<div class="mgol-line"><span class="pre">counter</span>' + inp('car.counter', 'the other side') + '</div>' +
                 '<div class="mgol-line"><span class="pre">weak spot</span>' + inp('car.weak', 'its hole') + '</div>';
        case 'rebut': return inp('car.rebut', 'what we lose if we believe them');
        case 'significance': return inp('significance', '3–6 words');
      }
      return '';
    }

    function rowHtml(k, ch) {
      var r = result && result.boxes ? result.boxes[k.id] : null;
      var changed = r && sent[k.id] !== undefined && sent[k.id] !== boxValue(data, k);
      var cls = r ? ' c' + r.c + (changed ? ' stale' : '') : '';
      var msg = '';
      if (showChecks && ch.block[k.id]) msg = '<div class="mgol-msg block">' + esc(ch.block[k.id]) + '</div>';
      else if (showChecks && ch.warn[k.id]) msg = '<div class="mgol-msg warn">⚠ ' + esc(ch.warn[k.id]) + '</div>';
      if (r && r.c !== 'g' && r.n && !changed) msg += '<div class="mgol-msg note ' + r.c + '">' + esc(r.n) + '</div>';
      if (changed) msg += '<div class="mgol-msg" style="color:var(--mu);padding-left:0">Changed — it will be checked again.</div>';
      return '<div class="mgol-row" data-id="' + k.id + '"><div class="mgol-box' + cls + '"><div class="mgol-lab"><span class="mgol-dot ' + (r && !changed ? r.c : '') + '"></span>' +
        esc(k.label) + '</div>' + boxInputs(k) + msg + '</div><div class="mgol-guide">' + guideHtml(k.kind) + '</div></div>';
    }

    function counts() {
      var n = { g: 0, y: 0, r: 0 };
      if (result && result.boxes) Object.keys(result.boxes).forEach(function (id) { n[result.boxes[id].c]++; });
      return n;
    }

    function draw() {
      var ch = check(type, data), L = boxList(type, data), h = '';
      var keepY = window.scrollY;
      h += '<div class="mgol-head"><h2>' + esc(opts.title || 'My outline') + '</h2><span class="sub">' +
           (type === 'pivot' ? 'Concession → However → Reality' : 'Plan first. Thesis is a sentence; the rest is keywords.') + '</span></div>';
      if (opts.intro) h += '<div class="mgol-banner info">' + esc(opts.intro) + '</div>';
      if (result && result.boxes) {
        var n = counts();
        if (result.pass) h += '<div class="mgol-banner pass">✅ Every box is green. Your outline passed!<span class="sp"></span>' +
          (opts.onPass ? '<button class="mgol-btn go" data-a="pass">' + esc(opts.passLabel || 'Start writing →') + '</button>' : '') + '</div>';
        else h += '<div class="mgol-banner work">🟢 ' + n.g + ' · 🟡 ' + n.y + ' · 🔴 ' + n.r +
          ' — Read the notes on the yellow and red boxes, fix them, then check again.</div>';
      }
      // 질문
      h += '<div class="mgol-row" data-id="q"><div class="mgol-box"><div class="mgol-lab">Essay question</div>' + inp('question', 'The question you are answering', '', true) +
           (showChecks && ch.block.q ? '<div class="mgol-msg block">' + esc(ch.block.q) + '</div>' : '') +
           '</div><div class="mgol-guide">' + guideHtml('question') + '</div></div>';

      var curSec = '';
      function sec(name, rm) {
        if (name === curSec) return '';
        curSec = name;
        return '<div class="mgol-sec">' + esc(name) + (rm ? '<button class="x" data-a="rm" data-w="' + rm + '">Remove</button>' : '') + '</div>';
      }
      L.forEach(function (k) {
        var m = k.id.match(/^(b|cb|rb)(\d+)/);
        if (k.kind === 'thesis' || k.kind === 'concession') h += sec('Introduction');
        else if (m) {
          var arr = m[1] === 'cb' ? 'cbodies' : m[1] === 'rb' ? 'rbodies' : 'bodies';
          var name = (m[1] === 'cb' ? 'Concession body ' : m[1] === 'rb' ? 'Reality body ' : 'Body ') + m[2];
          var canRm = data[arr].length > (m[1] === 'cb' ? 1 : m[1] === 'rb' ? 1 : 1) ? arr + '.' + (Number(m[2]) - 1) : '';
          h += sec(name, canRm);
        }
        else if (k.kind === 'however') h += sec('The turn');
        else if (k.kind === 'counter') h += sec('Counterargument (C.A.R.)', 'car');
        else if (k.kind === 'significance') h += addButtons() + sec('Conclusion');
        h += rowHtml(k, ch);
      });
      // 버튼 줄
      var st = busy ? '<span class="mgol-spin"></span>Checking your outline… about 30 seconds. Keep this page open.'
               : result && result.count ? 'Checked ' + result.count + (result.count === 1 ? ' time' : ' times') : '';
      h += '<div class="mgol-foot"><span class="st">' + st + '</span>' +
           (canCancel() ? '<button class="mgol-btn" data-a="cancel">' + esc(opts.cancelLabel || 'Cancel') + '</button>' : '') +
           '<button class="mgol-btn pri" data-a="go"' + (busy ? ' disabled' : '') + '>Check my outline</button></div>';
      if (confirmWarn) h += '<div class="mgol-confirm">⚠ Some boxes have a yellow warning.<span class="sp"></span>' +
           '<button class="mgol-btn" data-a="fix">Fix them</button><button class="mgol-btn" data-a="anyway">Submit anyway</button></div>';
      if (draw.err) h += '<div class="mgol-banner err" style="margin-top:10px">' + esc(draw.err) + '</div>';
      root.innerHTML = '<div class="mgol' + (opts.narrow ? ' narrow' : '') + '">' + h + '</div>';
      window.scrollTo(0, keepY);
    }
    function addButtons() {
      var h = '<div class="mgol-add">';
      if (type === 'pivot') {
        if (data.cbodies.length < 2) h += '<button class="mgol-btn" data-a="addc">+ Add concession body</button>';
        if (data.rbodies.length < 3) h += '<button class="mgol-btn" data-a="addr">+ Add reality body</button>';
      } else {
        if (data.bodies.length < 3) h += '<button class="mgol-btn" data-a="addb">+ Add body paragraph</button>';
        if (!data.car) h += '<button class="mgol-btn" data-a="addcar">+ Add counterargument (C.A.R.)</button>';
      }
      return h + '</div>';
    }
    function canCancel() {
      if (!opts.onCancel) return false;
      if (opts.mustPass && submittedHere && !(result && result.pass)) return false;
      return true;
    }

    root.addEventListener('input', function (e) {
      var t = e.target, p = t.getAttribute && t.getAttribute('data-p');
      if (!p) return;
      if (KO.test(t.value)) { KO.lastIndex = 0; t.value = t.value.replace(KO, ''); if (opts.onKorean) opts.onKorean(); }
      KO.lastIndex = 0;
      set(p, t.value);
      save();
      // 색 칸: 바뀐 표시만 가볍게 (다시 그리면 커서가 튐)
      var row = t.closest('.mgol-row'); if (!row || !result || !result.boxes) return;
      var id = row.getAttribute('data-id'), k = null;
      boxList(type, data).forEach(function (x) { if (x.id === id) k = x; });
      if (!k || !result.boxes[id]) return;
      var changed = sent[id] !== boxValue(data, k);
      var box = row.querySelector('.mgol-box');
      box.classList.toggle('stale', changed);
      var dot = row.querySelector('.mgol-dot'); dot.className = 'mgol-dot ' + (changed ? '' : result.boxes[id].c);
      Array.prototype.forEach.call(row.querySelectorAll('.mgol-msg.note'), function (n) { n.style.display = changed ? 'none' : ''; });
    });
    root.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('[data-a]'); if (!b) return;
      var a = b.getAttribute('data-a');
      if (a === 'pass') { if (opts.onPass) opts.onPass(data); return; }
      if (a === 'cancel') { if (opts.onCancel) opts.onCancel(); return; }
      if (a === 'addb') data.bodies.push(body(last));
      else if (a === 'addc') data.cbodies.push(body(last));
      else if (a === 'addr') data.rbodies.push(body(last));
      else if (a === 'addcar') data.car = { counter: '', weak: '', rebut: '' };
      else if (a === 'rm') {
        var w = b.getAttribute('data-w');
        if (w === 'car') data.car = null;
        else { var ps = w.split('.'); data[ps[0]].splice(Number(ps[1]), 1); }
      }
      else if (a === 'fix') { confirmWarn = false; draw(); scrollFirst(check(type, data).warn); return; }
      else if (a === 'anyway') { confirmWarn = false; send(Object.keys(check(type, data).warn)); return; }
      else if (a === 'go') { go(); return; }
      syncPoints(type, data); save(); draw();
    });

    function scrollFirst(map) {
      var ids = Object.keys(map); if (!ids.length) return;
      var row = root.querySelector('.mgol-row[data-id="' + ids[0] + '"]');
      if (row) { row.scrollIntoView({ behavior: 'smooth', block: 'center' }); var i = row.querySelector('input,textarea'); if (i) setTimeout(function () { i.focus(); }, 300); }
    }
    function go() {
      draw.err = '';
      showChecks = true;
      var ch = check(type, data);
      if (Object.keys(ch.block).length) { confirmWarn = false; draw(); scrollFirst(ch.block); return; }
      if (Object.keys(ch.warn).length) { confirmWarn = true; draw(); var c = root.querySelector('.mgol-confirm'); if (c) c.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
      send([]);
    }
    function send(warned) {
      if (busy || !opts.onSubmit) return;
      busy = true; draw();
      var sentData = JSON.parse(JSON.stringify(data));
      opts.onSubmit(sentData, warned, function (res) {
        busy = false;
        if (!res || res.err) { draw.err = (res && res.err) || 'Could not check your outline. Try again.'; draw(); return; }
        submittedHere = true;
        result = res.result; if (result) result.count = res.count;
        snapshotSent(fill(type, sentData));
        showChecks = false;
        if (opts.store) try { localStorage.removeItem(opts.store); } catch (e) {}
        draw();
        root.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (opts.onResult) opts.onResult(res, data);
      });
    }

    if (result) result.count = result.count || opts.count || 0;
    draw();
    return {
      data: function () { return data; },
      text: function () { return text(type, data); },
      setResult: function (r) { result = r; snapshotSent(data); draw(); }
    };
  }

  // ═════════ 그림 (읽기 전용) ═════════
  function view(root, opts) {
    inject();
    opts = opts || {};
    var type = opts.type === 'pivot' ? 'pivot' : 'basic';
    if (!opts.data) { root.innerHTML = '<div class="mgolv"><div class="mgolv-empty">' + esc(opts.empty || 'No outline yet.') + '</div></div>'; return; }
    var o = fill(type, opts.data);
    var R = opts.result && opts.result.boxes ? opts.result.boxes : {};
    var notes = !!opts.notes;
    function dot(id) { var r = R[id]; return '<span class="d ' + (r ? r.c : '') + '"></span>'; }
    function note(id) { var r = R[id]; return notes && r && r.c !== 'g' && r.n ? '<div class="mgolv-note ' + r.c + '">' + esc(r.n) + '</div>' : ''; }
    function v(s) { return String(s || '').trim() ? esc(s) : '<span class="mgolv-empty">—</span>'; }
    function card(id, k, t, cls) { return '<div class="mgolv-card ' + (cls || '') + '"><div class="mgolv-k">' + dot(id) + esc(k) + '</div><div class="mgolv-t">' + v(t) + '</div>' + (notes && R[id] && R[id].c !== 'g' && R[id].n ? '<div class="mgolv-note ' + R[id].c + '" style="margin-left:0">' + esc(R[id].n) + '</div>' : '') + '</div>'; }
    var AR = '<div class="mgolv-ar">↓</div>';
    function bodyHtml(b, pre, name, lastName, back) {
      var t = b.topic;
      return '<div class="mgolv-body"><div class="bh">' + esc(name) + '</div>' +
        li(pre + 't', 'Topic', [t.who ? esc(t.who) : '', t.verb ? '<b>' + esc(t.verb) + '</b>' : '', t.what ? esc(t.what) : ''].filter(Boolean).join(' → '), true) +
        li(pre + 'e', 'Example', (b.page ? 'p.' + esc(b.page) + ' ' : '') + (b.quote ? '“' + esc(b.quote) + '”' : ''), true) +
        li(pre + 'g', 'Before→after', (b.before || b.after ? esc(b.before) + ' → ' + esc(b.after) : '') + (b.sowhat ? '<br><span style="color:#6b7178">so what:</span> ' + esc(b.sowhat) : ''), true) +
        li(pre + 'm', lastName, (b.connection || b.comment) ? '↩ ' + esc(b.connection || b.comment) + (back ? ' <span style="color:#0f6e56;font:11px -apple-system,sans-serif">→ ' + esc(back) + '</span>' : '') : '', true, 'conn') +
        '</div>';
    }
    function li(id, k, html, raw, cls) {
      return '<div class="mgolv-li ' + (cls || '') + '">' + dot(id) + '<span class="lk">' + esc(k) + '</span><span class="lv">' + (html || '<span class="mgolv-empty">—</span>') + '</span></div>' + note(id);
    }
    var h = '';
    if (opts.question !== false && o.question) h += '<div class="mgolv-k" style="margin:0 0 4px">Question</div><div class="mgolv-t" style="margin-bottom:8px;font-weight:bold">' + esc(o.question) + '</div>';
    if (type === 'pivot') {
      h += card('con', 'Concession — seems true', o.concession, 'grey') + AR;
      h += '<div class="mgolv-pts">' + o.points.map(function (p, i) { return '<div class="mgolv-pt"><div class="mgolv-k">' + dot('p' + (i + 1)) + 'Point ' + (i + 1) + '</div><div class="mgolv-t">' + v(p) + '</div>' + (notes && R['p' + (i + 1)] && R['p' + (i + 1)].c !== 'g' ? '<div class="mgolv-note ' + R['p' + (i + 1)].c + '" style="margin-left:0">' + esc(R['p' + (i + 1)].n) + '</div>' : '') + '</div>'; }).join('') + '</div>' + AR;
      o.cbodies.forEach(function (b, i) { h += bodyHtml(b, 'cb' + (i + 1), 'Concession body ' + (i + 1), 'Comment', 'Concession') + AR; });
      h += card('how', 'However — the real thesis', o.however, 'turn') + AR;
      o.rbodies.forEach(function (b, i) { h += bodyHtml(b, 'rb' + (i + 1), 'Reality body ' + (i + 1), 'Comment', 'However') + AR; });
    } else {
      h += card('thesis', 'Thesis', o.thesis, 'main') + AR;
      h += '<div class="mgolv-pts">' + o.points.map(function (p, i) { return '<div class="mgolv-pt"><div class="mgolv-k">' + dot('p' + (i + 1)) + 'Point ' + (i + 1) + '</div><div class="mgolv-t">' + v(p) + '</div>' + (notes && R['p' + (i + 1)] && R['p' + (i + 1)].c !== 'g' ? '<div class="mgolv-note ' + R['p' + (i + 1)].c + '" style="margin-left:0">' + esc(R['p' + (i + 1)].n) + '</div>' : '') + '</div>'; }).join('') + '</div>' + AR;
      o.bodies.forEach(function (b, i) { h += bodyHtml(b, 'b' + (i + 1), 'Body ' + (i + 1), 'Connection', 'Thesis') + AR; });
      if (o.car) h += '<div class="mgolv-card dash"><div class="mgolv-k">C.A.R.</div>' +
        li('carc', 'Counter', esc(o.car.counter) + (o.car.weak ? '<br><span style="color:#6b7178">weak spot:</span> ' + esc(o.car.weak) : ''), true) +
        li('carr', 'Rebut', esc(o.car.rebut), true) + '</div>' + AR;
    }
    h += card('sig', 'Significance', o.significance, 'main');
    root.innerHTML = '<div class="mgolv">' + h + '</div>';
  }

  window.MGOutline = { editor: editor, view: view, text: text, check: check, blank: blank, fill: fill, boxList: boxList, version: 1 };
})();
