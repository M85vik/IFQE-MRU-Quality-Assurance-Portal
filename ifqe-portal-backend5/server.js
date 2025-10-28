// ifqe-portal-backend5/server.js

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
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

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));