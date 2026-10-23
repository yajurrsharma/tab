let suspects = [];
let caseIndex = 0;


async function getpardonTabs() {
  const data = await chrome.storage.local.get("pardonedTabs");
  return data.pardonedTabs || [];
}

async function pardonTabs(tabId) {
  const pardoned = await getpardonTabs();

  if (!pardoned.includes(tabId)) {
    pardoned.push(tabId);
    await chrome.storage.local.set({
      pardonedTabs: pardoned
    });
  }
}

async function countTabs() {
  const tabs = await chrome.tabs.query({});
  const count = tabs.filter(tab => !tab.active).length;

  document.getElementById("tab-count").textContent = count;
}

// async function duplicateTabs() {
//   const tabs = await chrome.tabs.query({});
//   const pardoned = new Set(await getpardonTabs());
//   const seen = new Set();
//   const duplicates = [];
//
//   for (const tab of tabs) {
//     if (!tab.url) continue;
//
//     if (pardoned.has(tab.id)) {
//       seen.add(tab.url);
//       continue;
//     }
//
//     if (seen.has(tab.url)) {
//       duplicates.push(tab);
//     } else {
//       seen.add(tab.url);
//     }
//   }
//
//   const results = document.getElementById("trial-results");
//   results.replaceChildren();
//
//   for (const tab of duplicates) {
//     const casePop = document.createElement("div");
//     casePop.className =
//       "border-b border-neutral-700 py-4 font-mono text-xs";
//
//     const url = document.createElement("p");
//     url.className = "mt-2 break-all text-neutral-400";
//     url.textContent = tab.url;
//
//     const title = document.createElement("p");
//     title.className = "font-bold text-white";
//     title.textContent = tab.title || "Untitled Tab";
//
//     const ques = document.createElement("p");
//     ques.className = "mt-2 text-white";
//     ques.textContent = "Close this duplicate tab?";
//
//     const buttons = document.createElement("div");
//     buttons.className = "mt-4 flex gap-2";
//
//     const keepBtn = document.createElement("button");
//     keepBtn.textContent = "KEEP";
//     keepBtn.className =
//       "min-w-0 flex-1 border border-white bg-white p-2 font-mono text-xs font-bold text-black cursor-pointer transition-colors duration-150 hover:bg-black hover:text-white";
//
//     const closeBtn = document.createElement("button");
//     closeBtn.textContent = "CLOSE";
//     closeBtn.className =
//       "min-w-0 flex-1 border border-red-500 bg-red-500 p-2 font-mono text-xs font-bold text-white cursor-pointer transition-colors duration-150 hover:bg-red-700 hover:border-red-700";
//
//     const pardonBtn = document.createElement("button");
//     pardonBtn.textContent = "IMMUNITY";
//     pardonBtn.className =
//       "min-w-0 flex-1 border border-red-500 bg-black p-2 font-mono text-xs font-bold text-red-500 cursor-pointer transition-colors duration-150 hover:bg-red-500 hover:text-white";
//
//     keepBtn.addEventListener("click", () => {
//       casePop.remove();
//     });
//
//     closeBtn.addEventListener("click", async () => {
//       try {
//         await chrome.tabs.remove(tab.id);
//         casePop.remove();
//         await countTabs();
//       } catch (error) {
//         console.error("failed:", error);
//       }
//     });
//
//     pardonBtn.addEventListener("click", async () => {
//       try {
//         await pardonTabs(tab.id);
//         casePop.remove();
//         await renderPardonRegistry();
//         console.log("pardoned duplicate tab:", tab.id);
//       } catch (error) {
//         console.error("failed:", error);
//       }
//     });
//
//     buttons.append(keepBtn, closeBtn, pardonBtn);
//     casePop.append(title, url, ques, buttons);
//     results.append(casePop);
//   }
//
//   return duplicates;
// }

function formatDur(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;

  return `${seconds}s`;
}

