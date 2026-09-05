document.addEventListener('DOMContentLoaded', function () {
  var tabs = document.querySelectorAll('.price-tab');
  var panels = document.querySelectorAll('.price-panel');

  function activateTab(targetId) {
    tabs.forEach(function (t) {
      var isMatch = t.getAttribute('data-target') === targetId;
      t.classList.toggle('is-active', isMatch);
      t.setAttribute('aria-selected', isMatch ? 'true' : 'false');
    });
    panels.forEach(function (panel) {
      if (panel.id === targetId) {
        panel.classList.add('is-active');
        panel.removeAttribute('hidden');
      } else {
        panel.classList.remove('is-active');
        panel.setAttribute('hidden', '');
      }
    });
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      activateTab(tab.getAttribute('data-target'));
    });
  });

  var initialId = window.location.hash.replace('#', '');
  var hasMatchingTab = initialId && document.querySelector('.price-tab[data-target="' + initialId + '"]');
  if (hasMatchingTab) {
    activateTab(initialId);
    document.getElementById(initialId).scrollIntoView({ block: 'start' });
  }
});
