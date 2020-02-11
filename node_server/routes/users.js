var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/login', function(req, res) {
  res.json({success: true});
});

module.exports = router;