(function() {
  var lang = document.documentElement.lang || 'es';
  var path = window.location.pathname;

  var targetPath, targetLang, flagEmoji, label;

  if (lang === 'en') {
    // On English page → link to Spanish
    targetPath = path.replace(/^\/en\//, '/').replace(/^\/en$/, '/');
    targetLang = 'ES';
    flagEmoji = '\uD83C\uDDEA\uD83C\uDDF8';
    label = 'ES';
  } else {
    // On Spanish page → link to English
    targetPath = '/en' + (path === '/' ? '/index.html' : path);
    targetLang = 'EN';
    flagEmoji = '\uD83C\uDDEC\uD83C\uDDE7';
    label = 'EN';
  }

  var switcher = document.createElement('a');
  switcher.href = targetPath;
  switcher.setAttribute('aria-label', 'Switch language to ' + targetLang);
  switcher.style.cssText = 'position:fixed;bottom:20px;left:20px;z-index:9999;' +
    'display:flex;align-items:center;gap:8px;' +
    'background:#fff;color:#333;text-decoration:none;' +
    'padding:8px 16px;border-radius:30px;' +
    'box-shadow:0 2px 8px rgba(0,0,0,0.15);' +
    'font-family:system-ui,-apple-system,sans-serif;font-size:14px;font-weight:600;' +
    'transition:box-shadow 0.2s ease;cursor:pointer;border:1px solid #e0e0e0;';

  switcher.innerHTML = '<span style="font-size:18px;line-height:1">' + flagEmoji + '</span>' +
    '<span>' + label + '</span>' +
    '<span style="font-size:10px;opacity:0.5;margin-left:2px">&#x203A;</span>';

  switcher.addEventListener('mouseenter', function() {
    this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
  });
  switcher.addEventListener('mouseleave', function() {
    this.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
  });

  document.body.appendChild(switcher);
})();
