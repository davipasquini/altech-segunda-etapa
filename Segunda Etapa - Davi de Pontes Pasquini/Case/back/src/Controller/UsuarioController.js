const Repository = require("../Repository/UsuarioRepository")

class UsuarioController {

  async index(req, res) {
    const queryResults = await Repository.showUsers();
    res.json(queryResults)
  }

  async show(req, res) {
    const { id } = req.params
    const user = await Repository.findById(id)
    if (!user) {
      return res.status(400).json({ erro: "User not found." })
    }
    res.json(user)
  }

  async createUsers(req, res) {
    const { body } = req
    const result = await Repository.createUsers(body)
    if (!result) {
      res.status(500).json({ error: "Failed to create users." })
    }
    res.json(result)
  }

  async update(req, res) {
    const { id } = req.params;
    const { name, address, phone, balance } = req.body
    const userExists = await Repository.findById(id)
    if (!userExists) {
      return res.status(400).json({ error: "User not found." })
    }
    const user = await Repository.updateUser(id, { name, address, phone, balance })
    res.json(user)
  }

  async delete(req, res) {
    const { id } = req.params
    const userExists = await Repository.findById(id)
    if (!userExists) {
      return res.status(400).json({ error: "User not found." })
    }
    await Repository.deleteUser(id)
    res.sendStatus(204)
  }

  async deleteAll(req, res) {
    await Repository.deleteAll()
    res.sendStatus(204)
  }

}


module.exports = new UsuarioController()
