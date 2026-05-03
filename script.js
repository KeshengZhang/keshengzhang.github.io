function toggleBibtex(articleid) {
  var bib = document.getElementById('bib_' + articleid);
  if (bib) {
    if (bib.className.indexOf('bibtex') !== -1) {
      bib.className = bib.className.indexOf('noshow') === -1 ? 'bibtex noshow' : 'bibtex';
    }
  }
}

function showCopyTooltip(message, anchor) {
  var tooltip = document.getElementById('copy-tooltip');
  if (!tooltip) {
    tooltip = document.createElement('div');
    tooltip.id = 'copy-tooltip';
    tooltip.className = 'copy-tooltip';
    document.body.appendChild(tooltip);
  }
  tooltip.textContent = message;
  var rect = anchor.getBoundingClientRect();
  tooltip.style.left = Math.min(window.innerWidth - 220, rect.left + window.pageXOffset + 10) + 'px';
  tooltip.style.top = Math.max(10, rect.top + window.pageYOffset - 40) + 'px';
  tooltip.classList.add('visible');
  clearTimeout(window._copyTooltipTimer);
  window._copyTooltipTimer = setTimeout(function() {
    tooltip.classList.remove('visible');
  }, 1200);
}

function fallbackCopyText(text, anchor) {
  var textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  try {
    document.execCommand('copy');
    showCopyTooltip('已复制：' + text, anchor);
  } catch (err) {
    showCopyTooltip('复制失败，请手动复制', anchor);
  }
  document.body.removeChild(textarea);
}

function handleEmailCopy(event) {
  event.preventDefault();
  var link = event.currentTarget;
  var value = link.getAttribute('data-copy') || link.textContent.trim();
  if (!value) return;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(value).then(function() {
      showCopyTooltip('已复制：' + value, link);
    }, function() {
      fallbackCopyText(value, link);
    });
  } else {
    fallbackCopyText(value, link);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  var emailLinks = document.querySelectorAll('#email-copy-link, #email-copy-link2');
  emailLinks.forEach(function(link) {
    link.addEventListener('click', handleEmailCopy);
  });
});
