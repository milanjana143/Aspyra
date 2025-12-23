const mongoose = require(`mongoose`);   //User Schema

const userSchema = new mongoose.Schema({
    FullName: { type: String, required: true },
    Email: { type: String, required: true, unique: true },
    PhoneNo: { type: Number },
    Address: { type: String },
    Pincode: { type: Number },
    Password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'recruiter', 'jobseeker'], default: 'jobseeker' }
});

module.exports = mongoose.model("User",userSchema);