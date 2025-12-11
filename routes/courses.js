const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

// GET /api/courses - Get all courses
router.get('/', async (req, res) => {
    try {
        const { semester, department, difficulty } = req.query;

        let filter = {};
        if (semester) filter.semester = parseInt(semester);
        if (department) filter.department = department;
        if (difficulty) filter.difficulty = difficulty;

        const courses = await Course
            .find(filter)
            .populate('professors', 'name title')
            .sort({ semester: 1, code: 1 });

        res.json(courses);

    } catch (error) {
        console.error('Courses fetch error:', error);
        res.status(500).json({ error: 'Dersler yüklenirken hata oluştu' });
    }
});

// GET /api/courses/:id - Get course by ID
router.get('/:id', async (req, res) => {
    try {
        const course = await Course
            .findById(req.params.id)
            .populate('professors', 'name title email officeLocation')
            .populate('prerequisites', 'code name');

        if (!course) {
            return res.status(404).json({ error: 'Ders bulunamadı' });
        }

        res.json(course);

    } catch (error) {
        console.error('Course fetch error:', error);
        res.status(500).json({ error: 'Ders yüklenirken hata oluştu' });
    }
});

// POST /api/courses/:id/comment - Add a comment to a course
router.post('/:id/comment', async (req, res) => {
    try {
        const { comment, rating } = req.body;

        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ error: 'Ders bulunamadı' });
        }

        course.studentComments.push({ comment, rating });
        await course.save();

        res.json({ message: 'Yorum eklendi', course });

    } catch (error) {
        console.error('Comment add error:', error);
        res.status(500).json({ error: 'Yorum eklenirken hata oluştu' });
    }
});

// GET /api/courses/search/:query - Search courses
router.get('/search/:query', async (req, res) => {
    try {
        const { query } = req.params;

        const courses = await Course.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { code: { $regex: query, $options: 'i' } },
                { topics: { $regex: query, $options: 'i' } }
            ]
        }).populate('professors', 'name title');

        res.json(courses);

    } catch (error) {
        console.error('Course search error:', error);
        res.status(500).json({ error: 'Arama sırasında hata oluştu' });
    }
});

module.exports = router;
