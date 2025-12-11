const express = require('express');
const router = express.Router();
const Professor = require('../models/Professor');

// GET /api/professors - Get all professors
router.get('/', async (req, res) => {
    try {
        const { department } = req.query;

        let filter = {};
        if (department) filter.department = department;

        const professors = await Professor
            .find(filter)
            .populate('courses', 'code name')
            .sort({ title: 1, name: 1 });

        res.json(professors);

    } catch (error) {
        console.error('Professors fetch error:', error);
        res.status(500).json({ error: 'Hocalar yüklenirken hata oluştu' });
    }
});

// GET /api/professors/:id - Get professor by ID
router.get('/:id', async (req, res) => {
    try {
        const professor = await Professor
            .findById(req.params.id)
            .populate('courses', 'code name semester credits');

        if (!professor) {
            return res.status(404).json({ error: 'Hoca bulunamadı' });
        }

        res.json(professor);

    } catch (error) {
        console.error('Professor fetch error:', error);
        res.status(500).json({ error: 'Hoca yüklenirken hata oluştu' });
    }
});

// POST /api/professors/:id/review - Add a review for a professor
router.post('/:id/review', async (req, res) => {
    try {
        const { teachingStyle, examDifficulty, accessibility, comment, rating } = req.body;

        const professor = await Professor.findById(req.params.id);
        if (!professor) {
            return res.status(404).json({ error: 'Hoca bulunamadı' });
        }

        professor.studentReviews.push({
            teachingStyle,
            examDifficulty,
            accessibility,
            comment,
            rating
        });
        await professor.save();

        res.json({ message: 'Değerlendirme eklendi', professor });

    } catch (error) {
        console.error('Review add error:', error);
        res.status(500).json({ error: 'Değerlendirme eklenirken hata oluştu' });
    }
});

// GET /api/professors/search/:query - Search professors
router.get('/search/:query', async (req, res) => {
    try {
        const { query } = req.params;

        const professors = await Professor.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { researchAreas: { $regex: query, $options: 'i' } }
            ]
        }).populate('courses', 'code name');

        res.json(professors);

    } catch (error) {
        console.error('Professor search error:', error);
        res.status(500).json({ error: 'Arama sırasında hata oluştu' });
    }
});

module.exports = router;
