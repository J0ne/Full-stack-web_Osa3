const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')


const apiPrefix = '/api'
app.use(cors())
app.use(express.static('build'))
morgan.token('data', function (req, res) { return JSON.stringify(req.body) })

app.use(bodyParser.json())
app.use(morgan(':method :url :data :date'))


let persons = [{
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Martti Tienari",
    "number": "040-123456",
    "id": 2
  },
  {
    "name": "Arto Järvinen",
    "number": "040-123456",
    "id": 3
  },
  {
    "name": "Lea Kutvonen",
    "number": "040-123456",
    "id": 4
  }
]


app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get(`${apiPrefix}/persons`, (req, res) => {
  res.json(persons)
})

app.get(`/info`, (req, res) => {
  const personCount = persons.length; 
  const infoMessage = `Luettelossa on ${personCount} henkilön tiedot.<p> ${new Date()}</p>`
  res.send(infoMessage)
})

app.get(`${apiPrefix}/persons/:id`, (request, response) => {
  console.log("Palvelimelta...", request.params);
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

const generateId = () => {
  return Math.floor(Math.random() * 10000) + 100  
  // const maxId = persons.length > 0 ? persons.map(n => n.id).sort().reverse()[0] : 1
  // return maxId + 1
}

app.post(`${apiPrefix}/persons/`, (request, response) => {
  const body = request.body
  console.log(request.body)
  if (body.number === undefined || body.name === undefined) {
    return response.status(400).json({ error: 'Some parameters are missing' })
  }
  const name = body.name;
  const personIndex = persons.map(x => x.name)
    .indexOf(name);
  // console.log('personIndex', personIndex, persons.map(x => x.name) );
  if(personIndex > -1){
    return response.status(409).json({ error: 'name must be unique' })
  }  
    
  const person = {
    name: name,
    number: body.number,
    //date: new Date(),
    id: generateId()
  }

  persons = persons.concat(person)

  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  console.log('DELETE-request:', request.params)
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})