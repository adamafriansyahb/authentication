require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();

mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', (error) => {
    console.log(error);
});
db.once('open', () => {
    console.log('Connected to database');
});

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/register', (req, res) => {

    bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
        const user = new User({
            email: req.body.username,
            password: hash
        });

        try {
            const newUser = await user.save();
            res.render('secrets', {user: newUser.email});
        }
        catch {
            res.redirect('/');
        }
    });

});

app.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        const user =  await User.findOne({email: username});
        if (user) {
            bcrypt.compare(password, user.password, (err, result) => {
                if (result == true) {
                    res.render('secrets', {user: user.email});
                }
                else {
                    console.log("Wrong password.");
                    res.redirect('/login');
                }
            });
        }
        else {
            console.log('User not found.')
            res.redirect('/login');
        }
    }
    catch {
        res.redirect('/login');
    }
});



app.listen(3000, () => {
    console.log('Server running on port 3000');
})
