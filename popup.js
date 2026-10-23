async function countTabs() {

  const tabs = await chrome.tabs.query({});

  const count = tabs.length - 1;

  document.getElementById("tab-count").textContent = count;
}

async function duplicateTabs() {
  const tabs = await chrome.tabs.query({});
  const seen = new Set();
  const duplicates = [];

  for (const tab of tabs) {
    if (!tab.url) continue;

    if (seen.has(tab.url)) {
      duplicates.push(tab)
    } else {
      seen.add(tab.url)
    }
  }

  console.log("Dup tabs: ", duplicates.map(tab => ({
    id: tab.id,
    title: tab.title,
    url: tab.url
  })))

  const results = document.getElementById("trial-results");
  results.replaceChildren();

  for (const tab of duplicates) {
    const casePop = document.createElement("div");

    casePop.className = "border-b border-neutral-700 py-4 font-mono text-xs";

    const url = document.createElement("p");
    url.className = "mt-2 break-all text-neutral-400";
    url.textContent = tab.url;

    const title = document.createElement("p");
    title.className = "font-bold text-white";
    title.textContent = `${tab.title || "Untitled Tab"}`;

    const ques = document.createElement("p");
    ques.className = "mt-2 text-white";
    ques.textContent = "Close this duplicate tab?";

    const buttons = document.createElement("div");
    buttons.className = "mt-4 flex gap-2";

    const keepBtn = document.createElement("button");
    keepBtn.textContent = "KEEP";
    keepBtn.className = "min-w-0 flex-1 border border-white bg-white p-2 font-mono text-xs font-bold text-black cursor-pointer transition-colors duration-150 hover:bg-black hover:text-white";

    const closeBtn = document.createElement("button");
    closeBtn.textContent = "CLOSE";
    closeBtn.className = "min-w-0 flex-1 border border-red-500 bg-red-500 p-2 font-mono text-xs font-bold text-white cursor-pointer transition-colors duration-150 hover:bg-red-700 hover:border-red-700";

    keepBtn.addEventListener("click", () => {
      casePop.remove();
    })

    closeBtn.addEventListener("click", async () => {
      try {
        await chrome.tabs.remove(tab.id);

        casePop.remove();
        await countTabs();
      } catch (error) {
        console.error("failed: ", error);
      }
    });

    buttons.append(keepBtn, closeBtn)


    casePop.append(title, url, ques, buttons);
    results.append(casePop);

  }
}

const trialButton = document.getElementById("begin-trial");

trialButton.addEventListener("click", async () => {
  trialButton.textContent = "Court is in session.";
  await duplicateTabs();
  await staleTabs();

  document.getElementById("trial-results").classList.remove("hidden");
  document.getElementById("stale-results").classList.remove("hidden");
});

function formatDur(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`
}

async function staleTabs() {
  const tabs = await chrome.tabs.query({});

  // console.table(tabs.map(tab => ({
  //   title: tab.title,
  //   lastAccessed: tab.lastAccessed,
  //   active: tab.active
  // })));

  const now = Date.now();

  const thresh = 5000;

  console.table(tabs.map(tab => ({
    title: tab.title,
    inactiveSeconds: (now - tab.lastAccessed) / 1000,
    active: tab.active,
    pinned: tab.pinned,
    exceedsThreshold: now - tab.lastAccessed > thresh
  })));

  const stale = tabs.filter(tab => {
    if (!tab.lastAccessed) return false;
    if (tab.active) return false;
    if (tab.pinned) return false;

    return now - tab.lastAccessed > thresh;
  });

  console.log("stale tabs: ", stale)

  const results = document.getElementById("stale-results");
  results.replaceChildren();

  for (const tab of stale) {
    const casePop = document.createElement("div");
    casePop.className = "border-b border-neutral-700 py-4 font-mono text-xs";

    const url = document.createElement("p");
    url.className = "mt-2 break-all text-neutral-400";
    url.textContent = tab.url;

    const title = document.createElement("p");
    title.className = "font-bold text-white";
    title.textContent = tab.title || "Untitled Tab";

    const inactive = document.createElement("p");
    inactive.className = "mt-2 text-red-500";

    const inActivetime = now - tab.lastAccessed;
    inactive.textContent = `INACTIVE FOR ${formatDur(inActivetime)}`;

    const ques = document.createElement("p");
    ques.className = "mt-2 text-white";
    ques.textContent = "Close this stale tab?";

    const buttons = document.createElement("div");
    buttons.className = "mt-4 flex gap-2";

    const keepBtn = document.createElement("button");
    keepBtn.textContent = "KEEP";
    keepBtn.className = "min-w-0 flex-1 border border-white bg-white p-2 font-mono text-xs font-bold text-black cursor-pointer transition-colors duration-150 hover:bg-black hover:text-white";

    const closeBtn = document.createElement("button");
    closeBtn.textContent = "CLOSE";
    closeBtn.className = "min-w-0 flex-1 border border-red-500 bg-red-500 p-2 font-mono text-xs font-bold text-white cursor-pointer transition-colors duration-150 hover:bg-red-700 hover:border-red-700";

    keepBtn.addEventListener("click", () => {
      casePop.remove();
    })

    closeBtn.addEventListener("click", async () => {
      try {
        await chrome.tabs.remove(tab.id);

        casePop.remove();
        await countTabs();
      } catch (error) {
        console.error("failed: ", error);
      }
    });

    buttons.append(keepBtn, closeBtn)
    casePop.append(title, url, inactive, ques, buttons);
    results.append(casePop);

  }
}

countTabs();
