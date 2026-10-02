// Função que é chamada ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
    inicializarDadosEstruturais();
});

// 1. POPULA OS DADOS VISUAIS (Logo, Nomes, Selects, Bônus, Disclaimer)
function inicializarDadosEstruturais() {
    // 1.1 Nome da Marca (Header e Footer)
    const brandElements = document.querySelectorAll('.dynamic-brand');
    brandElements.forEach(el => {
        el.innerHTML = `${CONFIG.empresa.nome1} <span style="color: var(--primary);">${CONFIG.empresa.nome2}</span>`;
    });
    
    // Altera nomes em títulos de feature
    const h2BrandElements = document.querySelectorAll('.dynamic-feature-brand');
    h2BrandElements.forEach(el => {
        el.innerHTML = `<span style="color:var(--primary)">${CONFIG.empresa.nome1} ${CONFIG.empresa.nome2}</span>`;
    });

    // 1.2 Whatsapp Header Link
    const headerZapBtn = document.getElementById('headerZapBtn');
    if (headerZapBtn) {
        headerZapBtn.href = `https://wa.me/${CONFIG.empresa.whatsapp}`;
    }

    // 1.3 Popular Options de Piso Atual
    const pisoAtualSelect = document.getElementById('pisoAtual');
    if (pisoAtualSelect) {
        pisoAtualSelect.innerHTML = '';
        CONFIG.opcoesPisoAtual.forEach(op => {
            const tempOption = document.createElement('option');
            tempOption.value = op.valor;
            tempOption.innerText = op.texto;
            pisoAtualSelect.appendChild(tempOption);
        });
    }

    // 1.4 Popular Select de Modelos de Piso com Categorias
    const modeloSelect = document.getElementById('modelo');
    if (modeloSelect) {
        modeloSelect.innerHTML = '';
        
        // Agrupar por categorias
        const categorias = [...new Set(CONFIG.pisos.map(item => item.categoria))];
        
        categorias.forEach(cat => {
            const optgroup = document.createElement('optgroup');
            optgroup.label = cat;
            
            // Pega pisos da categoria atual
            const pisosDaCategoria = CONFIG.pisos.filter(p => p.categoria === cat);
            pisosDaCategoria.forEach(piso => {
                const tempOption = document.createElement('option');
                const isSobConsulta = Boolean(piso.sobConsulta || piso.preco === null || piso.preco === undefined);

                if (isSobConsulta) {
                    tempOption.value = "sob_consulta";
                    tempOption.innerText = piso.textoSelect || `${piso.nome} (Sob Consulta no WhatsApp)`;
                    tempOption.dataset.sobConsulta = "true";
                } else {
                    tempOption.value = piso.preco;
                    tempOption.innerText = `${piso.nome} - R$ ${piso.preco.toFixed(2).replace('.', ',')}/m²`;
                    tempOption.dataset.sobConsulta = "false";
                }

                tempOption.dataset.nome = piso.nome;
                optgroup.appendChild(tempOption);
            });
            
            modeloSelect.appendChild(optgroup);
        });

        // Ouvir mudanças para alternar o texto e estilo do botão de cálculo
        modeloSelect.addEventListener('change', atualizarBotaoCalculo);
        atualizarBotaoCalculo();
    }

    // 1.5 Popular Lista de Bônus no Modal
    const bonusListContainer = document.getElementById('bonusListRenderer');
    if (bonusListContainer) {
        bonusListContainer.innerHTML = '';
        CONFIG.bonus.forEach(bonus => {
            const div = document.createElement('div');
            div.className = `bonus-item ${bonus.gratis ? 'free' : ''}`;
            
            let strikeHtml = bonus.strike ? `<span class="strike">${bonus.strike}</span> ` : '';
            div.innerHTML = `
                <span><i class="fas fa-check"></i> ${bonus.titulo}</span>
                <span>${strikeHtml}${bonus.subtitulo}</span>
            `;
            bonusListContainer.appendChild(div);
        });
    }

    // 1.6 Atualizar Disclaimer se existir
    const disclaimerEl = document.querySelector('.disclaimer');
    if (disclaimerEl && CONFIG.disclaimer) {
        disclaimerEl.innerText = CONFIG.disclaimer;
    }
}

// Alterna o botão da calculadora caso a opção seja "Sob Consulta" (CTA direto pro WhatsApp)
function atualizarBotaoCalculo() {
    const modeloEl = document.getElementById('modelo');
    const btnCalc = document.getElementById('btnCalc');
    if (!modeloEl || !btnCalc) return;

    const selectedOption = (modeloEl.selectedIndex >= 0 && modeloEl.options) ? modeloEl.options[modeloEl.selectedIndex] : null;
    const isSobConsulta = selectedOption && (selectedOption.dataset.sobConsulta === "true" || selectedOption.value === "sob_consulta");

    if (isSobConsulta) {
        btnCalc.innerHTML = '<i class="fab fa-whatsapp"></i> CONSULTAR NO WHATSAPP';
        btnCalc.style.background = 'var(--accent)';
        btnCalc.style.color = '#ffffff';
    } else {
        btnCalc.innerText = 'VER PREÇO ESTIMADO';
        btnCalc.style.background = 'var(--primary)';
        btnCalc.style.color = 'var(--secondary)';
    }
}

