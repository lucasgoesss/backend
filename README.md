# Finalizando o RocketMovies

RocketMovies API
RocketMovies é uma API de gerenciamento de usuários e autenticação para um sistema de filmes. Ele utiliza Node.js com o banco de dados SQLite e implementa autenticação com bcrypt, além de controlar erros personalizados.

Funcionalidades
Criação de usuário: Permite a criação de usuários com nome, e-mail e senha.
Atualização de usuário: Permite a atualização de informações do usuário, incluindo troca de senha.
Autenticação: Validação de e-mail e senha com hash seguro utilizando bcrypt.
Gerenciamento de Erros: Tratamento de erros personalizados através de uma classe de erros.
Tecnologias Utilizadas
Node.js
Express
SQLite
Bcrypt
Knex.js
AppError - Classe personalizada para tratamento de erros.

Banco de Dados

O projeto utiliza o SQLite como banco de dados local. As tabelas principais incluem:

users: Armazena informações sobre os usuários, incluindo nome, e-mail e senha (hash).

Tratamento de Erros
O projeto utiliza uma classe AppError para tratamento de erros personalizados, que retorna erros específicos com status HTTP e mensagens adequadas.

Caso tenha dúvidas ou sugestões, entre em contato:

- **LinkedIn**: [Lucas Goes](https://www.linkedin.com/in/lucasgoesss)
por [Lucas Goes](https://github.com/lucasgoesss)
