// منطق التقسيم (مستقل عن الواجهة ليسهل اختباره)
(function (root) {
  // طول النص كما يحسبه Threads: الإيموجي (خارج BMP) يُحسب 4
  function cost(str) {
    let n = 0;
    for (const ch of str) n += ch.codePointAt(0) > 0xffff ? 4 : 1;
    return n;
  }

  // أكبر فهرس i بحيث cost(text.slice(0, i)) <= max
  function windowEnd(text, max) {
    let n = 0, i = 0;
    for (const ch of text) {
      const c = ch.codePointAt(0) > 0xffff ? 4 : 1;
      if (n + c > max) break;
      n += c;
      i += ch.length;
    }
    return i;
  }

  // ابحث عن أنسب نقطة قطع داخل النافذة [0, end]
  function findCut(text, end, delims, minRatio) {
    const min = Math.floor(end * minRatio);
    const isBoundary = (p) => p >= text.length || /\s/.test(text[p]);

    // 1) فاصل فقرة
    for (let p = end; p > min; p--) {
      if (text[p - 1] === "\n" && text[p - 2] === "\n" && p - 2 >= 0) return p;
    }
    // 2) علامات المستخدم (تُقبل فقط إذا أعقبها فراغ أو نهاية، لتجنب كسر الروابط)
    for (let p = end; p > min; p--) {
      for (const d of delims) {
        if (d && text.slice(p - d.length, p) === d && isBoundary(p)) return p;
      }
    }
    // 3) سطر جديد
    for (let p = end; p > min; p--) if (text[p - 1] === "\n") return p;
    // 4) أي مسافة
    for (let p = end; p > 0; p--) if (/\s/.test(text[p - 1])) return p;
    // 5) قطع قسري
    return end;
  }

  function split(input, opts) {
    const max = opts.max;
    const delims = opts.delims || [];
    let text = input.replace(/\r\n/g, "\n").trim();
    const parts = [];
    while (text.length) {
      if (cost(text) <= max) { parts.push(text.trim()); break; }
      const end = windowEnd(text, max);
      let cut = findCut(text, end, delims, 0.4);
      if (cut <= 0) cut = end || 1;
      parts.push(text.slice(0, cut).trim());
      text = text.slice(cut).trim();
    }
    return parts.filter(Boolean);
  }

  const api = { cost, split };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.Splitter = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
