const router = require('express').Router();
const User = require('../model/User');
const { registerValidation, loginValidation } = require('../validation');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

router.post('/register', async (req, res) => {

    //Lets validate before we build an user.
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message); 

    //Checking if the user already exists.
    const emailExist = await User.findOne({email: req.body.email});
    if (emailExist) return res.status(400).send('Email already exists.');

    //Hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //Create a new user.
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });

    try {
        const savedUser = await user.save();
        res.send({user: user._id});
        //res.send(savedUser);
    } catch (err) {
        res.status(400).send(err);
    }

});

router.post('/login', async (req, res) => {

    //Lets validate before we build an user.
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message); 

    //Checking if the email exists.
    const user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).send('Email does not exists.');

    //Checking if the password is correct
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid password.');

    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);

    res.send('Logged in.');

});

module.exports = router;