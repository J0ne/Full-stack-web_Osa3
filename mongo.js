const mongoose = require('mongoose')

const dbUrl = 'mongodb://fullstack:fsm0ngo@ds223268.mlab.com:23268/fullstack-personsdb'

mongoose.connect(dbUrl)
mongoose.Promise = global.Promise;

// const Person = mongoose.model('Person', {
//     name: String,
//     number: String
// })

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})


const Person = mongoose.model('Person', personSchema);

const addPerson = (name, number) => {

    const newPerson = new Person({
        name: name,
        number: number
    })
    newPerson.save().then(response => {
        console.log(`Lisätään henkilö ${name} numero ${number} luetteloon`)
        mongoose.connection.close()
    }).catch(err => {
        console.log("Joku meni pieleen:", err)
    })
}

const getList = () => Person.find({})
    .then(result => {
        console.log('Puhelinluettelo:')
        result.forEach(person => {
            console.log(person.name,'       ',person.number);
        })
        
        mongoose.connection.close()
    })

var args = process.argv.map((item) => {
    return item
});
if(args.length == 4){
    addPerson(args[2], args[3])
}else{
    getList();
}
