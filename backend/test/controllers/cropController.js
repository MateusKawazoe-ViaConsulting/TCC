const axios = require('axios')

module.exports = () => {
    let result

    test('store a valid user', async () => {
        result = await axios.post('http://localhost:3333/user/store', {
                foto: 'https://avatars.githubusercontent.com/u/34221747?v=4',
                usuario: "Mateuskwz",
                nome: 'Mateus Takeshi Kawazoe',
                email: 'Matkawazoe@gmail.com',
                endereco: 'Rua Brigadeiro Franco, 2190, 80250-030, Centro, Curitiba, Paraná'
        })
        expect(result.data.usuario).toBe('Mateuskwz')
    })

    test('store a valid user', async () => {
        result = await axios.post('http://localhost:3333/user/store', {
                foto: 'https://avatars.githubusercontent.com/u/34221747?v=4',
                usuario: "ErickZin",
                nome: 'Erick Gay',
                email: 'Erickgay@gmail.com',
                endereco: 'Rua Brigadeiro Franco, 2800, 80250-030, Centro, Curitiba, Paraná'
        })
        expect(result.data.usuario).toBe('ErickZin')
    })

    test('store a crop with invalid owner', async () => {
        result = await axios.post('http://localhost:3333/crop/store', {
            nome: 'Fazendinha Feliz',
            dono: 'Oieee',
            participantes: ['Mateuskwz'],
            endereco: 'Rua Brigadeiro Franco, 2190, 80250-030, Centro, Curitiba, Paraná'
        })
        expect(result.data).toBe('Usuário não existe!')
    })

    test('store a crop with no address', async () => {
        result = await axios.post('http://localhost:3333/crop/store', {
            nome: 'Fazendinha Feliz',
            dono: 'Mateuskwz',
            participantes: ['Mateuskwz']
        })
        expect(result.data).toBe('Endereço é obrigatório!')
    })

    test('store a valid crop', async () => {
        result = await axios.post('http://localhost:3333/crop/store', {
            nome: 'Fazendinha Feliz',
            dono: 'Mateuskwz',
            participantes: ['Mateuskwz'],
            endereco: 'Rua Brigadeiro Franco, 2190, 80250-030, Centro, Curitiba, Paraná'
        })
        expect(result.data.usuario).toBe('Mateuskwz')
    })

    test('store the same crop name', async () => {
        result = await axios.post('http://localhost:3333/crop/store', {
            nome: 'Fazendinha Feliz',
            dono: 'Mateuskwz',
            participantes: ['Mateuskwz'],
            endereco: 'Rua Brigadeiro Franco, 2190, 80250-030, Centro, Curitiba, Paraná'
        })
        expect(result.data).toBe('Nome da horta já foi utilizada!')
    })

    test('store the same crop address', async () => {
        result = await axios.post('http://localhost:3333/crop/store', {
            nome: 'Fazendinha Felizinha',
            dono: 'Mateuskwz',
            participantes: ['Mateuskwz'],
            endereco: 'Rua Brigadeiro Franco, 2190, 80250-030, Centro, Curitiba, Paraná'
        })
        expect(result.data).toBe('Já existe uma horta cadastrada nesse endereço!')
    })

    test('store one more crop', async () => {
        result = await axios.post('http://localhost:3333/crop/store', {
            nome: 'Fazendinha Felizinha',
            dono: 'Mateuskwz',
            participantes: ['Mateuskwz'],
            endereco: 'Rua Brigadeiro Franco, 2090, 80250-030, Centro, Curitiba, Paraná'
        })
        expect(result.data.usuario).toBe('Mateuskwz')
    })

    test('store another crop', async () => {
        result = await axios.post('http://localhost:3333/crop/store', {
            nome: 'Fazendinha Felizinhainha',
            dono: 'Mateuskwz',
            participantes: ['Mateuskwz'],
            endereco: 'Rua Brigadeiro Franco, 2000, 80250-030, Centro, Curitiba, Paraná'
        })
        expect(result.data.usuario).toBe('Mateuskwz')
    })

    test('max number of crops stored', async () => {
        result = await axios.post('http://localhost:3333/crop/store', {
            nome: 'Fazendinha Felizinhainhainha',
            dono: 'Mateuskwz',
            participantes: ['Mateuskwz'],
            endereco: 'Rua Brigadeiro Franco, 1000, 80250-030, Centro, Curitiba, Paraná'
        })
        expect(result.data).toBe('Você atingiu o número máximo de hortas!')
    })

    test('show all crops', async () => {
        result = await axios.get('http://localhost:3333/crop/show/all')
        expect(result.data[0].nome).toBe('Fazendinha Feliz')
        expect(result.data.length).toBe(3)
    })

    test('show one crop', async () => {
        result = await axios.get('http://localhost:3333/crop/show/one', {
            headers: {
                dono: 'Mateuskwz',
                nome: 'Fazendinha Feliz'
            }
        })
        expect(result.data.nome).toBe('Fazendinha Feliz')
        expect(result.data.dono).toBe('Mateuskwz')
    })

    test('show an unexisting crop', async () => {
        result = await axios.get('http://localhost:3333/crop/show/one', {
            headers: {
                dono: 'Mateuskwz',
                nome: 'Fazendinha Felizona'
            }
        })
        expect(result.data).toBe('Horta não existe!')
    })

    test('number of crops', async () => {
        result = await axios.get('http://localhost:3333/crop/number')
        expect(result.data).toBe(3)
    })

    test('succefull user insert into a crop', async () => {
        result = await axios.put('http://localhost:3333/crop/insert/user', {
            dono: 'Mateuskwz',
            nome: 'Fazendinha Feliz',
            usuario: 'ErickZin'
        })
        expect(result.data).toBe('Participante inserido com sucesso!')
    })

    test('insert a user into an unexisting crop', async () => {
        result = await axios.put('http://localhost:3333/crop/insert/user', {
            dono: 'Mateuskwz',
            nome: 'Fazendinha Felizona',
            usuario: 'ErickZin'
        })
        expect(result.data).toBe('Horta não existe!')
    })

    test('insert the same user into the same crop', async () => {
        result = await axios.put('http://localhost:3333/crop/insert/user', {
            dono: 'Mateuskwz',
            nome: 'Fazendinha Feliz',
            usuario: 'ErickZin'
        })
        expect(result.data).toBe('Participante já faz parte desta horta!')
    })

    test('remove an user from the crop', async () => {
        result = await axios.put('http://localhost:3333/crop/remove/user', {
            dono: 'Mateuskwz',
            nome: 'Fazendinha Feliz',
            usuario: 'ErickZin'
        })
        expect(result.data).toBe('Participante removido com sucesso!')
    })

    test('remove an user from an unexisting crop', async () => {
        result = await axios.put('http://localhost:3333/crop/remove/user', {
            dono: 'Mateuskwz',
            nome: 'Fazendinha Felizona',
            usuario: 'ErickZin'
        })
        expect(result.data).toBe('Horta não existe!')
    })

    test('remove an user that doesn"t belong to the crop', async () => {
        result = await axios.put('http://localhost:3333/crop/remove/user', {
            dono: 'Mateuskwz',
            nome: 'Fazendinha Feliz',
            usuario: 'DanielGaletti'
        })
        expect(result.data).toBe('Participante não faz parte desta horta!')
    })

    test('update the crop name', async () => {
        result = await axios.put('http://localhost:3333/crop/update/name', {
            dono: 'Mateuskwz',
            nome: 'Fazendinha Feliz',
            novoNome: 'Fazendinha Alegre'
        })
        expect(result.data).toBe('Nome da horta atualizado com sucesso!')
    })

    test('try to update the crop"s name with the same name', async () => {
        result = await axios.put('http://localhost:3333/crop/update/name', {
            dono: 'Mateuskwz',
            nome: 'Fazendinha Alegre',
            novoNome: 'Fazendinha Alegre'
        })
        expect(result.data).toBe('O novo nome deve ser diferente do atual!')
    })

    test('try to update an unexisting crop', async () => {
        result = await axios.put('http://localhost:3333/crop/update/name', {
            dono: 'Mateuskwz',
            nome: 'Fazendinha Feliz',
            novoNome: 'Fazendinha Alegre'
        })
        expect(result.data).toBe('Horta não existe!')
    })

    test('delete an unexisting crop', async () => {
        result = await axios.delete('http://localhost:3333/crop/delete', {
            data: {
                dono: 'Mateuskwz',
                nome: 'Fazendinha Felizona'
            }
        })
        expect(result.data).toBe('Horta não existe!')
    })

    test('delete the stored crops', async () => {
        result = await axios.delete('http://localhost:3333/crop/delete', {
            data: {
                dono: 'Mateuskwz',
                nome: 'Fazendinha Alegre'
            }
        })
        expect(result.data).toBe('Horta deletado com sucesso!')
        result = await axios.delete('http://localhost:3333/crop/delete', {
            data: {
                dono: 'Mateuskwz',
                nome: 'Fazendinha Felizinha'
            }
        })
        expect(result.data).toBe('Horta deletado com sucesso!')
        result = await axios.delete('http://localhost:3333/crop/delete', {
            data: {
                dono: 'Mateuskwz',
                nome: 'Fazendinha Felizinhainha'
            }
        })
        expect(result.data).toBe('Horta deletado com sucesso!')
    })

    test('delete the stored users', async () => {
        result = await axios.delete('http://localhost:3333/user/delete', {
            headers: { usuario: 'Mateuskwz' }
        })
        expect(result.data).toBe('Usuário deletado com sucesso!')

        result = await axios.delete('http://localhost:3333/user/delete', {
            headers: { usuario: 'ErickZin' }
        })
        expect(result.data).toBe('Usuário deletado com sucesso!')
    })
}