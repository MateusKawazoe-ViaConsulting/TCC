const { Socket } = require("../config/socket")

function calcularXpProximoNivel(nivel) {
    let proximoNivel = parseInt(nivel) + 1
    return (50 / 3 * (Math.pow(proximoNivel, 3) - (6 * Math.pow(proximoNivel, 2)) + (17 * proximoNivel) - 12)) / 10
}

function calcularXpNivelAtual(nivel) {
    return (50 / 3 * (Math.pow(nivel, 3) - (6 * Math.pow(nivel, 2)) + (17 * nivel) - 12)) / 100
}

function calcularXpGanha(nivel, integridade = 1, tipo = 1) {
    var result = ((50 / 3 * (Math.pow(nivel, 3) - (6 * Math.pow(nivel, 2)) + (17 * nivel) - 12)) / 180) * integridade * tipo
    return Math.ceil(result)
}

async function xpUpdate(controller, data, event) {
    var lvl = data.lvl
    var xp = data.xp + calcularXpGanha(lvl + 1, data.integridade, data.tipo)
    var nextLvl = calcularXpProximoNivel(lvl)

    if (xp >= calcularXpProximoNivel(lvl)) {
        lvl++
        nextLvl = calcularXpProximoNivel(lvl)
    }

    await controller.updateOne(
        { _id: data._id },
        {
            $set: {
                nivel: {
                    lvl: lvl,
                    xp: xp
                }
            }
        }
    )

    Socket.emit_user('' + event, {
        xp: xp,
        user: data.usuario,
        lvl: lvl,
        nextLvl: nextLvl
    });
}

module.exports = {
    xpUpdate,
    calcularXpProximoNivel
}
