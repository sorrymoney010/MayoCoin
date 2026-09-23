(function () {
  const components = [["Deployer heat", 0.18],["Holder breadth", 0.22],["Two-sided flow", 0.2],["Evidence depth", 0.2],["Freshness", 0.2]];
  function hashString(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function scoreAddress(addr) {
    const clean = addr.trim().toLowerCase();
    const seed = hashString(clean || "empty");
    const parts = components.map(([name], i) => {
      const n = ((seed >>> (i * 5)) & 255) / 255;
      return { name, value: Math.round(38 + n * 57) };
    });
    const total = Math.round(parts.reduce((s, p) => s + p.value, 0) / parts.length);
    const conf = total > 78 ? "HIGH" : total > 58 ? "MED" : "THIN";
    return { total, conf, parts, clean };
  }
  function render(result) {
    const num = document.getElementById("scoreNum");
    if (!num) return;
    document.getElementById("confidence").textContent = result.conf + " confidence";
    num.textContent = result.total;
    document.getElementById("bars").innerHTML = result.parts.map((p) => `<div class="bar-row"><span>${p.name}</span><div class="track"><div class="fill" style="width:${p.value}%"></div></div><span>${p.value}</span></div>`).join("");
    document.getElementById("logBox").innerHTML = `Address ${result.clean.slice(0, 12)}… scored ${result.total}/100.<br>Demo mode: local hash only.`;
  }
  const btn = document.getElementById("scoreBtn");
  const input = document.getElementById("addr");
  if (btn && input) {
    const run = () => render(scoreAddress(input.value));
    btn.addEventListener("click", run);
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") run(); });
    run();
  }
})();
