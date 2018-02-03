const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')


const apiPrefix = '/api'
app.use(cors())
app.use(express.static('build'))
morgan.token('data', function (req, res) { return JSON.stringify(req.body) })

app.use(bodyParser.json())
app.use(morgan(':method :url :data :date'))


// let persons = [{
//     "name": "Arto Hellas",
//     "number": "040-123456",
//     "id": 1
//   },
//   {
//     "name": "Martti Tienari",
//     "number": "040-123456",
//     "id": 2
//   },
//   {
//     "name": "Arto Järvinen",
//     "number": "040-123456",
//     "id": 3
//   },
//   {
//     "name": "Lea Kutvonen",
//     "number": "040-123456",
//     "id": 4
//   }
// ]


app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get(`${apiPrefix}/persons`, (req, res) => {
  Person.find({})
    .then(
    persons => res.json(persons.map(Person.formatPerson))
  ).catch(error => {
    console.log(error)
    response.status(404).end()
  })
  
})

app.get(`/info`, (req, res) => {
  Person.find({})
    .then(persons => {
      const infoMessage = `Luettelossa on ${persons.length} henkilön tiedot.<p> ${new Date()}</p>`
      res.send(infoMessage)
    }).catch(error => {
      console.log(error)
      response.status(404).end()
    })
})

app.get(`${apiPrefix}/persons/:id`, (request, response) => {
  console.log("Palvelimelta...", request.params);
  const id = request.params.id
  //const person = persons.find(person => person.id === id)
 Person.findById(id).then(person => {
   if (person) {
     response.json(Person.formatPerson(person))
   } else {
     response.status(404).end()
   }
 }).catch(error => {
   console.log(error)
   response.status(400).send({ error: 'malformatted id' })
 })
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
  Person.findOne({name}).then(person => {
    if(person){
      return response.status(409).json({ error: 'name must be unique' })
    } else{
      const newPerson = new Person({
        name: name,
        number: body.number
      })

      newPerson.save()
        .then(savedPerson => {
          response.json(Person.formatPerson(savedPerson))
        }).catch(error => {
          console.log(error)
          response.status(404).end()
        })
    }
  }).catch(error => {
    console.log(error)
    response.status(404).end()
  })
})

app.delete('/api/persons/:id', (request, response) => {
  console.log('DELETE-request:', request.params)
  const id = request.params.id
  Person.findByIdAndRemove(id).then(result => {
    console.log(result)
    response.status(204).end()
  }
)})

app.put('/api/persons/:id', (request, response)=> {
  console.log('PUT-request:', request.params)
  const id = request.params.id
  const number = request.body.number
  Person.findByIdAndUpdate(id, {number}).then(updatedPerson =>{
    console.log(updatedPerson)
    response.json(Person.formatPerson(updatedPerson))
  }).catch(error => {
    console.log(error)
    response.status(404).end()
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

// const formatPerson = (person) => {
//   return {
//     name: person.name,
//     number: person.number,
//     id: person._id
//   }
// }
//  response.status(204).end()
