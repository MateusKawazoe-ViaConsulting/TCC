function calcularXpProximoNivel(nivel) {
    let proximoNivel = nivel + 1
    return (50 / 3 * (Math.pow(proximoNivel, 3) - (6 * Math.pow(proximoNivel, 2)) + (17 * proximoNivel) - 12)) / 100
}

function calcularXpNivelAtual(nivel) {
    return (50 / 3 * (Math.pow(nivel, 3) - (6 * Math.pow(nivel, 2)) + (17 * nivel) - 12)) / 100
}

function calcularXpGanha(nivel) {
    return (50 / 3 * (Math.pow(nivel, 3) - (6 * Math.pow(nivel, 2)) + (17 * nivel) - 12)) / 100
}

module.exports = {
    calcularXpProximoNivel,
    calcularXpNivelAtual,
    calcularXpGanha
}
