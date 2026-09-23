(function () {
  const cfg = window.MAYO;
  if (!cfg) return;
  function eth() { return window.ethereum; }
  async function addBase() {
    if (!eth()) throw new Error("No wallet found. Install MetaMask.");
    await eth().request({
      method: "wallet_addEthereumChain",
      params: [{
        chainId: cfg.chain.hexId,
        chainName: "Base",
        nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
        rpcUrls: [cfg.chain.rpc],
        blockExplorerUrls: [cfg.chain.explorer]
      }]
    });
  }
  async function switchBase() {
    if (!eth()) throw new Error("No wallet found. Install MetaMask.");
    try {
      await eth().request({ method: "wallet_switchEthereumChain", params: [{ chainId: cfg.chain.hexId }] });
    } catch (err) {
      if (err && (err.code === 4902 || String(err.message || "").includes("Unrecognized"))) {
        await addBase();
        return;
      }
      throw err;
    }
  }
  async function addToken() {
    const ca = cfg.token && cfg.token.contract;
    if (!ca) throw new Error("No official CA yet.");
    if (!eth()) throw new Error("No wallet found. Install MetaMask.");
    await switchBase();
    await eth().request({
      method: "wallet_watchAsset",
      params: { type: "ERC20", options: { address: ca, symbol: cfg.ticker, decimals: cfg.token.decimals } }
    });
  }
  function bind(id, fn) {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("click", async () => {
      const prev = el.textContent;
      try { el.textContent = "Check MetaMask…"; await fn(); el.textContent = "Done"; }
      catch (err) { el.textContent = prev; alert(err.message || String(err)); }
      setTimeout(() => (el.textContent = prev), 1400);
    });
  }
  bind("addBaseBtn", switchBase);
  bind("addTokenBtn", addToken);
})();
