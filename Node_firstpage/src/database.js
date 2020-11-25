const mongoose = require('mongoose');
mongoose.connect(
    'mongodb+srv://Esli:Esli15121995@cluster0.q21gi.mongodb.net/test?retryWrites=true', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false
})
.then(db => console.log('Base de datos conectada'))
.catch(err => console.error(err));