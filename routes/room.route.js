const auth = require('../middlewares/auth.midddleware');
const router = require('express').Router();

router.get('/rooms', auth, (req, res) => {
  const user = req.user;
  
});

module.exports = router;
