const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Course = require('../models/Course');

// GET /api/students - Get all students (limited info for privacy)
router.get('/', async (req, res) => {
    try {
        const { year, department } = req.query;

        let filter = {};
        if (year) filter.year = parseInt(year);
        if (department) filter.department = department;

        const students = await Student
            .find(filter)
            .select('name year department interests clubs matchingPreferences')
            .limit(50);

        res.json(students);

    } catch (error) {
        console.error('Students fetch error:', error);
        res.status(500).json({ error: 'Öğrenciler yüklenirken hata oluştu' });
    }
});

// GET /api/students/:id - Get student profile
router.get('/:id', async (req, res) => {
    try {
        const student = await Student
            .findById(req.params.id)
            .populate('completedCourses.course', 'code name')
            .populate('currentCourses', 'code name semester')
            .populate('matches.student', 'name year department');

        if (!student) {
            return res.status(404).json({ error: 'Öğrenci bulunamadı' });
        }

        res.json(student);

    } catch (error) {
        console.error('Student fetch error:', error);
        res.status(500).json({ error: 'Öğrenci profili yüklenirken hata oluştu' });
    }
});

// POST /api/students/match - Find matching students
router.post('/match', async (req, res) => {
    try {
        const { studentId, criteria } = req.body;

        const currentStudent = await Student.findById(studentId)
            .populate('completedCourses.course')
            .populate('currentCourses');

        if (!currentStudent) {
            return res.status(404).json({ error: 'Öğrenci bulunamadı' });
        }

        // Find students who have completed courses that current student is taking
        const currentCourseIds = currentStudent.currentCourses.map(c => c._id);

        const matches = await Student.find({
            _id: { $ne: studentId },
            'completedCourses.course': { $in: currentCourseIds },
            'matchingPreferences.willingToMentor': true
        })
            .populate('completedCourses.course', 'code name')
            .select('name year department completedCourses matchingPreferences')
            .limit(10);

        // Calculate match reasons
        const matchesWithReasons = matches.map(match => {
            const commonCourses = match.completedCourses
                .filter(cc => currentCourseIds.some(id => id.equals(cc.course._id)))
                .map(cc => cc.course.name);

            return {
                student: match,
                reason: `${commonCourses.slice(0, 3).join(', ')} derslerini almış${match.completedCourses.find(cc => cc.hasNotes) ? ' ve notu var' : ''}`,
                commonCourses: commonCourses.length
            };
        });

        // Sort by number of common courses
        matchesWithReasons.sort((a, b) => b.commonCourses - a.commonCourses);

        res.json(matchesWithReasons);

    } catch (error) {
        console.error('Matching error:', error);
        res.status(500).json({ error: 'Eşleştirme sırasında hata oluştu' });
    }
});

// POST /api/students/:id/courses - Update student courses
router.post('/:id/courses', async (req, res) => {
    try {
        const { completedCourses, currentCourses } = req.body;

        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ error: 'Öğrenci bulunamadı' });
        }

        if (completedCourses) student.completedCourses = completedCourses;
        if (currentCourses) student.currentCourses = currentCourses;

        await student.save();

        res.json({ message: 'Dersler güncellendi', student });

    } catch (error) {
        console.error('Course update error:', error);
        res.status(500).json({ error: 'Dersler güncellenirken hata oluştu' });
    }
});

module.exports = router;
