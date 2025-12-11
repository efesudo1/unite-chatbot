const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');

// GET /api/activities - Get all activities
router.get('/', async (req, res) => {
    try {
        const { category, status } = req.query;

        let filter = {};
        if (category) filter.category = category;
        if (status) filter.status = status;
        else filter.status = { $in: ['Yaklaşan', 'Devam Ediyor'] }; // Default to upcoming/ongoing

        const activities = await Activity
            .find(filter)
            .sort({ date: 1 })
            .limit(50);

        res.json(activities);

    } catch (error) {
        console.error('Activities fetch error:', error);
        res.status(500).json({ error: 'Etkinlikler yüklenirken hata oluştu' });
    }
});

// GET /api/activities/:id - Get activity by ID
router.get('/:id', async (req, res) => {
    try {
        const activity = await Activity
            .findById(req.params.id)
            .populate('registeredStudents', 'name year department');

        if (!activity) {
            return res.status(404).json({ error: 'Etkinlik bulunamadı' });
        }

        res.json(activity);

    } catch (error) {
        console.error('Activity fetch error:', error);
        res.status(500).json({ error: 'Etkinlik yüklenirken hata oluştu' });
    }
});

// POST /api/activities/:id/register - Register for an activity
router.post('/:id/register', async (req, res) => {
    try {
        const { studentId } = req.body;

        const activity = await Activity.findById(req.params.id);
        if (!activity) {
            return res.status(404).json({ error: 'Etkinlik bulunamadı' });
        }

        // Check capacity
        if (activity.capacity && activity.registeredStudents.length >= activity.capacity) {
            return res.status(400).json({ error: 'Etkinlik kapasitesi dolu' });
        }

        // Check if already registered
        if (activity.registeredStudents.includes(studentId)) {
            return res.status(400).json({ error: 'Zaten kayıtlısınız' });
        }

        activity.registeredStudents.push(studentId);
        await activity.save();

        res.json({ message: 'Etkinliğe kaydoldunuz', activity });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Kayıt sırasında hata oluştu' });
    }
});

// GET /api/activities/upcoming/week - Get activities in the next week
router.get('/upcoming/week', async (req, res) => {
    try {
        const today = new Date();
        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

        const activities = await Activity.find({
            date: { $gte: today, $lte: nextWeek },
            status: 'Yaklaşan'
        }).sort({ date: 1 });

        res.json(activities);

    } catch (error) {
        console.error('Upcoming activities error:', error);
        res.status(500).json({ error: 'Yaklaşan etkinlikler yüklenirken hata oluştu' });
    }
});

// GET /api/activities/category/:category - Get activities by category
router.get('/category/:category', async (req, res) => {
    try {
        const { category } = req.params;

        const activities = await Activity.find({
            category,
            status: { $in: ['Yaklaşan', 'Devam Ediyor'] }
        }).sort({ date: 1 });

        res.json(activities);

    } catch (error) {
        console.error('Category activities error:', error);
        res.status(500).json({ error: 'Etkinlikler yüklenirken hata oluştu' });
    }
});

module.exports = router;
