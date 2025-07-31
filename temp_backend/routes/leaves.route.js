// routes/leave.js
import express from 'express';
import { applyLeave, getLeavesByEmployee } from '../controllers/employeeLeave.controllers.js'

const router = express.Router();

// Route to apply for leave
router.post('/apply', applyLeave);
router.get('/getLeave', getLeavesByEmployee)

export default router;
