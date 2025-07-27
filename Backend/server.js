import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';                   // Import cors
import connectDB from './database/database.js';


import employeeRoutes from './routes/employeeAdd.route.js';
import employeeLeaveRoutes from './routes/leaves.route.js'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS (allow requests from any origin - good for development)
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB Atlas
connectDB();

// Routes
app.use('/api/employees', employeeRoutes);
app.use('/api/leaves', employeeLeaveRoutes);

// Serve React frontend
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'client/build')));


app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});


// Basic route
app.get('/', (req, res) => {
  res.send('Backend connected to MongoDB Atlas!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
