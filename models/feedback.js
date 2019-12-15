const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var feedbackSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    telnum: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    agree: {
        type: Boolean,
        required: true
    },
    contactType: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    author:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
});

var Feedbacks = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedbacks;