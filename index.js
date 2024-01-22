const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
require('dotenv').config()
const Person = require('./models/person')

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = []

app.get('/api/persons',(request,response)=> {
    Person.find({})
    .then(persons => response.json(persons))
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
     
  const person = new Person({
    name: body.name,
    number: body.number,
  })
  person.save().then(savedPerson => response.json(savedPerson))
})

const PORT = process.env.PORT 
app.listen(PORT,(err) =>{
  err ? console.log(err):console.log(`Server running on port ${PORT}`)
})
