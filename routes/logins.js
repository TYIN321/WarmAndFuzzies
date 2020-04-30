const express = require('express');
const router = express.Router();


// Bring in the User Model
let User = require('../models/user.model');


// TODO: maybe move this somewhere else? 
function checkIfEmailExists(signupEmail){
    return User.findOne({email: signupEmail}).then(function(result){
        if (result === null){
            return false;
        }
        else {
            return true;
        }
    });
}


router.post('/', function(req,res) {
    // if (req.session.key) {
    //     res.redirect('/notes/send'); //TODO render this page
    // }

    // else {
    //     res.redirect('/login');     // TODO render login page 
    // }
    res.redirect('/login');
});

router.post('/signup', function(req,res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;

    checkIfEmailExists(email).then(function(emailExists) {
        if (emailExists) {
            res.status(400).send('User account already created with this email');
        }
        else {
            const newUser = new User({
                firstName,
                lastName,
                email,
                password
            });

            newUser.password = newUser.generateHash(newUser.password);
            newUser.save()
            .then(() => res.status(200).send('User successfully added!'))
            .catch(err => res.status(500).json('Error: ' + err))

        }   
    });
});


// Route for Login Process
router.post('/login', function(req,res, next) {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({
        email: email
    }, (err, user) => {
        if (err) {
            res.status(500).send('Error: server error');
        }
        
        if (user === null) {
            res.status(404).send('Error: no user exists with that email');
        }

        if (!user.validPassword(password)) {
            res.status(404).send('Error: Invalid Password');
        }

       // Kasey: Change session key to id? To make calls to access data easier bc we have id readily available
        // req.session.key = email;
        res.status(200).send('Error: Invalid Password');
    });
});


// Implement User session for logging out?
router.get('/logout', function(req,res) {
    // req.session.destroy(function(err){
    //     if(err){
    //         console.log(err);
    //     } else {
    //         res.redirect('/');     
    //     }
    // });
});

// WHAT IT'S FOR: get user data for displaying on profile + updating too 
// returns that user model/object
// path name: /user/:id

// WHAT IT'S FOR: updating user data
// path name: /user/update/:id
// is given first name and last name to update


module.exports = router;