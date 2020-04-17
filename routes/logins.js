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


router.post('/signup', function(req,res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;

    checkIfEmailExists(email).then(function(emailExists) {
        if (emailExists) {
            return res.send({
                success: false,
                message: 'User account already created with this email'
            });
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
            .then(() => res.send('User successfully added!'))
            .catch(err => res.status(400).json('Error: ' + err))
        }   
    });
});


// Route for Login Process
router.post('/login', function(req,res, next) {
    const email = req.body.email;
    const password = req.body.password;

    User.find({
        email: email
    }, (err, users) => {
        if (err) {
            return res.send({
                success: false,
                message: 'Error: server error'
            });
        }
        if (users.length !=1) {
            return res.send({
                success: false,
                message: 'Error: Invalid'
            });
        }

        const user = users[0];
        if (!user.validPassword(password)) {
            return res.send({
                success: false,
                message: 'Error: Invalid Password'
            });
        }

        // TODO redirect to User specific page. (needs user page to be implemented first)
        res.json('Valid Password, logging in')
    });
});


// Implement User session for logging out?
router.delete('/logout', function(req,res) {
    res.send('logging out')
});


module.exports = router;