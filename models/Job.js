
const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  position: { type: String, required: true },
  contract: { type: String, required: true },
  location: { type: String, required: true },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] 
});

module.exports = mongoose.model('Job', JobSchema);
