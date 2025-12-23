const Company = require(`../modules/company`);

exports.createCompany = async(req,res) => {
    try{
        const company = await  Company.create(req.body);
        res.json(company);
    }
    catch(err){
        res.json(err);
    }
};

exports.getCompany = async(req,res) => {
    try{
        const company = await Company.find();
        res.json(company);
    }
    catch(err){
        res.json(err);
    }
};

exports.updateCompany = async(req,res) => {
    try{
        const company = await Company.findByIdAndUpdate(req.params.id,req.body,{new:true});
        res.json(company);
    }
    catch(err){
        res.json(err);
    }
};

exports.deleteCompany = async(req,res) => {
    try{
        await Company.findByIdAndDelete(req.params.id);
        res.json(`Company Deleted Successfully`);
    }
    catch(err){
        res.json(err);
    }
};