const express = require('express');
const router = express.Router();
const multer = require('multer');
const Candidate = require('../models/candidate');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: file => {
            if (file.fieldname === "resume") {
                return 5 * 1024 * 1024; // 5MB for PDF
            }
            return 50 * 1024 * 1024; // 50MB for video
        }
    }
});

// Submit application with files
router.post('/', upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'video', maxCount: 1 }
]), async (req, res) => {
    try {
        const { firstName, lastName, positionAppliedFor, currentPosition, experienceYears } = req.body;
        
        // Validate required fields
        if (!firstName || !lastName || !positionAppliedFor || !currentPosition || !experienceYears) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Validate files
        if (!req.files['resume']) {
            return res.status(400).json({ message: 'Resume is required' });
        }

        const candidate = new Candidate({
            firstName,
            lastName,
            positionAppliedFor,
            currentPosition,
            experienceYears: Number(experienceYears),
            resumePath: req.files['resume'][0].path,
            videoPath: req.files['video'] ? req.files['video'][0].path : null
        });

        await candidate.save();
        res.status(201).json({ message: 'Application submitted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error submitting application' });
    }
});

// Get all candidates
router.get('/', async (req, res) => {
    try {
        const candidates = await Candidate.find();
        res.json(candidates);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching candidates' });
    }
});

module.exports = router;