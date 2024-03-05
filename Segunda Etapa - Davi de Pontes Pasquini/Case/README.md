# Algar Tech Segunda Etapa
_
## Leitor de CSV

O Frontend do aplicativo foi feito utilizando JavaScript Vanilla e o Backend foi feito utilizando NodeJS juntamente com Express, não houve muito tempo para criar um docker-compose, dessa forma, para criar o container necessário basta rodar:

```
bash
docker run --name postgresqlDavi -e POSTGRES_USER=root -e POSTGRES_PASSWORD=root -p 5432:5432 -d postgres
```

Após isso, devemos acessar o PostgreSQL pelo bash e criar o schema, encontrado na pasta database, utilizando os seguintes comandos:

```
docker exec -it postgresqlDavi bash

psql -U root

root=# CREATE DATABASE userscsv;
root=# \c userscsv;
root=# CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
  id UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  address VARCHAR NOT NULL,
  phone VARCHAR,
  balance MONEY NOT NULL
);
```

Pronto, o banco está pronto para uso, agora apenas entrar na pasta back e rodar npm install logo depois npm run run e a API está de pé. Agora é só abrir ou rodar o front com o live-server e utilizar.