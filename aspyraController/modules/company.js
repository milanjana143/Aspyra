const mongoose = require(`mongoose`);   //Company Schema

const companySchema = new mongoose.Schema({
    CompanyName: { type: String, required: true},
    RegistrationNo: { type: String, required: true, unique: true},
    CompanyType: { type: String, required: true},
    CompanyNature: { type: String, required: true},
    CompanyAddress: { type: String, required: true},
    ContactNo: { type: Number, required: true},
    Email: { type: String, required: true},
});

module.exports = mongoose.model("Company",companySchema);