const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./models/User');

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});
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

app.post('/register', async (req, res) => {
    const user = new User({
        email: req.body.username,
        password: req.body.password
    });

    try {
        const newUser = await user.save();
        res.render('secrets', {user: newUser.email});
    }
    catch {
        res.redirect('/');
    }
});

app.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        const user =  await User.findOne({email: username});
        if (user) {
            if (user.password === password) {
                res.render('secrets', {user: user.email});
            }
            else {
                console.log('Wrong password.');
                res.redirect('/login');
            }
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
