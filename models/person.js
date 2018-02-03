const mongoose = require('mongoose')

const dbUrl = 'mongodb://fullstack:fsm0ngo@ds223268.mlab.com:23268/fullstack-personsdb'

mongoose.connect(dbUrl)
mongoose.Promise = global.Promise;

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})
personSchema.statics.formatPerson = function(person){
    return {
        name: person.name,
        number: person.number,
        id: person._id
    }
}

const Person = mongoose.model('Person', personSchema)


module.exports = Person