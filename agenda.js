const Agenda = require("agenda")
const Agendash = require("agendash")
var expess = require('express');
var app = expess();

const mongoConnectionString = 'mongodb://127.0.0.1:27017/agenda';
let agenda = new Agenda({ db: { address: mongoConnectionString, collection: 'jobs' }});

agenda.on('ready', () => {
    console.log('Agenda Ready with Database Connection');
    agenda.start();
    console.log('Agenda Started')
})


agenda.define('trying_agenda_every_minute', {priority:2 /*concurrency:10 can be set here*/ }, (data) => {
 
    console.log('Agenda Defined');
    console.log(data.attrs.data);

})

agenda.define('trying_agenda_with_schedule_after_3_mins', {priority:1   }, (data) => {
    
    //Can make MongoDb queries here 
    console.log('Agenda Defined');
    console.log(data.attrs.data);
    //done(data.attrs.data);
})

app.post('/startAgenda', (req, res) => {
   agenda.every('1 minute', 'trying_agenda_every_minute', 'hello agenda every minute');
   agenda.schedule('3 minutes','trying_agenda_with_schedule_after_3_mins','Scheduled agenda') //scheduling a job after a specific time with the name and data
    res.send();
})

app.use('/dash', Agendash(agenda)); // use to see the jobs under progress/completed just like rabbitmq dashboard

app.listen(9050, () => {
    console.log('Listening on port 9050');
});