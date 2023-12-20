const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    tags: [String],
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    upvotes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        }
    ],
    downvotes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        }
    ],
    voteScore: {
        type: Number,
        default: 0
    },
    comments: [{
        writer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        commentContent: {
            type: String,
            required: true
        }
    }]
});

module.exports = mongoose.model('Post', postSchema);