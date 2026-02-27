import Fastify from "fastify";

const server = Fastify();

server.get('/usuarios', () => {
    return 'Ta funfando poha!!!!'
});

server.listen({ 
    port:3000
});