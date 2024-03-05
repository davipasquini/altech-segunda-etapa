
const db = require('../../database')

class UsuarioRepository {

  convertToBRL(money) {
    const splittedMoney = money.split(",");
    const firstPart = splittedMoney[0].replace(/\D/g, '')
    const secondPart = splittedMoney[1].replace(",", ".")
    return parseFloat(firstPart.concat('.', secondPart))
  }

  async createUsers(users) {
    // users = [
    // ["nome", "phone", "address", "balance"],
    // ["nome", "phone", "address", "balance"],
    // ["nome", "phone", "address", "balance"]
    if (users.length == 0) {
      return null;
    }
    const insertedData = await Promise.all(
      users.map(async user => {
        const parsedInfo = {
          name: user[0],
          phone: user[1],
          address: user[2],
          balance: this.convertToBRL(user[3])
        };

        const [queryCall] = await db.query(`
        INSERT INTO users(name, phone, address, balance)
        VALUES ($1, $2, $3, $4)
        RETURNING *;`,
          [parsedInfo.name, parsedInfo.phone, parsedInfo.address, parsedInfo.balance])

        return queryCall
      })
    )
    return insertedData;

  }

  async showUsers() {
    const queryCall = await db.query("SELECT * FROM users;")
    return queryCall;
  }

  async findById(Id) {
    const [user] = await db.query(`
      SELECT * 
      FROM users
      WHERE id=$1;`, [Id])
    return user;
  }

  async updateUser(userId, { name, address, phone, balance }) {
    const [user] = await db.query(`
      UPDATE users
      SET name=$1, address=$2, phone=$3, balance=$4
      WHERE id = $5
      RETURNING *;
      `, [name, address, phone, balance, userId])
    return user;

  }

  async deleteUser(userId) {
    await db.query('DELETE FROM users WHERE id=$1', [userId])
  }

  async deleteAll() {
    await db.query('DELETE FROM users')
  }

}

module.exports = new UsuarioRepository()
