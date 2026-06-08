(function () {
  const tabs = Array.from(document.querySelectorAll('.tab'));
  const panels = Array.from(document.querySelectorAll('.tab-panel'));

  function activateTab(tabKey) {
    tabs.forEach((tab) => {
      const selected = tab.dataset.tab === tabKey;
      tab.classList.toggle('is-active', selected);
      tab.setAttribute('aria-selected', String(selected));
    });

    panels.forEach((panel) => {
      panel.classList.toggle('is-active', panel.dataset.panel === tabKey);
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => activateTab(tab.dataset.tab));
  });
})();
