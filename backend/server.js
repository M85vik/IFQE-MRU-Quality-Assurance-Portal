// ifqe-portal-backend5/server.js

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();


const FRONTEND_URL= process.env.FRONTEND_URL
if(!FRONTEND_URL) throw new Error("Front URL Environment Varibale Not loaded.");

app.use(cors({ origin:[FRONTEND_URL] }));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('IFQE Portal API is running...');
});


app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/submissions', require('./routes/submissionRoutes'));
app.use('/api/files', require('./routes/fileRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/indicators', require('./routes/indicatorRoutes'));
app.use('/api/public', require('./routes/publicRoutes'));
app.use('/api/submission-windows', require('./routes/submissionWindowRoutes'));


app.use('/api/announcements', require('./routes/announcementRoutes'));
app.use('/api/activity', require('./routes/activityRoutes'));
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));