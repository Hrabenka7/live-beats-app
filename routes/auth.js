'use strict';

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const bcryptSalt = 10;
const Bar = require('../models/bar');

/* GET sign-up page. */
router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

/* SAVE bar to db */
router.post('/signup', (req, res, next) => {
  const barname = req.body.barname;
  const password = req.body.password;
  const phone = req.body.phone;
  const lng = req.body.lng;
  const lat = req.body.lat;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  if (barname === '' || password === '' || phone === '' || lng === '' || lat === '') {
    res.render('auth/signup', {
      errorMessage: 'All fields required!'
    });
    return;
  }

  Bar.findOne({ barname: barname })
    .then(result => {
      if (result) {
        res.render('auth/signup', {
          errorMessage: 'Sorry, your bar already exists ;)'
        });
        return;
      }

      const bar = new Bar({
        barname,
        password: hashPass,
        location: {
          type: 'Point',
          coordinates: [lng, lat]
        },
        phone
      });

      bar.save()
        .then(() => {
          res.redirect('login');
        })
        .catch(next);
    })
    .catch(next);
});

/* GET log-in page */

router.get('/login', (req, res, next) => {
  res.render('auth/login');
});

/* POST log-in */

router.post('/login', (req, res, next) => {
  const barname = req.body.barname;
  const password = req.body.password;

  if (barname === '' || password === '') {
    res.render('auth/login', {
      errorMessage: `Empty fields`
    });
    return;
  }

  // TODO:- Promise instead callback
  Bar.findOne({barname: barname}, (err, bar) => {
    if (err || !bar) {
      res.render('auth/login', {
        errorMessage: `Barname doesn't exist`
      });
      return;
    }
    if (bcrypt.compareSync(password, bar.password)) {
      req.session.currentUser = bar;
      res.redirect('/');
    } else {
      res.render('auth/login', {
        errorMessage: 'Incorrect password'
      });
    }
  });
});

/* POST logout */

router.post('/logout', (req, res, next) => {
  req.session.currentUser = null; // delete req.session.user
  res.redirect('/');
});

module.exports = router;
