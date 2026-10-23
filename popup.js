async function countTabs() {

  const tabs = await chrome.tabs.query({});

  const count = tabs.length;

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

  document.getElementById("trial-results").classList.remove("hidden");
});
countTabs();
