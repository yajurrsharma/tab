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

  console.log("Dup tabs: ", duplicates)
}

const trialButton = document.getElementById("begin-trial");

trialButton.addEventListener("click", async () => {
  trialButton.textContent = "Court is in session.";
  await duplicateTabs();
});
countTabs();
