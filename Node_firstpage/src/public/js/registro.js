const mongoose = require('mongoose');

var cliente = new mongoose.Schema({
    nombre:{
        type: String
    },
    telefono:{
        type: String
    },
    email:{
        type: String
    }
});

mongoose.model('cliente', cliente);