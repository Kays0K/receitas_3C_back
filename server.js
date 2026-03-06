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
    const resultado = await sql.query('INSERT INTO usuario (nome, senha) VALUES ($1, $2)',[nome, senha]);
    return 'Usuario criado com sucesso!';
});

server.put('/usuarios/:id', async (request, reply) => {
    const body = request.body;
    const id = request.params.id;
    const resultado = await sql.query('UPDATE usuario SET nome = $1, senha = $2 WHERE id = $3',[body.nome, body.senha, id])
    return 'Usuário alterado com sucesso!';
});

server.delete('/usuarios/:id', async (request, reply) => {
    const id = request.params.id;
    const resultado = await sql.query('DELETE FROM usuario WHERE id = $1', [id]);
    return 'Usuário deletado!'
});

server.listen({ 
    port:3000
});