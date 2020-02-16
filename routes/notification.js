const express = require('express');
const Notification = require('../models/notifications');
const auth = require('../auth');

const router = express.Router();



router.route('/')
    .get((req,res,next)=>{
        Notification.find({user: req.user._id})
        .populate({
            path : 'events',
            populate : {
              path : 'author'
            }
          })
        // .populate("author")
        .then((notification)=>{
            res.json(notification);
        }).catch(next);
    });



    module.exports = router;