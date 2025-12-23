const Application = require(`../modules/application`);
const Job = require(`../modules/job`);
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

exports.createApplication = async(req,res) => {
    try{
        // try to set createdBy from token if available
        try {
            const authHeader = req.headers.authorization || '';
            if (authHeader.startsWith('Bearer ')) {
                const token = authHeader.split(' ')[1];
                const decoded = jwt.verify(token, JWT_SECRET);
                if (decoded && decoded.id) {
                    req.body.createdBy = decoded.id;
                }
            }
        } catch (e) {
            console.warn('Could not set application createdBy from token:', e.message || e);
        }

        const application = await Application.create(req.body);
        res.json(application);
    }
    catch(err){
        res.json(err);
    }
};

exports.getApplication = async(req,res) =>{
    try{
        // Determine requester role and id from token (if provided)
        const authHeader = req.headers.authorization || '';
        let requester = null;
        try {
            if (authHeader.startsWith('Bearer ')) {
                const token = authHeader.split(' ')[1];
                const decoded = jwt.verify(token, JWT_SECRET);
                requester = decoded;
            }
        } catch (e) {
            // ignore token errors; treat as anonymous
            requester = null;
        }

        let applications = [];

        if (requester && requester.role === 'recruiter' && requester.id) {
            // recruiter: return only applications for jobs owned by this recruiter
            const ownedJobs = await Job.find({ createdBy: requester.id });
            const titles = ownedJobs.map(j => j.JobsName).filter(Boolean);
            if (titles.length === 0) {
                applications = [];
            } else {
                applications = await Application.find({ JobTitle: { $in: titles } });
            }
        } else if (requester && requester.role === 'jobseeker' && requester.id) {
            // jobseeker: return only applications created by this user
            applications = await Application.find({ createdBy: requester.id });
        } else {
            // admin or anonymous: return all applications
            applications = await Application.find();
        }

        // normalize returned objects to include lowercase `status` for frontend convenience
        const mapped = applications.map(a => ({
            id: a._id,
            JobTitle: a.JobTitle,
            CandidateName: a.CandidateName,
            Resume: a.Resume,
            Status: a.Status,
            status: (a.Status || '').toLowerCase(),
            AppliedDate: a.AppliedDate,
            UpdatedDate: a.UpdatedDate,
            createdBy: a.createdBy
        }));
        return res.json(mapped);
    }
    catch(err){
        res.json(err);
    }
};

exports.updateApplication = async(req,res) => {
    try{
        // If attempting to update Status, enforce that only the recruiter who owns the related job can change it
        if (req.body && (req.body.Status || req.body.status)) {
            // get status value
            const newStatus = req.body.Status || req.body.status;
            // verify requester token
            try {
                const authHeader = req.headers.authorization || '';
                if (!authHeader.startsWith('Bearer ')) {
                    return res.status(403).json({ error: 'Authorization required to change application status' });
                }
                const token = authHeader.split(' ')[1];
                const decoded = jwt.verify(token, JWT_SECRET);
                if (!decoded || !decoded.id) return res.status(403).json({ error: 'Invalid token' });

                // find the application and associated job (by JobTitle)
                const app = await Application.findById(req.params.id);
                if (!app) return res.status(404).json({ error: 'Application not found' });

                // try to find the job by its title
                const job = await Job.findOne({ JobsName: app.JobTitle });
                // If job found, ensure requester is the job owner or is admin
                if (job) {
                    const ownerId = job.createdBy ? String(job.createdBy) : null;
                    if (String(decoded.id) !== ownerId && decoded.role !== 'admin') {
                        return res.status(403).json({ error: 'Only the job owner or admin can change application status' });
                    }
                } else {
                    // if job not found, only admin can change
                    if (decoded.role !== 'admin') {
                        return res.status(403).json({ error: 'Only admin can change application status for this application' });
                    }
                }

                // allow status change
                req.body.Status = newStatus;
            } catch (e) {
                return res.status(403).json({ error: 'Invalid authorization' });
            }
        }

        const application = await Application.findByIdAndUpdate(req.params.id,req.body,{new:true});
        res.json(application);
    }
    catch(err){
        res.json(err);
    }
};

exports.deleteApplication = async(req,res) => {
    try{
        await Application.findByIdAndDelete(req.params.id);
        res.json({message:"Application deleted successfully"});
    }
    catch(err){
        res.json(err);
    }
};