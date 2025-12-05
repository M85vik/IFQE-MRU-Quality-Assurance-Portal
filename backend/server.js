// ifqe-portal-backend5/server.js

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const apiMetricsMiddleware = require('./middleware/apiMetrics');
const reportRoutes = require("./routes/reportRoutes");

dotenv.config();
connectDB();


const app = express();


const FRONTEND_URL= process.env.FRONTEND_URL
if(!FRONTEND_URL) throw new Error("Front URL Environment Varibale Not loaded.");

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://ifqe-mru-qa-portal.netlify.app',
  'http://localhost:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  credentials: true // if sending cookies or auth headers
}));

app.use(express.json());

app.use(apiMetricsMiddleware); // 👈 Add here before routes
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

app.use('/api/dev', require('./routes/devRoutes'));
app.use('/api/metrics', require('./routes/metricsRoutes'));
app.use('/api/system', require('./routes/systemRoutes'));

app.use("/api/announcement-email",require("./routes/announcementEmailRoutes"));
app.use("/api/reports", reportRoutes);
app.use("/api/result-publication", require("./routes/resultPublicationRoutes"));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));