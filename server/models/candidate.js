const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    positionAppliedFor: {
        type: String,
        required: true
    },
    currentPosition: {
        type: String,
        required: true
    },
    experienceYears: {
        type: Number,
        required: true
    },
    resumePath: {
        type: String,
        required: true
    },
    videoPath: {
        type: String
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Candidate', candidateSchema);