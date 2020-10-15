const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { body, validationResult } = require('express-validator');
const auth = require('../middlewares/auth.midddleware');
const bcrypt = require('bcrypt');

const JWT_SECRET = process.env['JWT_SECRET'];
const SALT_ROUNDS = parseInt(process.env['BCRYPT_SALT_ROUNDS']);

router.post(
  '/signup',
  [
    body('username', '用户名不合法').matches(/^[a-zA-Z_\-]+$/),
    body('password').notEmpty(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.mapped() });
    }
    const { username, password } = req.body;

    User.findOne({ username }, (err, user) => {
      if (err) throw err;
      if (user === null) {
        const userSign = new User();
        userSign.username = username;
        bcrypt.hash(password, SALT_ROUNDS, function (err, hash) {
          if (err) throw err;
          userSign.password = hash;
          userSign.save();
          res.status(201).json(userSign);
        });
      } else {
        res.status(403).json({ error: '用户已存在' });
      }
    });
  }
);

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
      if (user) {
        bcrypt.compare(password, user.password, function (err, result) {
          if (err) throw err;
          if (result) {
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
            user.password = undefined;
            res.json({ user, token });
          } else {
            // 认证失败
            res.status(401).json({ error: '密码错误' });
          }
        });
      } else {
        // 用户不存在
        res.status(401).json({ error: '用户不存在' });
      }
    });
  }
);

router.get('/user', auth, (req, res) => {
  res.send(req.user);
});

module.exports = router;
