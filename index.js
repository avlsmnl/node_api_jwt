const express = require('express');
const app = express();

//Import
const authRoute = require('./routes/auth');

//Routes middleware
app.use('/api/user', authRoute);


app.listen(3000, () => console.log('Server up and running...'));