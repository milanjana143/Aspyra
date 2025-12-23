const Job = require(`../modules/job`);

exports.createJob = async(req,res) => {
    try {
        console.log('Create job payload:', req.body);
        // If authorization token is provided, try to extract user id to set createdBy
        try {
            const authHeader = req.headers.authorization || '';
            if (authHeader.startsWith('Bearer ')) {
                const token = authHeader.split(' ')[1];
                const jwt = require('jsonwebtoken');
                const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
                const decoded = jwt.verify(token, JWT_SECRET);
                if (decoded && decoded.id) {
                    req.body.createdBy = decoded.id;
                }
            }
        } catch (e) {
            console.warn('Could not set createdBy from token:', e.message || e);
        }

        const job = await Job.create(req.body);
        return res.status(201).json(job);
    } catch(err) {
        console.error('Create job error:', err);
        const message = err && err.message ? err.message : 'Failed to create job';
        return res.status(400).json({ error: message });
    }
};

exports.getJob = async(req,res) => {
    try {
        // If requester is a recruiter, only return jobs created by them.
        try {
            const authHeader = req.headers.authorization || '';
            if (authHeader.startsWith('Bearer ')) {
                const token = authHeader.split(' ')[1];
                const jwt = require('jsonwebtoken');
                const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
                const decoded = jwt.verify(token, JWT_SECRET);
                if (decoded && decoded.role === 'recruiter' && decoded.id) {
                    const jobs = await Job.find({ createdBy: decoded.id });
                    return res.json(jobs);
                }
            }
        } catch (e) {
            console.warn('Could not evaluate requester role for getJob:', e.message || e);
        }
        // default: return all jobs (admin and jobseekers)
        const job = await Job.find();
        res.json(job);
    } catch(err) {
        res.json(err);
    }
};

exports.updateJob= async(req,res) => {
    try {
        const job = await Job.findByIdAndUpdate(req.params.id,req.body,{new:true});
        res.json(job);
    } catch(err) {
        res.json(err);
    }
};

exports.deletejob = async(req,res) => {
    try {
        await Job.findByIdAndDelete(req.params.id);
        res.json({message: "Job Deleted Succesfully"});
    } catch(err) {
        res.json(err);
    }
};