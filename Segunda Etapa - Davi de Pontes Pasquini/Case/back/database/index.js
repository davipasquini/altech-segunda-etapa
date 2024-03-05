const { Client } = require("pg")
const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'root',
  password: 'root',
  database: 'userscsv',
})

client.connect();

exports.query = async (queryStr, values) => {
  const { rows } = await client.query(queryStr, values)
  return rows
}

