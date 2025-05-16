var express = require('express');
var router = express.Router();
const chatbot = require('./chatbot')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  next();
});

router.use('/chatbot', chatbot)

module.exports = router;