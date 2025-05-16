const router = require('express').Router();

const agreement = require('./agreement');
const inquiry = require('./inquiry');
const cancel = require('./cancel');
const photo = require('./photo');

router.use('/agreement', agreement);
router.use('/inquiry', inquiry);
router.use('/cancel', cancel);
router.use('/photo', photo);

router.all('*', (req, res) => {
  res.status(404).send({ success: false, msg: `chatbot unknown uri ${req.path}` });
});

module.exports = router;
