(function () {
  const cfg = window.MAYO || {};
  const live = cfg.status === "live" && cfg.token && cfg.token.contract;
  document.querySelectorAll("[data-bind]").forEach((el) => {
    const path = el.getAttribute("data-bind").split(".");
    let val = cfg;
    for (const key of path) val = val && val[key];
    if (val === undefined || val === null || val === "") return;
    el.textContent = val;
  });
  document.querySelectorAll("[data-status-live]").forEach((el) => {
    el.classList.toggle("hidden", !live);
  });
  document.querySelectorAll("[data-status-pre]").forEach((el) => {
    el.classList.toggle("hidden", live);
  });
  const ca = (cfg.token && cfg.token.contract) || "";
  document.querySelectorAll("[data-ca]").forEach((el) => {
    el.textContent = live ? ca : "NO CONTRACT YET";
  });
  document.querySelectorAll("[data-copy-ca]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (!live) return;
      try {
        await navigator.clipboard.writeText(ca);
        btn.textContent = "Copied";
        setTimeout(() => (btn.textContent = "Copy CA"), 1200);
      } catch (_) {}
    });
  });
  const trade = document.getElementById("tradeLink");
  if (trade) {
    if (live && cfg.chain && cfg.chain.dex) {
      trade.href = cfg.chain.dex + "?chain=base&outputCurrency=" + encodeURIComponent(ca);
      trade.classList.remove("hidden");
    } else {
      trade.classList.add("hidden");
    }
  }
})();
