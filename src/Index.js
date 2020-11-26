
// const mqtt = require('mqtt');
// const client = mqtt.connect('mqtt://tairda.siteldi.mx'); 
const flash = require('connect-flash');
const password = require('passport');
const express = require('express');
const socketIO = require ('socket.io');
const http = require('http');
const methodOverride = require('method-override');
const session = require('express-session');


// INITILIAZATIONS
const app = express();
require('./database');
require('./config/passport');

const server = http.createServer(app);
const io = socketIO(server);
var msg;
var conex;
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://Esli:Esli15121995@cluster0.q21gi.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true  
  });
  
  client.connect(err => {
    conex = client.db("test");
    console.log('db connect');
    
    // perform actions on the collection object
    //client.close();
  });


/*
const mongoose = require ('mongoose');
const URI = 'mongodb+srv://Esli:Esli15121995@cluster0.q21gi.mongodb.net/test?retryWrites=true&w=majority';
const connectDB = async()=>{
  await mongoose.connect(URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true  
    });
  console.log('db connect');
};

connectDB();
*/
// Ajusta las barras ya sea linux o windows
const path = require('path');

const mqtt = require('mqtt');
const client_mqtt = mqtt.connect('mqtt://tairda.siteldi.mx');  

client_mqtt.on('connect', function () {
    client_mqtt.subscribe('data', function (err) {
    })
  });

 //  
client_mqtt.on('message', function (topic, message) {
    // message is Buffer
    msg = message.toString(); 
    var myobj = JSON.parse(message);
    conex.collection("devices").insertOne(myobj, function(err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      //db.close();
    });
    //a = document.getElementById("tag_mqtt").innerHTML = message.toString();
    console.log( message.toString());

    
    //client.end()
  });
// MQTT

/*
var client = mqtt.connect('mqtt://tairda.siteldi.mx'); 
client.on('connect', function () {
    client.subscribe('presence', function (err) {
    })
  })

 //  
client.on('message', function (topic, message) {
    // message is Buffer
    msg = message.toString();

    //a = document.getElementById("tag_mqtt").innerHTML = message.toString();
    console.log(msg);
    
    //client.end()
  })*/

const exphbs = require('express-handlebars');
app.set('port', process.env.PORT || 3000);

var sys = require('sys');
var net = require('net');
const passport = require('passport');

app.set ('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs',
}));
app.set('view engine', '.hbs');

// Middleware
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(session({
  secret: 'mysecretapp',
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user||null;
  next();
});
// Routes
app.use(require('./routes/Index'));
app.use(require('./routes/notes'));
app.use(require('./routes/users'));


// Sockets
require('./sockets')(io);

// Static files
app.use(express.static(path.join(__dirname, 'public')));


// Listening
server.listen(app.get('port'), () =>  {
    console.log('Server on port', app.get('port'));
});
