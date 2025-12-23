const userSchema = require(`../modules/user`);

exports.createUser = async(req,res) =>{
    try{
        const user = await userSchema.create(req.body);
        res.json(user);
    }
    catch(err){
        res.json(err);
    }
};

exports.getuser = async(req,res) => {
    try{
        const user = await userSchema.find();
        res.json(user);
    }
    catch(err){
        res.json(err);
    }
};

exports.updateUser = async(req,res) => {
    try{
        const user = await userSchema.findByIdAndUpdate(req.params.id,req.body,{new:true});
        res.json(user);
    }
    catch(err){
        res.json(err);
    }
};

exports.deleteUser = async(req,res) => {
    try{
        await userSchema.findByIdAndDelete(req.params.id);
        res.json("User Deleted Successfully");
    }
    catch(err){
        res.json(err);
    }
};

