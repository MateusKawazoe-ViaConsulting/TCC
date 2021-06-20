module.exports = {
    showAlert(message, type, id) {
        // document.getElementById(id).classList.replace(/\b(\w*error\w*)\b|\b(\w*success\w*)\b|\b(\w*info\w*)\b|\b(\w*warning\w*)\b/igm, type)
        if (!document.getElementById(id))
            return
            
        const classList = []
        document.getElementById(id).classList.forEach(element => classList.push(element))
        const aux = classList.find(element => /\b(\w*error\w*)\b|\b(\w*success\w*)\b|\b(\w*info\w*)\b|\b(\w*warning\w*)\b/igm.test(element))

        if (aux)
            document.getElementById(id).classList.remove(aux)

        document.getElementById(id).classList.add('MuiAlert-filled' + type)
        setTimeout(() => {
            if (document.getElementById(id))
                this.closeAlert(id)
        }, 7500)
        document.getElementById(id).children[1].children[0].innerText = message
        document.getElementById(id).style.right = '60px'
    },

    closeAlert(id) {
        document.getElementById(id).style.right = '-100%'
    }
}