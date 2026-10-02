// Substitua ou adicione no trecho de verificação do candidato:
function verificarCandidatoDigitado(numero, cargoNome) {
    const partido = numero.substring(0, 2);

    // Permite apenas os partidos 93 e 94
    if (partido !== "93" && partido !== "94") {
        document.getElementById('dadosCandidato').innerHTML = `
            <div style="font-size: 1.4rem; font-weight: bold; margin-top: 10px;">VOTO NULO</div>
            <span style="font-size: 0.8rem;">Partido não permitido nesta votação</span>
        `;
        document.getElementById('imgCandidato').style.display = "none";
        return;
    }

    // Busca o candidato no JSON filtrado
    const candidatoEncontrado = buscarCandidatoNoJSON(numero, cargoNome);

    if (candidatoEncontrado) {
        document.getElementById('dadosCandidato').innerHTML = `
            <strong>Nome:</strong> ${candidatoEncontrado.nome}<br>
            <strong>Partido:</strong> ${candidatoEncontrado.partido}
        `;
        document.getElementById('imgCandidato').src = candidatoEncontrado.foto;
        document.getElementById('imgCandidato').style.display = "block";
    } else {
        document.getElementById('dadosCandidato').innerHTML = `
            <div style="font-size: 1.4rem; font-weight: bold; margin-top: 10px;">VOTO NULO</div>
            <span style="font-size: 0.8rem;">Número não correspondente a nenhum candidato</span>
        `;
        document.getElementById('imgCandidato').style.display = "none";
    }
}