
const express = require('express');
const Job = require('../models/Job');
const authMiddleware = require('../Middleware/authMiddleware');
const mongoose = require('mongoose')

const router = express.Router();


router.post('/', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });

  const { companyName, position, contract, location } = req.body;

  try {
    const newJob = new Job({ companyName, position, contract, location });
    await newJob.save();
    res.json(newJob);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});


router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});


router.post('/apply/:id', authMiddleware, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ msg: 'Job not found' });

  
    if (job.applicants.includes(req.user.id)) {
      return res.status(400).json({ msg: 'You have already applied to this job' });
    }

    job.applicants.push(req.user.id);
    await job.save();

    res.json({ msg: 'Applied successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});


router.delete("/:id", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ msg: "Access denied" });

  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: "Invalid job ID" });
  }

  try {
    const job = await Job.findById(id);
    if (!job) return res.status(404).json({ msg: "Job not found" });

    console.log("Found job:", job);
    await Job.deleteOne({ _id: id });
    res.json({ msg: "Job deleted successfully" });
  } catch (err) {
    console.log("Error in deleting job:", err);
    res.status(500).json({ msg: "Server error" });
  }
});


// router.get('/user/applied-jobs', authMiddleware, async (req, res) => {
//   try {
//     const jobs = await Job.find({ applicants: req.user.id });
//     res.json(jobs.map(job => job._id)); 
//   } catch (err) {
//     res.status(500).json({ msg: 'Server error' });
//   }
// });

module.exports = router;
