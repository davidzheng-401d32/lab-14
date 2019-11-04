'use strict';

const express = require('express');
const authRouter = express.Router();

const User = require('./users-model.js');
const auth = require('./middleware.js');
const oauth = require('./oauth/google.js');

authRouter.post('/signup', (req, res, next) => {
  let user = new User(req.body);
  user.save()
    .then( (user) => {
      req.token = user.generateToken();
      req.user = user;
      res.set('token', req.token);
      res.cookie('auth', req.token);
      res.send(req.token);
    })
    .catch(next);
});

authRouter.post('/signin', auth(), (req, res, next) => {
  res.cookie('auth', req.token);
  res.send(req.token);
});

authRouter.get('/public-stuff', (req, res) => {
  res.send('anybody can see this');
});

authRouter.get('/hidden-stuff', auth(), (req, res) => {
  res.send('this is for users who are logged in');
});

authRouter.get('/something-to-read', auth('read'), (req, res) => {
  res.send('you can read!');
});

authRouter.get('/create-a-thing', auth('create'), (req, res) => {
  res.send('you can make things');
});

authRouter.get('/update', auth('update'), (req, res) => {
  res.send('you can update it');
});

authRouter.get('/jp', auth('update'), (req, res) => {
  res.send('update more');
});

authRouter.get('/bye-bye', auth('delete'), (req, res) => {
  res.send('you can delete it');
});

authRouter.get('/everything', auth('superuser'), (req, res) => {
  res.send('super user');
});

authRouter.get('/oauth', (req,res,next) => {
  oauth.authorize(req)
    .then( token => {
      res.status(200).send(token);
    })
    .catch(next);
});

authRouter.post('/key', auth, (req,res,next) => {
  let key = req.user.generateKey();
  res.status(200).send(key);
});

module.exports = authRouter;
