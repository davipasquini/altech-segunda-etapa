const runCsvBtn = document.querySelector(".run-csv")
const inputFile = document.querySelector("input[type='file']")
const tableContainer = document.querySelector(".table-container")
const searchValue = document.querySelector('input[name="search"]')
const downloadBtn = document.querySelector('.download-btn')

runCsvBtn.addEventListener("click", readCsv)
searchValue.addEventListener("input", searchTable)
downloadBtn.addEventListener("click", downloadCsv)

let realTableValues = []

function readCsv() {
  if (!inputFile.files[0]) {
    alert("Insira um arquivo!")
    return
  }
  if (!inputFile.files[0].name.endsWith(".csv")) {
    alert("Insira um arquivo CSV!")
    return
  }
  const reader = new FileReader();
  reader.readAsText(inputFile.files[0])
  reader.onload = async () => {
    const result = reader.result
    const lines = result.split('\n').map(line => {
      const regex = /(?:(["'])(\\.|(?!\1)[^\\])*\1|\[(?:(["'])(\\.|(?!\2)[^\\])*\2|[^\]])*\]|\((?:(["'])(\\.|(?!\3)[^\\])*\3|[^)])*\)|[^,])+/g;
      return line.match(regex);
    });

    await fetch(
      "http://localhost:3000/users",
      {
        method: "DELETE"
      }
    )

    const options = {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(lines.slice(1))
    }

    const returnedValue = await fetch("http://localhost:3000/users", options).then(res => res.json())
    realTableValues = returnedValue
    createTable(returnedValue)
  }
}

function downloadCsv() {
  if (realTableValues.length == 0) {
    alert("Insira um arquivo e faça alterações!")
    return
  }
  let csvContent = ''
  realTableValues.forEach(row => {
    csvContent += row.join(',') + '\n'
  })
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8,' })
  const objUrl = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = objUrl
  link.download = `${inputFile.files[0].name}-edited.csv`
  link.click()
}

function createTable(tableValues) {
  const lines = JSON.parse(JSON.stringify(tableValues))
  // if (lines.length < 1) return;
  const existTable = document.querySelector("table")
  if (existTable) {
    existTable.remove()
  }
  const table = document.createElement("table")
  tableContainer.appendChild(table)

  const headersTr = document.createElement("tr")
  //nome telefone endereço saldo
  const tdHeader1 = document.createElement("td")
  tdHeader1.innerHTML = "Nome"
  const tdHeader2 = document.createElement("td")
  tdHeader2.innerHTML = "Telefone"
  const tdHeader3 = document.createElement("td")
  tdHeader3.innerHTML = "Endereço"
  const tdHeader4 = document.createElement("td")
  tdHeader4.innerHTML = "Saldo Devedor"

  headersTr.appendChild(tdHeader1)
  headersTr.appendChild(tdHeader2)
  headersTr.appendChild(tdHeader3)
  headersTr.appendChild(tdHeader4)


  table.appendChild(headersTr)

  lines.map(line => {
    const row = document.createElement("tr")
    row.setAttribute("id", line?.id)

    const td1 = document.createElement("td")
    td1.innerHTML = line?.name.replace(/['"]+/g, '')
    const td2 = document.createElement("td")
    td2.innerHTML = line?.phone.replace(/['"]+/g, '')
    const td3 = document.createElement("td")
    td3.innerHTML = line?.address.replace(/['"]+/g, '')
    const td4 = document.createElement("td")
    td4.innerHTML = line?.balance.replace(/['"]+/g, '')

    row.appendChild(td1)
    row.appendChild(td2)
    row.appendChild(td3)
    row.appendChild(td4)

    const buttonsContainer = document.createElement("div")
    buttonsContainer.classList.add("btn-container")
    const buttonsContent = document.createElement("div")
    buttonsContent.classList.add("btn-content")
    const button1 = document.createElement("button")
    const button2 = document.createElement("button")
    button1.innerHTML = "Editar"
    button2.innerHTML = "Remover"
    button1.classList.add("custom-btn", line?.id)
    button2.classList.add("custom-btn", line?.id)
    button1.addEventListener("click", handleEditTable)
    button2.addEventListener("click", handleRemoveTable)
    buttonsContent.appendChild(button1)
    buttonsContent.appendChild(button2)
    buttonsContainer.appendChild(buttonsContent)
    row.appendChild(buttonsContainer)
    table.appendChild(row)
  })
}

let currentEditingRow = null

async function handleEditTable(e) {
  if (currentEditingRow && e.target.innerHTML == "Editar") {
    alert("Termine de editar o que já está aberto!")
    return
  }
  const button = e.target
  const row = document.getElementById(e.target.classList[1])
  if (!row) {
    alert("Erro, não foi encontrado essa linha na tabela!")
    return
  }


  if (button.innerHTML == "Editar") {
    currentEditingRow = row
    button.innerHTML = "Finalizar"
    const children = row.children
    children[1].outerHTML = `<td><input class="telefone-${e.target.classList[1]}" value="${children[1].innerHTML}"></td>`
    children[2].outerHTML = `<td><input class="endereco-${e.target.classList[1]}" value="${children[2].innerHTML}"></td>`
    return
  }

  if (confirm("Deseja atualizar os valores?") == true) {
    row.children[1].outerHTML = `<td>${document.querySelector(`.telefone-${e.target.classList[1]}`).value}</td>`
    row.children[2].outerHTML = `<td>${document.querySelector(`.endereco-${e.target.classList[1]}`).value}</td>`
    const foundIndex = realTableValues.findIndex(x => x?.id == e.target.classList[1])
    const options = {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({
        ...realTableValues[foundIndex],
        address: row.children[2].innerHTML,
        phone: row.children[1].innerHTML
      })
    }
    const updateInDb = await fetch(`http://localhost:3000/users/${realTableValues[foundIndex]?.id}`, options).then(res => res.json())
    realTableValues[foundIndex] = updateInDb
  } else {
    row.children[1].outerHTML = `<td>${document.querySelector(`.telefone-${e.target.classList[1]}`).getAttribute("value")}</td>`
    row.children[2].outerHTML = `<td>${document.querySelector(`.endereco-${e.target.classList[1]}`).getAttribute("value")}</td>`
  }

  button.innerHTML = "Editar"
  currentEditingRow = null

}

async function handleRemoveTable(e) {
  const row = document.getElementById(e.target.classList[1])
  if (!row) {
    alert("Erro, não foi encontrado essa linha na tabela!")
    return
  }
  if (confirm("Tem certeza que deseja remover?") == true) {
    // realTableValues.splice([e.target.classList[1]], 1)
    const options = {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
    }
    await fetch(`http://localhost:3000/users/${e.target.classList[1]}`, options)
    realTableValues = realTableValues.filter(value => value?.id !== e.target.classList[1])
    row.remove()
  }

}

function searchTable() {
  const searchingVal = searchValue.value
  if (searchingVal == "") {
    createTable(realTableValues);
    return
  }


  const dataToRender = realTableValues.filter(val => {
    if (
      val?.phone.toLowerCase().includes(searchingVal.toLowerCase()) ||
      val?.address.toLowerCase().includes(searchingVal.toLowerCase())
    )
      return val
  })
  createTable(dataToRender)
}

