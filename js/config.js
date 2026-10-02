// ==========================================
// ARQUIVO GESTOR DE TRÁFEGO E CONFIG. GERAIS - EBM CONSTRUÇÃO
// ==========================================

const CONFIG = {
    // 1. DADOS DA EMPRESA E ATENDIMENTO
    empresa: {
        nome1: "EBM",
        nome2: "CONSTRUÇÃO", // Aparece em destaque (com a cor primária)
        whatsapp: "5511981914683" // WhatsApp oficial da EBM Construção
    },

    // 2. OPÇÕES DE PISOS E PREÇOS (O Select será populado sozinho no HTML)
    // Vinílico colocado: R$ 160/m²; Mão de obra de instalação: R$ 70/m².
    // Piso Laminado: sob consulta (sem precificação fixa), com CTA direto para WhatsApp.
    pisos: [
        {
            categoria: "Piso Vinílico (Pacote Completo)",
            nome: "Piso Vinílico Colocado (Material + Instalação)",
            preco: 160.00,
            descricao: "Piso vinílico fornecido e instalado com equipe especializada"
        },
        {
            categoria: "Mão de Obra / Instalação",
            nome: "Somente Instalação (Mão de Obra)",
            preco: 70.00,
            descricao: "Mão de obra profissional de instalação de piso vinílico"
        },
        {
            categoria: "Pisos Laminados",
            nome: "Piso Laminado",
            preco: null,
            sobConsulta: true,
            textoSelect: "Piso Laminado (Sob Consulta no WhatsApp)",
            descricao: "Orçamento sob medida e catálogo de modelos direto com o especialista"
        }
    ],

    // 3. OPÇÕES DE PISO ATUAL (Select 1)
    opcoesPisoAtual: [
        { valor: "Contrapiso", texto: "Contrapiso (Cimento)" },
        { valor: "Cerâmica", texto: "Cerâmica / Porcelanato" },
        { valor: "Madeira", texto: "Madeira / Taco" },
        { valor: "Outro", texto: "Outro / Não sei" }
    ],

    // 4. BÔNUS E INCLUSÕES NO ORÇAMENTO (Aparece no final, no modal)
    // Condições comerciais: Visita Gratuita, Desconto de até 5% à vista
    bonus: [
        { titulo: "Visita Técnica no Local", subtitulo: "GRATUITA", strike: "R$ 150", gratis: true },
        { titulo: "Condição Especial", subtitulo: "ATÉ 5% OFF À VISTA", strike: "", gratis: true },
        { titulo: "Mão de Obra Especializada", subtitulo: "INCLUSO", strike: "", gratis: true },
        { titulo: "Garantia de Instalação", subtitulo: "GARANTIDA", strike: "", gratis: true }
    ],

    // 5. OBSERVAÇÕES E DISCLAIMER NO RODAPÉ DO RESULTADO
    disclaimer: "*Valor estimado. Visita técnica gratuita necessária para validar metragem e contrapiso."
};
