const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const { isAuthenticated } = require('../helpers/auth');

router.get ('/notes/add', isAuthenticated, async (req, res) => {
    //res.sendFile(path.join(__dirname, 'views/Index.html'));
    const notes = await Note.find().lean();
    res.render('notes/new-note', {notes});

});

router.post ('/notes/new-note', isAuthenticated,  async (req, res)=>{

    const{title, description} = req.body;
    const errors = [];
    if (!title){
        errors.push({text: 'Ingresa un titulo'});
    }
    if (!description){
        errors.push({text: 'Ingresa una descripcion'}); 
    }
    if (errors.length > 0){
        res.render('notes/new-note',{
            errors,
            title,
            description
        });
    }
    else {
        const newNote = new Note({title, description});
        newNote.user = req.user._id;
        console.log(req.user._id);
        await newNote.save();
        req.flash('success_msg', 'Estacionamiento agregado exitosamente');
        res.redirect('/notes');
    }
        //res.send('ok');
});

router.get('/notes', isAuthenticated,  async (req, res) => {
  const notes = await Note.find({user: req.user._id}).sort({date: 'desc'}).lean();
  res.render('notes/all-notes', {notes});
});
/*
router.get('/notes', isAuthenticated,  async (req, res) => {
    await Note.find({user: req.user.id}).sort({date: 'desc'})
      .then(documentos => {
        const contexto = {
            notes: documentos.map(documento => {
            return {
                _id: documento.id,
                title: documento.title,
                description: documento.description
            }
          })
        }
        res.render('notes/all-notes', { notes: contexto.notes }) 
      })
  });
*/

router.get('/notes/edit/:id', isAuthenticated, async (req, res) => {
    const note = await Note.findById(req.params.id).lean();
   
    res.render('notes/edit-note', {note});
}); 

router.put('/notes/edit-note/:id', isAuthenticated, async (req, res) => {
    const {title, description} = req.body;
    await Note.findByIdAndUpdate(req.params.id, {title, description});
    req.flash('success_msg', 'Actualizado correctamente');
    res.redirect('/notes');
});

router.delete('/notes/delete/:id', isAuthenticated, async (req, res) => {
    await Note.findByIdAndDelete(req.params.id).lean();
    req.flash('success_msg', 'Eliminado correctamente');
    res.redirect('/notes');
});
/*
router.get('/notes/edit/:id', async (req, res) => {
    await Note.findById(req.params.id)
      .then(documentos => {
        const contexto = {
            notes: documentos.map(documento => {
            return {
                _id: documento.id,
                title: documento.title,
                description: documento.description
            }
          })
        }
        res.render('notes/edit-note', { notes: contexto.notes }) 
      })
  });

  router.put('/notes/edit-note/:id', async (req, res) =>{
    const {title, description} = req.body;
    await Note.findByIdAndUpdate(req.params.id, {description})
    .then(documentos => {
      const contexto = {
          notes: documentos.map(documento => {
          return {
            _id: documento.id,
              title: documento.title,
              description: documento.description
          }
        })
      }
    })
    res.redirect('/notes');
  });

*/

module.exports = router;