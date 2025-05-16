const router = require('express').Router();

// agreement
const agreement = require('./agreement');

router.all('*', (req, res) => {
  res.status(404).send({ success: false, msg: `chatbot unknown uri ${req.path}` });
});

module.exports = router;