require('dotenv').config();
const express       = require('express');
const cors          = require('cors');
const cookieParser  = require('cookie-parser');
const connectDB     = require('./config/db');
const authRoutes    = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes    = require('./routes/taskRoutes');
const adminRoutes   = require('./routes/adminRoutes');

connectDB();

const app = express();

app.use(cors({
  origin:      process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth',     authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/projects', taskRoutes);
app.use('/api/tasks',    taskRoutes);
app.use('/api/admin',    adminRoutes);

app.get('/', (req, res) => res.send('API is running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));