// 2. FUNÇÃO DE CALCULAR E ABRIR MODAL COM CTA
function calcular() {
    const modeloEl = document.getElementById('modelo');
    const selectedOption = (modeloEl.selectedIndex >= 0 && modeloEl.options) ? modeloEl.options[modeloEl.selectedIndex] : null;
    const isSobConsulta = selectedOption && (selectedOption.dataset.sobConsulta === "true" || selectedOption.value === "sob_consulta");
    const modeloNome = selectedOption ? (selectedOption.dataset.nome || selectedOption.innerText || selectedOption.text || '') : '';

    const metragemInput = document.getElementById('metragem').value;
    const metragem = parseFloat(metragemInput.replace(',', '.'));

    const pisoAtual = document.getElementById('pisoAtual');
    const selectedPisoAtual = (pisoAtual.selectedIndex >= 0 && pisoAtual.options) ? pisoAtual.options[pisoAtual.selectedIndex] : null;
    const pisoAtualNome = selectedPisoAtual ? (selectedPisoAtual.innerText || selectedPisoAtual.text || '') : '';
    
    const nivelamentoEl = document.getElementById('nivelamento');
    const selectedNivelamento = (nivelamentoEl.selectedIndex >= 0 && nivelamentoEl.options) ? nivelamentoEl.options[nivelamentoEl.selectedIndex] : null;
    const nivelamentoNome = selectedNivelamento ? (selectedNivelamento.innerText || selectedNivelamento.text || '') : '';

    const modalTituloEl = document.getElementById('modalTitulo');
    const modalLabelEl = document.getElementById('modalLabel');
    const valorFinalEl = document.getElementById('valorFinal');
    const linkZapEl = document.getElementById('linkZap');
    const disclaimerEl = document.querySelector('.disclaimer');

    // Fluxo especial: Piso Laminado ou item sob consulta (CTA direto pro WhatsApp)
    if (isSobConsulta) {
        const metragemTexto = (!isNaN(metragem) && metragem >= 1) ? `${metragem}m²` : "A definir / Sob medida";

        if (modalTituloEl) modalTituloEl.innerText = "Orçamento de Piso Laminado";
        if (modalLabelEl) modalLabelEl.innerText = "Condição Exclusiva";
        if (valorFinalEl) {
            valorFinalEl.innerText = "Sob Consulta";
            valorFinalEl.style.fontSize = "2rem";
        }
        if (linkZapEl) {
            linkZapEl.innerHTML = 'CONSULTAR NO WHATSAPP <i class="fab fa-whatsapp"></i>';
        }
        if (disclaimerEl) {
            disclaimerEl.innerText = "*Para Piso Laminado, nossa equipe envia o catálogo completo e orçamento sob medida pelo WhatsApp.";
        }

        const textoZap = `Olá, ${CONFIG.empresa.nome1} ${CONFIG.empresa.nome2}! Fiz uma simulação no site:\n\n` +
            `📐 *Metragem:* ${metragemTexto}\n` +
            `🪵 *Opção:* Piso Laminado (Sob Consulta)\n` +
            `🎁 *Visita Técnica:* Gratuita no local\n` +
            `💰 *Condição:* Até 5% desc. à vista\n\n` +
            `ℹ️ *Local:*\n` +
            `- Piso Atual: ${pisoAtualNome}\n` +
            `- Nivelamento: ${nivelamentoNome}\n\n` +
            `Gostaria de ver as opções de Piso Laminado e agendar uma visita técnica gratuita!`;

        if (linkZapEl) {
            linkZapEl.href = `https://wa.me/${CONFIG.empresa.whatsapp}?text=${encodeURIComponent(textoZap)}`;
        }

        document.getElementById('modalResult').style.display = 'flex';

        if (typeof trackLead === 'function') {
            trackLead(0);
        }
        return;
    }

    // Fluxo padrão para itens com cálculo de preço por m²
    if (isNaN(metragem) || metragem < 1) {
        alert("Por favor, digite uma metragem válida.");
        return;
    }

    const modeloPreco = parseFloat(modeloEl.value);
    let total = metragem * modeloPreco;
    const valorFormatado = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    
    if (modalTituloEl) modalTituloEl.innerText = "Orçamento Estimado";
    if (modalLabelEl) modalLabelEl.innerText = "Investimento Aproximado";
    if (valorFinalEl) {
        valorFinalEl.innerText = valorFormatado;
        valorFinalEl.style.fontSize = "2.2rem";
    }
    if (linkZapEl) {
        linkZapEl.innerHTML = 'AGENDAR VISITA GRATUITA <i class="fab fa-whatsapp"></i>';
    }
    if (disclaimerEl && CONFIG.disclaimer) {
        disclaimerEl.innerText = CONFIG.disclaimer;
    }

    // Gerar Link do WhatsApp
    const nomeComercialPiso = modeloNome.includes('-') ? modeloNome.split('-')[0].trim() : modeloNome.trim();
    const textoZap = `Olá, ${CONFIG.empresa.nome1} ${CONFIG.empresa.nome2}! Fiz uma simulação no site:\n\n` +
        `📐 *Metragem:* ${metragem}m²\n` +
        `🪵 *Opção:* ${nomeComercialPiso}\n` +
        `💰 *Valor Estimado:* ${valorFormatado} (até 5% desc. à vista)\n` +
        `🎁 *Visita Técnica:* Gratuita no local\n\n` +
        `ℹ️ *Local:*\n` +
        `- Piso Atual: ${pisoAtualNome}\n` +
        `- Nivelamento: ${nivelamentoNome}\n\n` +
        `Gostaria de agendar a visita técnica gratuita!`;

    if (linkZapEl) {
        linkZapEl.href = `https://wa.me/${CONFIG.empresa.whatsapp}?text=${encodeURIComponent(textoZap)}`;
    }
    
    // Abre modal
    document.getElementById('modalResult').style.display = 'flex';

    // Dispara Evento pro Pixel (função no pixel.js)
    if (typeof trackLead === 'function') {
        trackLead(total);
    }
}

// 3. FECHAR MODAL
function fecharModal() {
    document.getElementById('modalResult').style.display = 'none';
}

window.onclick = function (event) {
    const modal = document.getElementById('modalResult');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
