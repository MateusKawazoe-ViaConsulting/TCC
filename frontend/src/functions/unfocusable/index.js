export default function unfocusabled(id) {
    document.getElementById(id).addEventListener('keydown', e => {
        if (e.key === 'Tab') {
            e.preventDefault()
        }
    })
}