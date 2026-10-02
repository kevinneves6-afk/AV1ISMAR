const CODIGO_PARTIDO = "93";
const NOME_PARTIDO = "PDC";

const listaFiliados = [
    { id: 1, nome: "Batman", partido: "PDC", numeroPartido: 93, foto: "https://i.ibb.co/VvzK81K/batman.png" },
    { id: 2, nome: "Flash", partido: "PDC", numeroPartido: 93, foto: "https://i.ibb.co/3s68C72/flash.png" },
    { id: 3, nome: "Superman", partido: "PDC", numeroPartido: 93, foto: "https://i.ibb.co/P44wM9c/superman.png" },
    { id: 4, nome: "Mulher Maravilha", partido: "PDC", numeroPartido: 93, foto: "https://i.ibb.co/q9M2K6G/mulher-maravilha.png" },
    { id: 5, nome: "Arqueiro Verde", partido: "PDC", numeroPartido: 93, foto: "https://i.ibb.co/mSpRcxm/arqueiro-verde.png" },
    { id: 6, nome: "Lanterna Verde", partido: "PDC", numeroPartido: 93, foto: "https://i.ibb.co/4MvR29P/lanterna-verde.png" }
];

let chapaOficial = [];

const REGRAS_CARGOS = {
    "Presidente": { limite: 1, digitos: 2 },
    "Governador": { limite: 1, digitos: 2 },
    "Senador": { limite: 2, digitos: 3 },
    "Deputado Federal": { limite: Infinity, digitos: 4 },
    "Deputado Estadual": { limite: Infinity, digitos: 5 }
};

document.addEventListener("DOMContentLoaded", () => {
    preencherSelectFiliados();
    
    document.getElementById("btnAdicionar").addEventListener("click", adicionarCandidato);
    document.getElementById("btnFinalizar").addEventListener("click", finalizarEBaixarJSON);
});

function preencherSelectFiliados() {
    const select = document.getElementById('filiadoSelect');
    select.innerHTML = '<option value="">Selecione um filiado...</option>';
    
    listaFiliados.forEach(filiado => {
        const option = document.createElement('option');
        option.value = filiado.id;
        option.textContent = filiado.nome;
        select.appendChild(option);
    });
}

function adicionarCandidato() {
    ocultarErro();
    
    const filiadoId = document.getElementById('filiadoSelect').value;
    const cargo = document.getElementById('cargoSelect').value;
    const numero = document.getElementById('numeroInput').value.trim();

    if (!filiadoId || !cargo || !numero) {
        mostrarErro("Preencha todos os campos do formulário.");
        return;
    }

    const filiado = listaFiliados.find(f => f.id == filiadoId);

    const jaIndicado = chapaOficial.some(c => c.id === filiado.id);
    if (jaIndicado) {
        mostrarErro(`O(a) filiado(a) ${filiado.nome} já foi indicado(a) para a chapa!`);
        return;
    }

    const regra = REGRAS_CARGOS[cargo];
    const totalNoCargo = chapaOficial.filter(c => c.cargo === cargo).length;
    if (totalNoCargo >= regra.limite) {
        mostrarErro(`O cargo de ${cargo} já atingiu o limite de ${regra.limite} candidato(s).`);
        return;
    }

    if (!numero.startsWith(CODIGO_PARTIDO)) {
        mostrarErro(`O número do candidato deve começar obrigatoriamente com o número do partido (${CODIGO_PARTIDO}).`);
        return;
    }

    if (numero.length !== regra.digitos) {
        mostrarErro(`Para o cargo de ${cargo}, o número deve conter exatamente ${regra.digitos} dígitos.`);
        return;
    }

    const numeroJaUsado = chapaOficial.some(c => c.numero === numero);
    if (numeroJaUsado) {
        mostrarErro(`O número ${numero} já está atribuído a outro candidato na chapa.`);
        return;
    }

    chapaOficial.push({
        id: filiado.id,
        nome: filiado.nome,
        cargo: cargo,
        numero: numero,
        foto: filiado.foto
    });

    atualizarTabelaChapa();
    limparFormulario();
}

function atualizarTabelaChapa() {
    const tbody = document.getElementById('corpoTabela');
    tbody.innerHTML = '';

    chapaOficial.forEach((candidato, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><img src="${candidato.foto}" alt="${candidato.nome}" class="foto-candidato"></td>
            <td>${candidato.nome}</td>
            <td>${candidato.cargo}</td>
            <td><strong>${candidato.numero}</strong></td>
            <td><button class="btn-remover" onclick="removerCandidato(${index})">Remover</button></td>
        `;
        tbody.appendChild(tr);
    });
}

function removerCandidato(index) {
    chapaOficial.splice(index, 1);
    atualizarTabelaChapa();
}

function limparFormulario() {
    document.getElementById('filiadoSelect').value = '';
    document.getElementById('cargoSelect').value = '';
    document.getElementById('numeroInput').value = '';
}

function mostrarErro(mensagem) {
    document.getElementById('mensagemErro').textContent = mensagem;
}

function ocultarErro() {
    document.getElementById('mensagemErro').textContent = '';
}

function finalizarEBaixarJSON() {
    if (chapaOficial.length === 0) {
        mostrarErro("A chapa está vazia! Adicione pelo menos um candidato antes de finalizar.");
        return;
    }

    const dadosFinais = chapaOficial.map(item => ({
        nome: item.nome,
        numero: item.numero,
        foto: item.foto,
        cargo: item.cargo
    }));

    const jsonData = JSON.stringify(dadosFinais, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'PDC.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}