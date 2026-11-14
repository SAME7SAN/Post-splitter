const $ = (id) => document.getElementById(id);
const LIMIT = 500;
const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

let parts = [];      // نصوص الأجزاء (قابلة للتعديل)
let done = [];       // هل نُسخ الجزء؟
let numbering = true;

// ---- استعادة الإعدادات ----
$("source").value = store.get("source", "");
$("max").value = store.get("max", 480);
$("delims").value = store.get("delims", ". ؟ ! ؛ ، ?");
$("numbering").checked = store.get("numbering", true);
["source", "max", "delims"].forEach((id) => $(id).addEventListener("input", () => store.set(id, id === "max" ? +$(id).value : $(id).value)));
$("numbering").addEventListener("change", () => store.set("numbering", $("numbering").checked));

// ---- التقسيم ----
$("split").addEventListener("click", () => {
  const text = $("source").value.trim();
  if (!text) { $("source").focus(); return; }
  const max = Math.min(LIMIT, Math.max(50, +$("max").value || 480));
  numbering = $("numbering").checked;
  const reserve = numbering ? 10 : 0; // مساحة لـ "\n(12/12)"
  const delims = $("delims").value.split(/\s+/).filter(Boolean);
  parts = Splitter.split(text, { max: max - reserve, delims });
  done = parts.map(() => false);
  if (numbering && parts.length > 1) {
    parts = parts.map((p, i) => `${p}\n(${i + 1}/${parts.length})`);
  }
  $("input-view").hidden = true;
  $("parts-view").hidden = false;
  render();
});
$("back").addEventListener("click", () => {
  $("parts-view").hidden = true;
  $("input-view").hidden = false;
});

// ---- النسخ ----
async function copyText(text) {
  try { await navigator.clipboard.writeText(text); }
  catch {
    const t = document.createElement("textarea");
    t.value = text; document.body.appendChild(t); t.select();
    document.execCommand("copy"); t.remove();
  }
}
function nextIndex() { return done.findIndex((d) => !d); }

async function copyPart(i) {
  await copyText(parts[i]);
  done[i] = true;
  render();
}
$("next").addEventListener("click", () => { const i = nextIndex(); if (i >= 0) copyPart(i); });

// ---- العرض ----
function render() {
  const list = $("parts");
  const cur = nextIndex();
  list.innerHTML = "";
  parts.forEach((text, i) => {
    const li = document.createElement("li");
    li.className = "part" + (i === cur ? " current" : "") + (done[i] ? " done" : "");

    const head = document.createElement("div");
    head.className = "part-head";
    const title = document.createElement("span");
    title.textContent = `الجزء ${i + 1} من ${parts.length}`;
    const count = document.createElement("span");
    count.className = "count";
    head.append(title, count);

    const ta = document.createElement("textarea");
    ta.dir = "auto"; ta.value = text;
    const updateCount = () => {
      const n = Splitter.cost(ta.value);
      count.textContent = `${n} / ${LIMIT}`;
      count.classList.toggle("over", n > LIMIT);
    };
    ta.addEventListener("input", () => { parts[i] = ta.value; done[i] = false; updateCount(); });
    updateCount();

    const actions = document.createElement("div");
    actions.className = "part-actions";
    if (done[i]) { const ok = document.createElement("span"); ok.className = "copied"; ok.textContent = "✓ تم النسخ"; actions.append(ok); }
    const btn = document.createElement("button");
    btn.textContent = done[i] ? "انسخ مرة أخرى" : "انسخ";
    btn.addEventListener("click", () => copyPart(i));
    actions.append(btn);

    li.append(head, ta, actions);
    list.append(li);
  });

  const total = parts.length, copied = done.filter(Boolean).length;
  $("progress").textContent = `${copied} من ${total} منسوخ`;
  const n = $("next");
  if (cur >= 0) { n.disabled = false; n.textContent = `انسخ الجزء التالي (${cur + 1}/${total})`; }
  else { n.disabled = true; n.textContent = "تم نسخ كل الأجزاء ✓"; }
}
