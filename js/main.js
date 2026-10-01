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
    if(headerZapBtn) {
        headerZapBtn.href = `https://wa.me/${CONFIG.empresa.whatsapp}`;
    }

    // 1.3 Popular Options de Piso Atual
    const pisoAtualSelect = document.getElementById('pisoAtual');
    if(pisoAtualSelect) {
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
    if(modeloSelect) {
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
                tempOption.value = piso.preco;
                tempOption.innerText = `${piso.nome} - R$ ${piso.preco.toFixed(2).replace('.', ',')}/m²`;
                optgroup.appendChild(tempOption);
            });
            
            modeloSelect.appendChild(optgroup);
        });
    }

    // 1.5 Popular Lista de Bônus no Modal
    const bonusListContainer = document.getElementById('bonusListRenderer');
    if(bonusListContainer) {
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
    if(disclaimerEl && CONFIG.disclaimer) {
        disclaimerEl.innerText = CONFIG.disclaimer;
    }
}

// 2. FUNÇÃO DE CALCULAR E ABRIR MODAL
function calcular() {
    const metragemInput = document.getElementById('metragem').value;
    const metragem = parseFloat(metragemInput.replace(',', '.'));
    
    const modeloEl = document.getElementById('modelo');
    const modeloPreco = parseFloat(modeloEl.value);
    const selectedOption = (modeloEl.selectedIndex >= 0 && modeloEl.options) ? modeloEl.options[modeloEl.selectedIndex] : null;
    const modeloNome = selectedOption ? (selectedOption.innerText || selectedOption.text || '') : '';

    const pisoAtual = document.getElementById('pisoAtual');
    const selectedPisoAtual = (pisoAtual.selectedIndex >= 0 && pisoAtual.options) ? pisoAtual.options[pisoAtual.selectedIndex] : null;
    const pisoAtualNome = selectedPisoAtual ? (selectedPisoAtual.innerText || selectedPisoAtual.text || '') : '';
    
    const nivelamentoEl = document.getElementById('nivelamento');
    const selectedNivelamento = (nivelamentoEl.selectedIndex >= 0 && nivelamentoEl.options) ? nivelamentoEl.options[nivelamentoEl.selectedIndex] : null;
    const nivelamentoNome = selectedNivelamento ? (selectedNivelamento.innerText || selectedNivelamento.text || '') : '';

    if (isNaN(metragem) || metragem < 1) {
        alert("Por favor, digite uma metragem válida.");
        return;
    }

    // Lógica de Preço
    let total = metragem * modeloPreco;
    const valorFormatado = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    
    // Seta visualmente no modal
    document.getElementById('valorFinal').innerText = valorFormatado;

    // Gerar Link do WhatsApp com condições da EBM Construção
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

    const link = `https://wa.me/${CONFIG.empresa.whatsapp}?text=${encodeURIComponent(textoZap)}`;
    document.getElementById('linkZap').href = link;
    
    // Abre modal
    document.getElementById('modalResult').style.display = 'flex';

    // Dispara Evento pro Pixel (função no pixel.js)
    if(typeof trackLead === 'function') {
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
