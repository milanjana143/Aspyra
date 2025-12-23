const mongoose = require(`mongoose`);   //Job Schema

const jobSchema = new mongoose.Schema({
    JobsName: { type: String, required: true},
    JobsType: { type: String, required: true},
    JobDesc: { type: String, required: true},
    Requirements: { type: String, required: true},
    Location: { type: String, required: true},
    Salary: { type: Number, required: true},
    CompanyName: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, default: 'Active' }
});

module.exports = mongoose.model("Job",jobSchema);