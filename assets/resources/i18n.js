// Simple i18n loader: selects language, loads JSON, and replaces elements with data-i18n
(function(){
  function getPreferredLang(){
    const q = new URLSearchParams(location.search).get('lang');
    if(q) return q;
    const stored = localStorage.getItem('site-lang');
    if(stored) return stored;
    const nav = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
    return nav.indexOf('zh') === 0 ? 'zh' : 'en';
  }

  function setLang(lang){
    localStorage.setItem('site-lang', lang);
    loadLang(lang).then(applyTranslations);
    const sel = document.getElementById('lang-select');
    if(sel) sel.value = lang;
  }

  function loadLang(lang){
    return fetch('/assets/resources/lang/' + lang + '.json').then(r=>r.ok? r.json(): {}).catch(()=>({}));
  }

  function applyTranslations(messages){
    document.querySelectorAll('[data-i18n]').forEach(function(el){
      const key = el.getAttribute('data-i18n');
      if(!key) return;
      const text = messages[key];
      if(typeof text === 'string'){
        // preserve HTML if element already had inner HTML tags for structure
        if(el.dataset.html === 'true') el.innerHTML = text;
        else el.textContent = text;
      }
    });
  }

  // Wire up selector
  document.addEventListener('DOMContentLoaded', function(){
    const lang = getPreferredLang();
    const sel = document.getElementById('lang-select');
    if(sel){
      sel.addEventListener('change', function(e){ setLang(e.target.value); });
    }
    setLang(lang);
  });
})();
