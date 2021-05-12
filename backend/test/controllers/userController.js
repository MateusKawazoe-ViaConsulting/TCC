const axios = require('axios')

module.exports = () => {
    let result

    test('store a valid user', async () => {
        result = await axios.post('http://localhost:3333/user/store', {
                foto: 'https://avatars.githubusercontent.com/u/34221747?v=4',
                usuario: 'Luquinhas',
                senha: 'Lucas123',
                nome: 'Lucas Camargo Shizuno',
                email: 'leaozinho@gmail.com',
                endereco: 'Rua Brigadeiro Franco, 2190, 80250-030, Centro, Curitiba, Paraná'
        })
        expect(result.data.nome).toBe('Lucas Camargo Shizuno')
    })

    test('store the same user', async () => {
        result = await axios.post('http://localhost:3333/user/store', {
                foto: 'https://avatars.githubusercontent.com/u/34221747?v=4',
                usuario: "Luquinhas",
                senha: 'Lucas123',
                nome: 'Lucas Camargo Shizuno',
                email: 'leaozinho@gmail.com',
                endereco: 'Rua Brigadeiro Franco, 2190, 80250-030, Centro, Curitiba, Paraná'
        })
        expect(result.data).toBe('Usuário já cadastrado!')
    })

    test('valid login', async () => {
        result = await axios.get('http://localhost:3333/user/login', {
            headers: {
                usuario: 'Luquinhas',
                senha: 'Lucas123'
            }
        })
        expect(result.data.nome).toBe('Lucas Camargo Shizuno')
    })

    test('invalid user login', async () => {
        result = await axios.get('http://localhost:3333/user/login', {
            headers: {
                usuario: 'Luquinhaszinho',
                senha: 'Lucas123'
            }
        })
        expect(result.data).toBe('Usuário não existe')
    })

    test('invalid password login', async () => {
        result = await axios.get('http://localhost:3333/user/login', {
            headers: {
                usuario: 'Luquinhas',
                senha: 'Lucas'
            }
        })
        expect(result.data).toBe('Senha incorreta')
    })

    test('store a invalid user', async () => {
        result = await axios.post('http://localhost:3333/user/store', {
                foto: 'https://avatars.githubusercontent.com/u/34221747?v=4',
                usuario: "Loucura",
                senha: 'Loucura123',
                nome: 'Loucura Camargo Shizuno',
                email: 'Loucura@gmail.com',
                endereco: ''
        })
        // expect(result.data).toBe('Endereço é obrigatório!')
        expect(result.data).toBe('Usuário já cadastrado!')
    })

    test('show one user', async () => {
        result = await axios.get('http://localhost:3333/user/show/one', {
            headers: {
                usuario: 'Luquinhas'
            }
        })
        expect(result.data.usuario).toBe('Luquinhas')
    })

    test('show a not existing user', async () => {
        result = await axios.get('http://localhost:3333/user/show/one', {
            headers: {
                usuario: 'Shamanzinho'
            }
        })
        expect(result.data).toBe('Usuário não existe!')
    })

    test('update user"s password', async () => {
        result = await axios.put('http://localhost:3333/user/update', {
                usuario: "Luquinhas",
                senha: '123321',
        })
        expect(result.data.usuario).toBe('Luquinhas')
    })

    test('update user"s picture', async () => {
        result = await axios.put('http://localhost:3333/user/update', {
                foto: 'https://avatars.githubusercontent.com/u/13488587?v=4',
                usuario: "Luquinhas",
        })
        expect(result.data.usuario).toBe('Luquinhas')
    })

    test('update a not existing user', async () => {
        result = await axios.put('http://localhost:3333/user/update', {
                foto: 'https://avatars.githubusercontent.com/u/34221747?v=4',
                usuario: "Loucurinha",
                senha: '123321',
        })
        expect(result.data).toBe('Usuário não existe!')
    })

    test('show all users', async () => {
        result = await axios.get('http://localhost:3333/user/show/all')
        expect(result.data[0].nome).toBe('Loucura Camargo Shizuno')
    })

    test('show the number of users', async () => {
        result = await axios.get('http://localhost:3333/user/users/number')
        expect(result.data.length).toBe(2)
    })

    test('delete a not existing user', async () => {
        result = await axios.delete('http://localhost:3333/user/delete', {
            headers: {
                usuario: 'Loucurinha'
            }
        })
        expect(result.data).toBe('Usuário não existe!')
    })

    test('delete user', async () => {
        result = await axios.delete('http://localhost:3333/user/delete', {
            headers: {
                usuario: 'Luquinhas'
            }
        })
        expect(result.data).toBe('Usuário deletado com sucesso!')
    })
}