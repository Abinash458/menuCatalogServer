const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const authenticate = require('../authenticate');
const cors = require('./cors');
const Feedbacks = require('../models/feedback');

const feedbackRouter = express.Router();

feedbackRouter.use(bodyParser.json());

feedbackRouter.route('/')
.options( cors.corsWithOptions, (req, res) => { res.sendStatus(200); } )
.get(cors.cors, (req, res, next) => {
    Feedbacks.find(req.query)
    .populate('author')
    .then((feedbacks) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(feedbacks);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    if(req.body != null) {
        req.body.author = req.user._id;
        Feedbacks.create(req.body)
        .then((feedback) => {
            Feedbacks.findById(feedback._id)
            .populate('author')
            .then((feedback) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(feedback);
            })
        }, (err) => next(err))
        .catch((err) => next(err));
    }
    else {
        err = new Error('Feedback not found in request body!');
        err.status = 404;
        return next(err);
    }
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /feedback');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Feedbacks.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

feedbackRouter.route('/:feedbackId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req, res, next) => {
    Feedbacks.findById(req.params.feedbackId)
    .populate('author')
    .then((feedback) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(feedback);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /feedbacks/' + req.params.feedbackId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Feedbacks.findById(req.params.feedbackId)
    .then((feedback) => {
        if(feedback != null) {
            if(!feedback.author.equals(req.user._id)) {
                var err = new Error('You are not authorized to update this feedback!');
                err.status = 403;
                return next(err);
            }
            req.body.author = req.user._id;
            Feedbacks.findByIdAndUpdate(req.params.feedbackId, {
                $set: req.body
            },{ new : true })
            .then((feedback) => {
                Feedbacks.findById('feedback._id')
                .populate('author')
                .then((feedback) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(feedback);
                })
            }, (err) => next(err))
        }
        else {
            err = new Error('Feedbacks ' + req.params.feedbackId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Feedbacks.findByIdAndRemove(req.params.feedbackId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
});

module.exports = feedbackRouter;