const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { body, validationResult } = require('express-validator');
const auth = require('../middlewares/auth.midddleware');

const JWT_SECRET = process.env['JWT_SECRET'];

router.post(
  '/signin',
  [body('username').notEmpty(), body('password').notEmpty()],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.mapped()});
    }
    const { username, password} = req.body;
    var insertInfo = {"username" : username, "password" : password};

    User.findOne({ username }, (err, user) =>{
      if (err) throw err;
      if (user === null ) {
        User.create(insertInfo);
        res.json("注册成功");
      }
      else {
        res.status(401).json({error : "用户已存在"});
      }
    });
  });

router.post(
  '/login',
  [body('username').notEmpty(), body('password').notEmpty()],
  (req, res) => {
    const errors = validationResult(req);
    // 验证body
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.mapped() });
    }
    const { username, password } = req.body;
    User.findOne({ username }, (err, user) => {
      if (err) throw err;
      if (user !== null && user.password === password) {
        // 签发JWT令牌
        const token = jwt.sign(
          {
            username: user.username,
            id: user.id,
          },
          JWT_SECRET,
          {
            expiresIn: '10 days',
          }
        );
        res.json({ user, token });
      } else {
        // 认证失败
        res.status(401).json({ error: '认证失败' });
      }
    });
  }
);

router.get('/user', auth, (req, res) => {
  console.log(req.user);
  res.send(req.user);
});

module.exports = router;
