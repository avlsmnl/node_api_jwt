const router = require('express').Router();
const verify = require('./verifyToken');

router.get('/', verify, async (req, res) => {

   res.json({
       posts: {
           title: 'My first post.',
           description: 'Random data yyou shouldnt access.'
       }
   });

});

module.exports = router;