const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    { 
        "id": 1,
        "name": "Arto Hellas", 
        "number": "040-123456"
      },
      { 
        "id": 2,
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
      },
      { 
        "id": 3,
        "name": "Dan Abramov", 
        "number": "12-43-234345"
      },
      { 
        "id": 4,
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
      }
]
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })
app.get('/api/persons',(request,response)=> {
    response.json(persons)
})
app.get('/info', (request, response)=> {
    response.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p>${Date()}</p>`)
})
app.get('/api/persons/:id', (request, response)=>{
  const id = Number(request.params.id)
  const person = persons.find(p=>p.id === id)
  if(person){
    response.json(person)
  }else{
    response.statusMessage = 'The requested person does not exist.'
    response.status(404).end()
  }
})
app.delete('/api/persons/:id', (request, response)=> {
  const id = Number(request.params.id)
  persons = persons.filter(p => p.id !== id)
  response.status(204).end()
})
const randomId = (max) =>{
  return Math.floor(Math.random()*max)
}
app.post('/api/persons', (request, response) => {
  const body = request.body

  if(!body.name || !body.number){
    response.statusMessage = 'content missing'
    return response.status(400).end()
  } 
  if(persons.find(p => p.name === body.name)) 
  return response.status(400).json({error:'name must be unique'})

  if(persons.find(p => p.number === body.number))
   return response.status(400).json({error:'number must be unique'})
     
  const person = {
    name: body.name,
    number: body.number,
    id: randomId(10000)
  }
  console.log(person)
  persons.concat(person)
  response.json(person)
})


const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)