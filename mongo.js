const {MongoClient} = require('mongodb');
const mongoose = require('mongoose');

const url = 'mongodb://127.0.0.1/phonebookApp';

mongoose.set('strictQuery',false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
    name: String, 
    number: String
})

const Person = mongoose.model('Person', personSchema)

//   const person = new Person({
//     name: 'Ada Lovelace',
//     number: '39-44-5323523',
//   })
  
//   person.save().then(result => {
//     console.log('note saved!')
//     mongoose.connection.close()
//   })
if(!process.argv[2]){
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(person => {
          console.log(person.name + ': ' + person.number)
        })
        mongoose.connection.close()
      })
}else{          
        const person = new Person({
            name: process.argv[2],
            number: process.argv[3],
        })        
        person.save().then(result => {
            console.log(`added ${process.argv[2]} number ${process.argv[3]} to phonebook`);
            mongoose.connection.close()
        })      
}
let dbConnection;

module.exports = {
    connectToDb: (cb) => {
        MongoClient.connect(url)
        .then((client)=>{
            console.log('Connected to MongoDb');
            dbConnection = client.db();
            return cb();
        })
        .catch((err)=>{
            return cb(err);
        })
    },
    getDb: ()=> dbConnection,
}