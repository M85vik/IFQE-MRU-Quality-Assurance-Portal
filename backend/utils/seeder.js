const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');

const Indicator = require('../models/Indicator');
const School = require('../models/School');
const Department = require('../models/Department');
const User = require('../models/User');
const Submission = require('../models/Submission');
const SubmissionWindow = require('../models/SubmissionWindow');

const indicators = require('../data/indicators');

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Indicator.deleteMany();
    await School.deleteMany();
    await Department.deleteMany();
    await User.deleteMany();
    await Submission.deleteMany();
    await SubmissionWindow.deleteMany();

    await Indicator.insertMany(indicators);
    console.log('Indicators Imported...');

    // Create the full list of 5 schools and 8 departments
    const schoolEng = await School.create({ name: 'School of Engineering' });
    const schoolLaw = await School.create({ name: 'School of Law' });
    const schoolManagement = await School.create({ name: 'School of Business' });
    const schoolEducation = await School.create({ name: 'School of Education & Humanities' });
    const schoolSciences = await School.create({ name: 'School of Sciences' });
    console.log('All 5 Schools Imported...');
    
    // Departments for School of Engineering
    const csDept = await Department.create({ name: 'Computer Science & Technology', school: schoolEng._id });
    await Department.create({ name: 'Mechanical Engineering', school: schoolEng._id });
    await Department.create({ name: 'Electronics & Communication', school: schoolEng._id });

    // Departments for School of Law
    await Department.create({ name: 'Corporate Law', school: schoolLaw._id });

    // Departments for School of Management & Commerce
    await Department.create({ name: 'Business', school: schoolManagement._id });
    
    // Departments for School of Education & Humanities
    await Department.create({ name: 'Education & Humanities', school: schoolEducation._id });

    // Department for School of Sciences
    await Department.create({ name: 'Sciences', school: schoolSciences._id });
    console.log('All 8 Departments Imported...');

    const deptUser = await User.create({
        name: 'Test Department User',
        email: 'department@test.com',
        password: '123456',
        role: 'department',
        school: schoolEng._id,
        department: csDept._id,
    });

    await User.create({
        name: 'Test QAA User',
        email: 'qaa@test.com',
        password: '123456',
        role: 'qaa',
    });

    await User.create({
        name: 'Test Admin User',
        email: 'admin@test.com',
        password: '123456',
        role: 'admin',
    });
    
    await User.create({
        name: 'Test Superuser',
        email: 'superuser@test.com',
        password: '123456',
        role: 'superuser',
    });

    await User.create({
        name: 'Test Developer',
        email: 'developer@test.com',
        password: '123456',
        role: 'developer',
    });
    
    console.log('Default Users Created...');

    // Seed a default draft submission for the Test Department User so they can see the criteria
    const allIndicators = await Indicator.find({}).sort('indicatorCode');
    const criteriaTitles = {
        "1": "ACADEMIC EXCELLENCE & PEDAGOGY",
        "2": "RESEARCH, INNOVATION & IMPACT",
        "3": "STUDENT LIFECYCLE & ENGAGEMENT",
        "4": "FACULTY DEVELOPMENT AND DIVERSITY",
        "5": "INSTITUTIONAL GOVERNANCE & STRATEGIC VISION",
        "6": "GLOBAL ENGAGEMENT & COLLABORATIONS",
        "7": "STAKEHOLDER INSIGHTS & CONTINUOUS IMPROVEMENT",
    };
    const subCriteriaTitles = {
        "1.1": "CURRICULUM DESIGN", "1.2": "PEDAGOGICAL INNOVATION", "1.3": "DIGITIZATION", "1.4": "CONTINUOUS ASSESSMENT METHODOLOGY", "1.5": "PERFORMANCE AND EVALUATION ANALYSIS", "1.6": "ATTAINMENT OF COURSE OUTCOMES",
        "2.1": "RESEARCH PUBLICATIONS", "2.2": "PATENTS", "2.3": "RESEARCH GRANTS/PROJECTS", "2.4": "CONSULTANCY AND MDPS", "2.5": "START-UPS", "2.6": "RESEARCH INFRASTRUCTURE", "2.7": "INTERDISCIPLINARY RESEARCH", "2.8": "PH.D. PROGRAM",
        "3.1": "ADMISSION", "3.2": "INDUCTION PROGRAM FOR STUDENTS", "3.3": "IMPLEMENTATION OF MENTOR-MENTEE", "3.4": "TRAINING/WORKSHOPS/SEMINARS", "3.5": "STUDENT CLUBS", "3.6": "INDUSTRY INTERACTION", "3.7": "PLACEMENTS & PROGRESSION", "3.8": "INTERNSHIPS", "3.9": "STUDENT CONTRIBUTION", "3.10": "ALUMNI CONTRIBUTION",
        "4.1": "FACULTY STRENGTH & QUALITY", "4.2": "FACULTY CONTRIBUTION",
        "5.1": "INSTITUTIONAL GOVERNANCE & STRATEGIC VISION",
        "6.1": "MOU'S (MEMORANDUM OF UNDERSTANDING)", "6.2": "EXCHANGE PROGRAMS", "6.3": "INTERNATIONAL COLLABORATIONS", "6.4": "ENGAGEMENT IN GLOBAL ACADEMIC PLATFORMS", "6.5": "SEMINARS/LECTURES BY INTERNATIONAL SPEAKERS",
        "7.1": "NET PROMOTER SCORE",
    };

    const criteriaMap = new Map();
    allIndicators.forEach(indicator => {
        if (!criteriaMap.has(indicator.criterionCode)) {
            criteriaMap.set(indicator.criterionCode, {
                criteriaCode: indicator.criterionCode,
                title: criteriaTitles[indicator.criterionCode] || `Criterion ${indicator.criterionCode}`,
                subCriteria: new Map(),
            });
        }
        const criterion = criteriaMap.get(indicator.criterionCode);
        if (!criterion.subCriteria.has(indicator.subCriterionCode)) {
            criterion.subCriteria.set(indicator.subCriterionCode, {
                subCriteriaCode: indicator.subCriterionCode,
                title: subCriteriaTitles[indicator.subCriterionCode] || `Sub-Criterion ${indicator.subCriterionCode}`,
                indicators: [],
            });
        }
        const subCriterion = criterion.subCriteria.get(indicator.subCriterionCode);
        subCriterion.indicators.push({
            indicatorCode: indicator.indicatorCode,
            title: indicator.title,
            fileKey: null,
            evidenceFileKeys: [],
        });
    });

    const finalPartB = Array.from(criteriaMap.values()).map(crit => ({
        ...crit,
        subCriteria: Array.from(crit.subCriteria.values()),
    }));

    const partAItems = [
        { code: "1", title: "About the University (Word limit: 350-500 words)" },
        { code: "2", title: "About the School (Word limit: 350 - 500 words)" },
        { code: "3", title: "Vision: School vision statement" },
        { code: "4", title: "Mission: School mission statement" },
        { code: "5", title: "Alignment of School Vision Mission with University (300 - 500 words)" },
        { code: "6", title: "SWOC Analysis (Detailed description)" },
        { code: "7", title: "Strategic Plan (CAY) (Goals & Roadmap - Execution details)" },
        { code: "8", title: "Best practices" },
    ];

    await Submission.create({
        title: 'IFQE Submission: 2024-2025',
        submissionType: 'Annual',
        submittedBy: deptUser._id,
        department: csDept._id,
        school: schoolEng._id,
        academicYear: '2024-2025',
        partA: { items: partAItems.map(item => ({ ...item, fileKey: null })) },
        partB: { criteria: finalPartB },
        status: 'Draft'
    });
    console.log('Default Draft Submission Created...');

    // Seed Submission and Appeal Windows for academic years
    const years = ['2024-2025', '2025-2026', '2026-2027', '2027-2028'];
    for (const year of years) {
        await SubmissionWindow.create({
            academicYear: year,
            startDate: new Date('2024-01-01T00:00:00Z'),
            endDate: new Date('2028-12-31T23:59:59Z'),
            windowType: 'Submission'
        });
        await SubmissionWindow.create({
            academicYear: year,
            startDate: new Date('2024-01-01T00:00:00Z'),
            endDate: new Date('2028-12-31T23:59:59Z'),
            windowType: 'Appeal'
        });
    }
    console.log('Submission and Appeal Windows Seeded...');

    console.log('Data Imported Successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Indicator.deleteMany();
    await School.deleteMany();
    await Department.deleteMany();
    await User.deleteMany();
    await Submission.deleteMany();
    await SubmissionWindow.deleteMany();
    
    console.log('Data Destroyed!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}