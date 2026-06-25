const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware (ഫോട്ടോകൾ വലിയ ഡാറ്റ ആയതിനാൽ limit കൂട്ടി നൽകുന്നു)
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

if (MONGODB_URI) {
    mongoose.connect(MONGODB_URI)
        .then(() => console.log('MongoDB Connected successfully'))
        .catch(err => console.log('MongoDB Connection Error:', err));
}

// ഡാറ്റാബേസിൽ കുട്ടികളുടെ വിവരങ്ങൾ എങ്ങനെ സേവ് ചെയ്യണം എന്നുള്ള ഘടന (Schema)
const studentSchema = new mongoose.Schema({
    admn: String,
    name: String,
    cls: String,
    gender: String,
    guardian: String,
    house: String,
    place: String,
    mobile: String,
    photo: String
});

const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);

// API Routes
app.get('/api', (req, res) => {
    res.send('Vercel API is running perfectly!');
});

// കുട്ടികളുടെ വിവരങ്ങൾ എടുക്കാൻ
app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find({});
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: 'ഡാറ്റ എടുക്കാൻ സാധിച്ചില്ല' });
    }
});

// പുതിയ കുട്ടിയുടെ വിവരം സേവ് ചെയ്യാൻ
app.post('/api/students', async (req, res) => {
    try {
        const newStudent = new Student(req.body);
        await newStudent.save();
        res.json({ message: 'വിവരങ്ങൾ വിജയകരമായി സേവ് ചെയ്തു!' });
    } catch (error) {
        res.status(500).json({ error: 'സേവ് ചെയ്യാൻ സാധിച്ചില്ല' });
    }
});

// Vercel-ന് വേണ്ടി എക്സ്പോർട്ട് ചെയ്യുന്നു
module.exports = app;