const mongoose = require('mongoose');
const User = require('./models/User');
const config = require('./config');

const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');

const router = express.Router();

const client = new OAuth2Client(config.GOOGLE_CLIENT_ID);


// POST /api/auth/google
router.post('/google', async (req, res) => {
  const { credential } = req.body;
  if (!credential) {
    return res.status(400).json({ error: 'Missing Google credential token' });
  }
  try {

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: config.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    let user = await User.findOne({ email: payload.email });
    if (!user) {
      user = await User.create({
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        googleId: payload.sub,
      });
    }

    const token = jwt.sign({
      id: user._id,
      email: user.email,
      name: user.name,
      picture: user.picture,
      sub: user.googleId,
    }, config.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: { email: user.email, name: user.name, picture: user.picture } });
  } catch (err) {
    res.status(401).json({ error: 'Invalid Google token or DB error' });
  }
});

module.exports = router;
