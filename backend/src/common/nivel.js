// module.exports = {
    function calcularXpProximoNivel(nivel, xp) {
        let proximoNivel = nivel + 1
        let xpProximoNivel = 50/3*(Math.pow(proximoNivel,3) - (6*Math.pow(proximoNivel,2)) + (17*proximoNivel) - 12)
        return xpProximoNivel
    }

    function calcularXpNivelAtual(nivel) {
        let xpNivelAtual = 50/3*(Math.pow(nivel,3) - (6*Math.pow(nivel,2)) + (17*nivel) - 12)
        return xpNivelAtual
    }

    function calcularXpGanha(nivel) {
        let xpNivelAtual = 50/3*(Math.pow(nivel,3) - (6*Math.pow(nivel,2)) + (17*nivel) - 12)
        return xpNivelAtual
    }
// }

console.log(calcularXpNivelAtual(2))