// Multilingual i18n loader with cross-language page navigation
// - Static pages (/, /about.html, /services.html): swap translations in-place via data-i18n
// - Markdown pages (/knowledge/*, /demos/*): navigate to language-specific URL (/zh/...)
(function(){
  // Pages that have separate language-specific versions (server-rendered content)
  var TRANSLATED_PATHS = ['/knowledge.html','/demos.html'];
  var TRANSLATED_PREFIXES = ['/knowledge/','/demos/'];

  function getPreferredLang(){
    var q = new URLSearchParams(location.search).get('lang');
    if(q) return q;
    var stored = localStorage.getItem('site-lang');
    if(stored) return stored;
    var nav = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
    return nav.indexOf('zh') === 0 ? 'zh' : 'en';
  }

  function isTranslatedPage(){
    var path = location.pathname;
    for (var i = 0; i < TRANSLATED_PATHS.length; i++){
      if (path === TRANSLATED_PATHS[i] || path === '/zh' + TRANSLATED_PATHS[i]) return true;
    }
    for (var j = 0; j < TRANSLATED_PREFIXES.length; j++){
      if (path.indexOf(TRANSLATED_PREFIXES[j]) === 0 || path.indexOf('/zh' + TRANSLATED_PREFIXES[j]) === 0) return true;
    }
    return false;
  }

  function getCurrentLang(){
    // For translated pages, use the server-rendered lang attribute
    var sel = document.getElementById('lang-select');
    if (isTranslatedPage()){
      if(sel && sel.dataset.currentLang) return sel.dataset.currentLang;
      if(location.pathname.indexOf('/zh/') === 0) return 'zh';
      return 'en';
    }
    // For static pages, use URL param → localStorage → navigator
    return getPreferredLang();
  }

  // Returns target URL for language switch, or null if in-place swap is needed
  function getTargetUrl(targetLang){
    var path = location.pathname;
    var currentLang = getCurrentLang();

    if (currentLang === targetLang) return null;

    // Only navigate for pages that have separate language-specific versions
    if (!isTranslatedPage()) return null;

    if (targetLang === 'zh'){
      // EN → ZH: prepend /zh to path
      return '/zh' + path;
    } else {
      // ZH → EN: strip /zh prefix
      if (path.indexOf('/zh/') === 0){
        return path.replace('/zh/', '/');
      }
      return '/';
    }
  }

  function setLang(lang){
    var targetUrl = getTargetUrl(lang);

    if (targetUrl){
      // Translated page — navigate to language-specific version
      localStorage.setItem('site-lang', lang);
      window.location.href = targetUrl;
      return;
    }

    // Static page — swap translations in-place
    localStorage.setItem('site-lang', lang);
    loadLang(lang).then(applyTranslations);
    updateNavLinks(lang);
    var sel = document.getElementById('lang-select');
    if(sel) sel.value = lang;
  }

  function loadLang(lang){
    return fetch('/assets/resources/lang/' + lang + '.json').then(function(r){
      return r.ok ? r.json() : {};
    }).catch(function(){
      return {};
    });
  }

  function applyTranslations(messages){
    document.querySelectorAll('[data-i18n]').forEach(function(el){
      var key = el.getAttribute('data-i18n');
      if(!key) return;
      var text = messages[key];
      if(typeof text === 'string'){
        if(el.dataset.html === 'true') el.innerHTML = text;
        else el.textContent = text;
      }
    });
  }

  // Update nav links to point to language-specific pages
  // Static pages always render EN nav links server-side;
  // when the user prefers ZH we rewrite them so tab-switching preserves language.
  function updateNavLinks(lang){
    var isZh = (lang === 'zh');
    document.querySelectorAll('.site-nav a').forEach(function(a){
      var href = a.getAttribute('href');
      if (!href) return;
      // Knowledge link
      if (href === '/knowledge.html' && isZh) a.setAttribute('href', '/zh/knowledge.html');
      else if (href === '/zh/knowledge.html' && !isZh) a.setAttribute('href', '/knowledge.html');
      // Demos link
      else if (href === '/demos.html' && isZh) a.setAttribute('href', '/zh/demos.html');
      else if (href === '/zh/demos.html' && !isZh) a.setAttribute('href', '/demos.html');
    });
  }

  // Wire up selector
  document.addEventListener('DOMContentLoaded', function(){
    var sel = document.getElementById('lang-select');
    if (!sel) return;

    var currentLang = getCurrentLang();
    sel.value = currentLang;
    sel.addEventListener('change', function(e){ setLang(e.target.value); });

    if (isTranslatedPage()){
      // Server-rendered content — language is already correct, just sync selector
      // No translations to load (content comes from markdown → HTML)
    } else {
      // Static page — load translations for preferred language
      loadLang(currentLang).then(applyTranslations);
      // Update nav links to match the current language (server always renders EN links)
      updateNavLinks(currentLang);
    }
  });
})();
