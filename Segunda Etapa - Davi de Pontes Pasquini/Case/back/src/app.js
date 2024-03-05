const express = require("express")
const routes = require("./routes")

const app = express()


app.use(express.json())
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
})
app.use(routes)

app.listen(3000, () => {
  console.log("Rodando na porta http://localhost:3000")
})
