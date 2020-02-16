const express = require('express');
const Event = require('../models/events');
const Notification=require('../models/notifications');

const router = express.Router();

router.route('/')
    .get((req, res, next) => {
        Event.find({})
        .populate({
            path: 'author',
            select: 'username'
        })
            .then((event) => {
                res.json(event);
                
            }).catch((err) => next(err));
    })
    // .post((req, res, next) => {
    //     let event = new Event(req.body);
    //     event.author = req.user._id;
    //     event.save()
    //         .then((event) => {
    //             res.statusCode = 201;
    //             res.json(event);
    //         }).catch(next);
    // })
    .post((req, res, next) => {
        let event = new Event(req.body);
        // loop around user and author to create notifications
    
        event.author = req.user._id;
        event.save()
            .then((event) => {
               // console.log(req.body);
                let notifications = [];
                notificationArr = req.body.users.concat(event.author)
                notificationArr.forEach((each,index)=>{
                    notifyObj = {
                        user:each,
                        events:event._id,
                    }
                    let notify=new Notification(notifyObj);
                    notify.save().then(notifyData=>{
                        notifications.push(notifyData)
                            if(index === notificationArr.length-1){ // send only after last notification creation
                                res.json({
                                    event,
                                    notifications
                                });
                            }
                    }).catch(next);
                })
            }).catch(next);
        
    })
    .put((req, res) => {
        res.statusCode = 405;
        res.json({ message: "Method not supported" });
    })
    .delete((req, res, next) => {
        Event.deleteMany({ author: req.user._id })
            .then((reply) => {
                res.json(reply);
            }).catch(next);
    });

router.route('/:id')
    .get((req, res, next) => {
        Event.findOne({ author: req.user._id, _id: req.params.id })
        .populate({
            path: 'author',
            select: 'username'
        })
            .then((event) => {
                if (event == null) throw new Error("Event not found!")
                res.json(event);
            }).catch(next);
    })
    .post((req, res) => {
        res.statusCode = 405;
        res.json({ message: "Method not allowed" });
    })
    .put((req, res, next) => {
        Event.findOneAndUpdate({ author: req.user._id, _id: req.params.id }, { $set: req.body }, { new: true })
            .then((reply) => {
                if (reply == null) throw new Error("Event not found!");
                res.json(reply);
            }).catch(next);
    })
    .delete((req, res, next) => {
        Event.findOneAndDelete({ author: req.user._id, _id: req.params.id })
            .then((event) => {
                if (event == null) throw new Error("Event not found!");
                res.json(event);
            }).catch(next);
    });

router.route('/:id/notes')
    .get((req, res, next) => {
        Event.findById(req.params.id)
            .then((event) => {
                res.json(event.notes);
            })
            .catch(next);
    })
    .post((req, res, next) => {
        Event.findById(req.params.id)
            .then((event) => {
                event.notes.push(req.body);
                event.save()
                    .then((event) => {
                        res.json(event.notes);
                    })
                    .catch(next);
            })
            .catch(next);
    })
    .put((req, res) => {
        res.statusCode = 405;
        res.json({ message: "Method not allowed" });
    })
    .delete((req, res, next) => {
        Event.findById(req.params.id)
            .then((event) => {
                event.notes = [];
                event.save()
                    .then((event) => {
                        res.json(event.notes);
                    })
                    .catch(next);
            })
            .catch(next);
    });

router.route('/:id/notes/:nid')
    .get((req, res, next) => {
        Event.findById(req.params.id)
            .then((event) => {
                let note = event.notes.id(req.params.nid);
                res.json(note);
            })
            .catch(next);
    })
    .post((req, res) => {
        res.statusCode = 405;
        res.json({ message: "Method not allowed" });
    })
    .put((req, res, next) => {
        Event.findById(req.params.id)
            .then((event) => {
                let note = event.notes.id(req.params.nid);
                note.note = req.body.note;
                event.save()
                    .then(() => {
                        res.json(note);
                    })
                    .catch(next);
            })
            .catch(next);
    })
    .delete((req, res, next) => {
        Event.findById(req.params.id)
            .then((event) => {
                event.notes.pull(req.params.nid);
                event.save()
                    .then((event) => {
                        res.json(event.notes);
                    })
                    .catch(next);
            })
            .catch();
    });
module.exports = router;

