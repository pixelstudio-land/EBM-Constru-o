// ==========================================
// CONFIGURAÇÃO DO PIXEL DO META (FACEBOOK)
// ==========================================
// Substitua o ID abaixo pelo ID do seu Pixel
const PIXEL_ID = '743224956543243';

// Código de Inicialização Padrão do Meta
!function (f, b, e, v, n, t, s) {
    if (f.fbq) return; n = f.fbq = function () {
        n.callMethod ?
            n.callMethod.apply(n, arguments) : n.queue.push(arguments)
    };
    if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
    n.queue = []; t = b.createElement(e); t.async = !0;
    t.src = v; s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s)
}(window, document, 'script',
    'https://connect.facebook.net/en_US/fbevents.js');

fbq('init', PIXEL_ID);
fbq('track', 'PageView');

// Adiciona o script de noscript pro cabeçalho automaticamente
const noscript = document.createElement('noscript');
const img = document.createElement('img');
img.height = "1";
img.width = "1";
img.style.display = "none";
img.src = `https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`;
noscript.appendChild(img);
document.head.appendChild(noscript);

// Função auxiliar para rastrear Lead (chamada no js/main.js quando o orçamento é calculado)
function trackLead(valorEstimado) {
    if (typeof fbq === 'function') {
        fbq('track', 'Lead', { value: valorEstimado, currency: 'BRL' });
    }
}
