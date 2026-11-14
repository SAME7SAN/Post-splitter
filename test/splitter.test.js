const { split, cost } = require("../extension/splitter.js");
const sample = ("هذه جملة تجريبية طويلة نوعًا ما لاختبار التقسيم. ".repeat(30) + "\n\n" +
  "زر https://example.com/a.b.c للمزيد؟ نعم! 😀😀😀 ".repeat(15));
for (const max of [200, 470]) {
  const parts = split(sample, { max, delims: [".", "؟", "!", "،"] });
  console.log("max", max, "parts", parts.length,
    "maxCost", Math.max(...parts.map(cost)),
    "ok", parts.every(p => cost(p) <= max));
  console.log(" first ends:", JSON.stringify(parts[0].slice(-25)));
}
// no-delimiter fallback + hard cut
const p = split("a".repeat(1200), { max: 480, delims: [] });
console.log("hard cut", p.map(cost));