// async function staleTabs(duplicateIds = new Set()) {
//   const tabs = await chrome.tabs.query({});
//   const pardoned = new Set(await getpardonTabs());
//
//   const now = Date.now();
//   const thresh = 5000;
//
//   const stale = tabs.filter(tab => {
//     if (!tab.lastAccessed) return false;
//     if (tab.active) return false;
//     if (tab.pinned) return false;
//     if (duplicateIds.has(tab.id)) return false;
//     if (pardoned.has(tab.id)) return false;
//
//     return now - tab.lastAccessed > thresh;
//   });
//
//   console.log("stale:", stale);
//
//   const results = document.getElementById("stale-results");
//   results.replaceChildren();
//
//   for (const tab of stale) {
//     const casePop = document.createElement("div");
//     casePop.className =
//       "border-b border-neutral-700 py-4 font-mono text-xs";
//
//     const url = document.createElement("p");
//     url.className = "mt-2 break-all text-neutral-400";
//     url.textContent = tab.url || "Unknown URL";
//
//     const title = document.createElement("p");
//     title.className = "font-bold text-white";
//     title.textContent = tab.title || "Untitled Tab";
//
//     const inactive = document.createElement("p");
//     inactive.className = "mt-2 text-red-500";
//
//     const inActivetime = now - tab.lastAccessed;
//     inactive.textContent =
//       `INACTIVE FOR ${formatDur(inActivetime)}`;
//
//     const ques = document.createElement("p");
//     ques.className = "mt-2 text-white";
//     ques.textContent = "Close this stale tab?";
//
//     const buttons = document.createElement("div");
//     buttons.className = "mt-4 flex gap-2";
//
//     const keepBtn = document.createElement("button");
//     keepBtn.textContent = "KEEP";
//     keepBtn.className =
//       "min-w-0 flex-1 border border-white bg-white p-2 font-mono text-xs font-bold text-black cursor-pointer transition-colors duration-150 hover:bg-black hover:text-white";
//
//     const closeBtn = document.createElement("button");
//     closeBtn.textContent = "CLOSE";
//     closeBtn.className =
//       "min-w-0 flex-1 border border-red-500 bg-red-500 p-2 font-mono text-xs font-bold text-white cursor-pointer transition-colors duration-150 hover:bg-red-700 hover:border-red-700";
//
//     const pardonBtn = document.createElement("button");
//     pardonBtn.textContent = "IMMUNITY";
//     pardonBtn.className =
//       "min-w-0 flex-1 border border-red-500 bg-black p-2 font-mono text-xs font-bold text-red-500 cursor-pointer transition-colors duration-150 hover:bg-red-500 hover:text-white";
//
//     keepBtn.addEventListener("click", () => {
//       casePop.remove();
//     });
//
//     closeBtn.addEventListener("click", async () => {
//       try {
//         await chrome.tabs.remove(tab.id);
//         casePop.remove();
//         await countTabs();
//       } catch (error) {
//         console.error("failed:", error);
//       }
//     });
//
//     pardonBtn.addEventListener("click", async () => {
//       try {
//         await pardonTabs(tab.id);
//         casePop.remove();
//         await renderPardonRegistry();
//         console.log("pardoned stale tab:", tab.id);
//       } catch (error) {
//         console.error("failed:", error);
//       }
//     });
//
//     buttons.append(keepBtn, closeBtn, pardonBtn);
//     casePop.append(title, url, inactive, ques, buttons);
//     results.append(casePop);
//   }
// }

async function renderPardonRegistry() {
  const pardonedIds = await getpardonTabs();
  const tabs = await chrome.tabs.query({});

  const results = document.getElementById("pardoned-list");
  results.replaceChildren();

  const pardonedTabs = tabs.filter(tab => pardonedIds.includes(tab.id));

  if (pardonedTabs.length === 0) {
    const empty = document.createElement("p");
    empty.className = "font-mono text-xs text-neutral-400";
    empty.textContent = "NO ACTIVE IMMUNITY.";
    results.append(empty);

    return;
  }

  for (const tab of pardonedTabs) {
    const casePop = document.createElement("div");
    casePop.className = "border-b border-neutral-700 py-4 font-mono text-xs";

    const title = document.createElement("p");
    title.className = "font-bold text-white";
    title.textContent = tab.title || "Untitled Tab";

    const url = document.createElement("p");
    url.className = "mt-2 break-all text-neutral-400";
    url.textContent = tab.url || "Unknown URL";

    const revokeBtn = document.createElement("button");
    revokeBtn.textContent = "REVOKE IMMUNITY";
    revokeBtn.className = "mt-4 w-full border border-red-500 bg-black p-2 font-mono text-xs font-bold text-red-500 cursor-pointer transition-colors duration-150 hover:bg-red-500 hover:text-white";

    revokeBtn.addEventListener("click", async () => {
      try {
        const pardoned = await getpardonTabs();
        const updated = pardoned.filter(id => id !== tab.id);
        await chrome.storage.local.set({
          pardonedTabs: updated
        });

        await renderPardonRegistry();
      } catch (error) {
        console.error("failed: ", error)
      }
    });

    casePop.append(title, url, revokeBtn);
    results.append(casePop)
  }
}

