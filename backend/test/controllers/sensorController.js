const axios = require('axios')

module.exports = () => {
    let result

    test('store a valid user', async () => {
        result = await axios.post('http://localhost:3333/user/store', {
            foto: 'https://avatars.githubusercontent.com/u/34221747?v=4',
            usuario: "MateusKawazoe",
            nome: 'Mateus Takeshi Kawazoe',
            email: 'Matkawazoe@gmail.com',
            endereco: 'Rua Brigadeiro Franco, 2190, 80250-030, Centro, Curitiba, Paraná'
        })
        expect(result.data.usuario).toBe('MateusKawazoe')
    })

    test('store a valid crop', async () => {
        result = await axios.post('http://localhost:3333/crop/store', {
            nome: 'Fazendinha Contente',
            dono: 'MateusKawazoe',
            participantes: ['MateusKawazoe'],
            endereco: 'Rua Brigadeiro Franco, 2190, 80250-030, Centro, Curitiba, Paraná'
        })
        expect(result.data.usuario).toBe('MateusKawazoe')
    })

    test('Store a vaild sensor', async () => {
        result = await axios.post('http://localhost:3333/sensor/store', {
            nome: 'Sensor de umidade da flor de abacaxi',
            tipo: "Umidade",
            dono: 'MateusKawazoe',
            descricao: "Sensor para mediçaõ da umidade do solo da flor de abacaxi",
            cor: "#4287f5",
            horta: '',
            valor: 100
        })
        expect(result.data.dono).toBe('MateusKawazoe')
    })

    test('Store another a vaild sensor', async () => {
        result = await axios.post('http://localhost:3333/sensor/store', {
            nome: 'Sensor de umidade da flor de laranja',
            tipo: "Umidade",
            dono: 'MateusKawazoe',
            descricao: "Sensor para mediçaõ da umidade do solo da flor de laranja",
            cor: "#b942f5",
            horta: '',
            valor: 100
        })
        expect(result.data.dono).toBe('MateusKawazoe')
    })

    test('Try to store an already stored sensor', async () => {
        result = await axios.post('http://localhost:3333/sensor/store', {
            nome: 'Sensor de umidade da flor de abacaxi',
            tipo: "Umidade",
            dono: 'MateusKawazoe',
            descricao: "Sensor para mediçaõ da umidade do solo da flor de abacaxi",
            cor: "#4287f5",
            horta: '',
            valor: 100
        })
        expect(result.data).toBe('Sensor já cadastrado!')
    })

    test('Update sensor name, description and type', async () => {
        result = await axios.put('http://localhost:3333/sensor/update/sensor', {
            nome: 'Sensor de umidade da flor de abacaxi',
            tipo: "pH",
            dono: 'MateusKawazoe',
            descricao: "Sensor para medição do pH do solo",
            cor: "#b942f5",
            horta: '',
            novoNome: "Sensor de pH"
        })
        expect(result.data).toBe('Sensor atualizado com sucesso!')
    })

    test('Update an unexisting sensor', async () => {
        result = await axios.put('http://localhost:3333/sensor/update/sensor', {
            nome: 'Sensor de',
            tipo: "pH",
            dono: 'MateusKawazoe',
            descricao: "Sensor para medição do pH do solo",
            horta: '',
            novoNome: "Sensor de pH"
        })
        expect(result.data).toBe('Sensor não existe!')
    })

    test('Insert a sensor into a crop', async () => {
        result = await axios.put('http://localhost:3333/sensor/insert/crop', {
            nome: 'Sensor de pH',
            dono: 'MateusKawazoe',
            horta: 'Fazendinha Contente'
        })
        expect(result.data).toBe('Sensor vinculado com sucesso!')
    })

    test('Insert an unexisting sensor into a crop', async () => {
        result = await axios.put('http://localhost:3333/sensor/insert/crop', {
            nome: 'Sensor de umidade',
            dono: 'MateusKawazoe',
            horta: 'Fazendinha Contente'
        })
        expect(result.data).toBe('Sensor não existe!')
    })

    test('Insert a sensor into an unexisting crop', async () => {
        result = await axios.put('http://localhost:3333/sensor/insert/crop', {
            nome: 'Sensor de pH',
            dono: 'MateusKawazoe',
            horta: 'Fazendinha'
        })
        expect(result.data).toBe('Horta não existe!')
    })

    test('Try to insert the same sensor into the same crop', async () => {
        result = await axios.put('http://localhost:3333/sensor/insert/crop', {
            nome: 'Sensor de pH',
            dono: 'MateusKawazoe',
            horta: 'Fazendinha Contente'
        })
        expect(result.data).toBe('Sensor já visculado a está horta!')
    })

    test('Remove an unexisting sensor into a crop', async () => {
        result = await axios.put('http://localhost:3333/sensor/remove/crop', {
            nome: 'Sensor de umidade',
            dono: 'MateusKawazoe',
            horta: 'Fazendinha Contente'
        })
        expect(result.data).toBe('Sensor não existe!')
    })

    test('Remove a sensor into an unexisting crop', async () => {
        result = await axios.put('http://localhost:3333/sensor/remove/crop', {
            nome: 'Sensor de pH',
            dono: 'MateusKawazoe',
            horta: 'Fazendinha'
        })
        expect(result.data).toBe('Horta não existe!')
    })

    test('Try to remove a sensor that does not belong to the crop', async () => {
        result = await axios.put('http://localhost:3333/sensor/remove/crop', {
            nome: 'Sensor de umidade da flor de laranja',
            dono: 'MateusKawazoe',
            horta: 'Fazendinha Contente'
        })
        expect(result.data).toBe('Sensor não visculado a está horta!')
    })

    test('Remove a sensor from a crop', async () => {
        result = await axios.put('http://localhost:3333/sensor/remove/crop', {
            nome: 'Sensor de pH',
            dono: 'MateusKawazoe',
            horta: 'Fazendinha Contente'
        })
        expect(result.data).toBe('Sensor removido com sucesso!')
    })

    test('Show all sensors', async () => {
        result = await axios.get('http://localhost:3333/sensor/show/all')
        expect(result.data.length).toBe(2)
    })

    test('Show one sensor', async () => {
        result = await axios.get('http://localhost:3333/sensor/show/one', {
            headers: {
                dono: 'MateusKawazoe',
                nome: 'Sensor de pH'
            }
        })
        expect(result.data.nome).toBe('Sensor de pH')
    })

    test('Show an unexisting sensor', async () => {
        result = await axios.get('http://localhost:3333/sensor/show/one', {
            headers: {
                dono: 'MateusKawazoe',
                nome: 'Sensor'
            }
        })
        expect(result.data).toBe('Sensor não existe!')
    })

    test('Show number of sensors', async () => {
        result = await axios.get('http://localhost:3333/sensor/number')
        expect(result.data).toBe(2)
    })

    test('Update a sensor"s feed', async () => {
        result = await axios.put('http://localhost:3333/sensor/update/feed', {
            dono: 'MateusKawazoe',
            nome: 'Sensor de pH',
            valor: 115
        })
        expect(result.data).toBe('Feed atualizado com sucesso!')
    })

    test('Update an unexisting sensor"s feed', async () => {
        result = await axios.put('http://localhost:3333/sensor/update/feed', {
            dono: 'MateusKawazoe',
            nome: 'Sensorzinho',
            valor: 115
        })
        expect(result.data).toBe('Sensor não existe!')
    })

    test('Delete an unexisting sensor', async () => {
        result = await axios.delete('http://localhost:3333/sensor/delete', {
            dono: 'MateusKawazoe',
            nome: 'Sensorzinho',
            horta: 'Fazendinha Contente'
        })
        expect(result.data).toBe('Sensor não existe!')
    })

    test('delete the stored sensors', async () => {
        result = await axios.delete('http://localhost:3333/sensor/delete', {
            headers: {
                dono: 'MateusKawazoe',
                horta: 'Fazendinha Contente',
                nome: 'Sensor de umidade da flor de laranja'
            }
        })
        expect(result.data).toBe('Sensor excluído com sucesso!')

        result = await axios.delete('http://localhost:3333/sensor/delete', {
            headers: {
                dono: 'MateusKawazoe',
                horta: 'Fazendinha Contente',
                nome: 'Sensor de pH'
            }
        })
        expect(result.data).toBe('Sensor excluído com sucesso!')
    })

    test('delete the stored user', async () => {
        result = await axios.delete('http://localhost:3333/user/delete', {
            headers: { usuario: 'MateusKawazoe' }
        })
        expect(result.data).toBe('Usuário deletado com sucesso!')
    })

    test('delete the stored crop', async () => {
        result = await axios.delete('http://localhost:3333/crop/delete', {
            data: {
                dono: 'MateusKawazoe',
                nome: 'Fazendinha Contente'
            }
        })
        expect(result.data).toBe('Horta deletado com sucesso!')
    })
}