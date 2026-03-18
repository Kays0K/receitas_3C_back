import Fastify from "fastify";
import { Pool } from 'pg';

const sql = new Pool({
    user: "postgres",
    password: "1234",
    host: "localhost",
    port: 5432,
    database: "receitas"
})

const server = Fastify();

server.get('/usuarios', async () => {
    const result = await sql.query('SELECT * FROM usuario');

    return result.rows;
});

server.post('/usuarios', async (request, reply) => {
    const nome = request.body.nome;
    const senha = request.body.senha;
    const email = request.body.email;
    const resultado = await sql.query('INSERT INTO usuario (nome, senha, email) VALUES ($1, $2, $3)',[nome, senha, email]);
    reply.status(201).send({mensagem: "Usuário criado com sucesso!"});
});

server.put('/usuarios/:id', async (request, reply) => {
    const body = request.body;
    const id = request.params.id;
    
    if (!body.nome || !body.senha || !body.email) {
        return reply.status(400).send({ error: "nome, senha, email é obrigatório!"})
    }else if (!id) {
        return reply.status(400).send({ error: "ID é obrigatório!" })
    }

    const existeUsuario = await sql.query('SELECT * FROM usuario WHERE id = $1', [id]);

    if (existeUsuario.rows.length === 0) {
        return reply.status(400).send({ error: 'Usuário com o id: ${id} não existe!' });
    }

    const resultado = await sql.query('UPDATE usuario SET nome = $1, senha = $2, email = $3 WHERE id = $4',[body.nome, body.senha, body.email, id])
    reply.status(201).send({mensagem: "Usuário alterado com sucesso!"});
});

server.delete('/usuarios/:id', async (request, reply) => {
    const id = request.params.id;
    const resultado = await sql.query('DELETE FROM usuario WHERE id = $1', [id]);
    reply.status(204);
});

server.post('/login', async (request, reply) => {
    const email = request.body.email;
    const senha = request.body.senha;
    const result = await sql.query('SELECT * FROM usuario WHERE email = $1 AND senha = $2', [email, senha]);

    if (result.rows.length === 0) {
        return reply.status(401).send({ mensagem: "Credenciais inválidas!" });
    }
    reply.status(200).send({ mensagem: "Login realizado com sucesso!" });
});

server.listen({ 
    port:3000
});