const trialButton = document.getElementById("begin-trial");

trialButton.addEventListener("click", async () => {
  suspects = await getSuspects();

  for (let i = suspects.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [suspects[i], suspects[j]] = [suspects[j], suspects[i]];
  }

  caseIndex = 0;
  document.getElementById("suspect-court").classList.remove("hidden");
  renderSuspect()
});

async function getSuspects() {
  const tabs = await chrome.tabs.query({});
  const pardoned = new Set(await getpardonTabs());
  const seen = new Set();
  const suspect = [];

  const now = Date.now();
  const thresh = 60 * 60 * 1000;

  for (const tab of tabs) {
    if (pardoned.has(tab.id)) continue;

    const charges = [];

    if (tab.url) {
      if (seen.has(tab.url)) {
        charges.push("DUPLICATE");
      } else {
        seen.add(tab.url);
      }
    }

    if (
      typeof tab.lastAccessed === "number" &&
      !tab.active &&
      !tab.pinned &&
      now - tab.lastAccessed > thresh
    ) {
      charges.push(
        `NEGLECT - ${formatDur(now - tab.lastAccessed)}`
      );
    }

    if (charges.length > 0) {
      suspect.push({
        id: tab.id,
        title: tab.title || "Untitled Tab",
        url: tab.url || "",
        charges
      });
    }
  }
  return suspect;
}

function renderSuspect() {
  const results = document.getElementById("suspect-details");
  const counter = document.getElementById("case-number");

  results.replaceChildren();

  if (caseIndex >= suspects.length) {
    counter.textContent = "";

    const finished = document.createElement("p");
    finished.className = "font-mono text-center text-sm text-white";
    finished.textContent = "COURT ADJOURNED. ALL TABS SETTLED.";

    results.append(finished);
    return;
  }

  const tab = suspects[caseIndex];
  counter.textContent = `CASE ${caseIndex + 1}/ ${suspects.length}`;

  const title = document.createElement("p");
  title.className = "font-mono text-sm font-bold text-white";
  title.textContent = tab.title;

  const url = document.createElement("url");
  url.className = "mt-2 break-all font-mono text-xs text-neutral-400";
  url.textContent = tab.url;

  const charges = document.createElement("p");
  charges.className = "mt-4 border border-red-500 p-3";

  const heading = document.createElement("p");
  heading.className = "mb-2 font-mono text-xs font-bold text-red-500";
  heading.textContent = "CHARGES FILED";

  charges.append(heading);

  for (const charge of tab.charges) {
    const item = document.createElement("p");
    item.className = "mt-1 font-mono text-xs text-white";
    item.textContent = `${charge}`;
    charges.append(item);
  }

  const question = document.createElement("p");
  question.className = "mt-4 font-mono text-xs text-white";
  question.textContent = "VERDICT?";

  const buttons = document.createElement("div");
  buttons.className = "mt-4 flex gap-2";

  const keepBtn = document.createElement("button");
    keepBtn.textContent = "KEEP";
    keepBtn.className = "min-w-0 flex-1 border border-white bg-white p-2 font-mono text-xs font-bold text-black cursor-pointer transition-colors duration-150 hover:bg-black hover:text-white";

    const closeBtn = document.createElement("button");
    closeBtn.textContent = "CLOSE";
    closeBtn.className = "min-w-0 flex-1 border border-red-500 bg-red-500 p-2 font-mono text-xs font-bold text-white cursor-pointer transition-colors duration-150 hover:bg-red-700 hover:border-red-700";

    const pardonBtn = document.createElement("button");
    pardonBtn.textContent = "GIVE IMMUNITY";
    pardonBtn.className = "min-w-0 flex-1 border border-red-500 bg-black p-2 font-mono text-xs font-bold text-red-500 cursor-pointer transition-colors duration-150 hover:bg-red-500 hover:text-white";

    keepBtn.addEventListener("click", () => {
      caseIndex++;
      renderSuspect();
    });

    closeBtn.addEventListener("click", async () => {
        try {
          await chrome.tabs.remove(tab.id);
          await countTabs();

          caseIndex++;
          renderSuspect();
        } catch (error) {
          console.error("failed:", error);
        }
      });

    pardonBtn.addEventListener("click", async () => {
        try {
          await pardonTabs(tab.id);
          await renderPardonRegistry();

          caseIndex++;
          renderSuspect();
        } catch (error) {
          console.error("failed:", error);
        }
      });

      buttons.append(keepBtn, closeBtn, pardonBtn);
      results.append(title, url, charges, question, buttons);
}

countTabs();
