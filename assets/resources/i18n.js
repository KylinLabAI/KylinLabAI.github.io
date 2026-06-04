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
    loadLang(lang).then(applyTranslations).catch(err => {
      console.error('Failed to load language:', lang, err);
    });
    const sel = document.getElementById('lang-select');
    if(sel) sel.value = lang;
  }

  function loadLang(lang){
    const url = '/assets/resources/lang/' + lang + '.json';
    console.log('Loading language from:', url);
    return fetch(url)
      .then(r => {
        if (!r.ok) {
          throw new Error('HTTP ' + r.status + ': ' + r.statusText);
        }
        return r.json();
      })
      .then(data => {
        console.log('Loaded', Object.keys(data).length, 'translations for', lang);
        return data;
      });
  }

  function applyTranslations(messages){
    const elements = document.querySelectorAll('[data-i18n]');
    console.log('Applying translations to', elements.length, 'elements');
    
    let translated = 0;
    let missing = 0;
    
    elements.forEach(function(el){
      const key = el.getAttribute('data-i18n');
      if(!key) return;
      
      const text = messages[key];
      if(typeof text === 'string'){
        // preserve HTML if element already had inner HTML tags for structure
        if(el.dataset.html === 'true') el.innerHTML = text;
        else el.textContent = text;
        translated++;
      } else {
        missing++;
        console.warn('Missing translation key:', key);
      }
    });
    
    console.log('Translation complete:', translated, 'translated,', missing, 'missing');
  }

  // Wire up selector
  document.addEventListener('DOMContentLoaded', function(){
    console.log('i18n initialized');
    const lang = getPreferredLang();
    console.log('Selected language:', lang);
    
    const sel = document.getElementById('lang-select');
    if(sel){
      sel.addEventListener('change', function(e){ 
        console.log('Language changed to:', e.target.value);
        setLang(e.target.value); 
      });
    }
    setLang(lang);
  });
})();
