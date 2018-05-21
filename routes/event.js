'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Event = require('../models/event');

// ################################# GET-POST #################################//

/* router.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect('/auth/login');
  }
}); */

/* GET create event page. */
router.get('/create', function (req, res, next) {
  if (req.session.currentUser) {
    res.render('pages/create-event');
  } else {
    res.redirect('/auth/login');
  }
});

/* POST create event in a database */
router.post('/create', (req, res, next) => {
  /*  if( req.session.currentUser){...} */
  const title = req.body.title;
  const musicType = req.body.musicType;
  const description = req.body.description;
  const bar = req.session.currentUser._id;

  if (title === '' || musicType === '') {
    res.render('pages/create-event', {
      errorMessage: 'All fields required!'
    });
    return;
  }

  Event.findOne({ title: title })
    .then(result => {
      const event = new Event({
        title,
        musicType,
        description,
        bar
      });

      event.save()
        .then(() => {
          res.redirect(`event-details/${event._id}`);
        })
        .catch(next);
    });
});

/* GET event details */
router.get('/event-details/:eventId', (req, res, next) => {
  // validate mongo ID and send 404 if invalid
  if (!mongoose.Types.ObjectId.isValid(req.params.eventId)) {
    res.status(404);
    res.render('not-found');
    return;
  }
  // else
  Event.findOne({ _id: req.params.eventId })
    .populate('bar')
    .then((result) => {
      const data = {
        event: result
      };
      res.render('pages/event-details', data);
    })
    .catch(next);
});

/* GET events page */
router.get('/list', (req, res, next) => {
  Event.find({})
    .then((result) => {
      const data = {
        events: result
      };
      res.render('pages/events', data);
    })
    .catch(next);
});

module.exports = router;
