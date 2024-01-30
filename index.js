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

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }else if(error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.get('/api/persons',(request,response)=> {
    Person.find({})
    .then(persons => response.json(persons))
    .catch(error => next(error))
})
app.get('/info', (request, response, next)=> {
    Person.countDocuments({})
    .then(count => response.send(`<p>Phonebook has info for ${count} people</p>
    <p>${Date()}</p>`))
    .catch(error => next(error)) 
})

app.get('/api/persons/:id', (request, response, next)=>{
  Person.findById(request.params.id).then(person => {
    if(person){
      response.json(person)
    }else{
      response.status(404).end()
    }  
  })
  .catch( error => next(error))
})

app.delete('/api/persons/:id', (request, response, next)=> {
  const id = request.params.id
  Person.findByIdAndDelete(id).then(result => response.status(204).end())
  .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if(!body.name || !body.number){
    response.statusMessage = 'content missing'
    return response.status(400).end()
  }     
  const person = new Person({
    name: body.name,
    number: body.number,
  })
  person.save().then(savedPerson => response.json(savedPerson))
  .catch(error => next(error))
})

app.put('/api/persons/:id',(request, response, next) => {
  const {name, number} = request.body

  Person.findByIdAndUpdate(
    request.params.id,
    {name, number}, 
    { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.use(errorHandler)

const PORT = process.env.PORT 
app.listen(PORT,(err) =>{
  err ? console.log(err):console.log(`Server running on port ${PORT}`)
})
