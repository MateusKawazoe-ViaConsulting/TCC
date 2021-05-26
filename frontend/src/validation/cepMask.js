export default function cepMask(zipCode) {
    if (zipCode.length === 6 && !/([-])/g.test(zipCode)) {
        let result, aux = zipCode.split('')
        aux.splice(5, 0, '-')
        result = aux.reduce((acumulator, element) => acumulator + element, [''])
        return result
    }
    return zipCode
}