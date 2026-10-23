async function countTabs() {

  const tabs = await chrome.tabs.query({});

  const count = tabs.length;

  document.getElementById("tab-count").textContent = count;
}


countTabs();
