const UsuarioController = require("./Controller/UsuarioController")
const { Router } = require("express")

const router = Router()

router.get("/users", UsuarioController.index)
router.get("/users/:id", UsuarioController.show)
router.delete("/users/:id", UsuarioController.delete)
router.delete("/users", UsuarioController.deleteAll)
router.put("/users", UsuarioController.createUsers)
router.put("/users/:id", UsuarioController.update)


module.exports = router
