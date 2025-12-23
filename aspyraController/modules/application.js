const mongoose = require(`mongoose`); //application Schema

const applicationSchema = new mongoose.Schema({
    JobTitle: { type: String, required: true},
    CandidateName: { type: String, required: true},
    Resume: { type: String, required: true},
    Status : { type: String, required: true},
    AppliedDate: { type: String, required: true},
    UpdatedDate: { type: String, required: true},
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model("Application",applicationSchema);