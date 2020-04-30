const express = require('express');
const router = express.Router();
let Note = require('../models/note.model');


// View notes endpoint 
router.get('/view', function(req,res) {
    const userEmail = req.session.email;
    Note.find({recipient: userEmail},(err,data)=>{
        if(err) {
            res.status(404).send(err);
        }
        else {
            res.status(200).send(data);
        }
});


// Send note endpoint
router.post('/send', function(req,res) {
    const sender = req.body.sender;
    const recipient = req.body.recipient;
    const contents = req.body.contents;

    // ALSO UPDATE THE WRITTENTO ARRAY IN THE SENDER'S USER INFO??? 

    // create new Note object for DB insertion
    const newNote = new Note({
        sender,
        recipient,
        contents
    });

    // save note to DB and send response or error message
    newNote.save()
    .then(() => res.status(200).send('Sent warm and fuzzy!'))
    .catch(err => res.status(500).json('Error: ' + err));
});

// WHAT IT DOES: get list of all users
// route path: /users
// returns array of all user ids in the database
// IF POSSIBLE, can we return an array of tuples (user_id, firstname, lastname)
// that way we can easily display all info it on the write Notes page

// WHAT IT DOES: get all users that a specific user has written notes to
// route path: /written/:id
// use req.params.id to get the id off that path
// returns an array of user ids who we've sent notes to


module.exports = router;