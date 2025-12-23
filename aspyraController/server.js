const express = require(`express`);
const cors = require(`cors`);
const dotenv = require(`dotenv`);
const connectdb = require(`./config/db`);
const jobsroute = require(`./routes/jobRoutes`);
const userroute = require(`./routes/userRoutes`);
const companyroute = require(`./routes/companyRoutes`);
const applicationroute = require(`./routes/applicationRoutes`);
const authroute = require(`./routes/authRoutes`);

const app = express();
dotenv.config();
connectdb();

app.use(express.json());
app.use(cors());

const port = process.env.PORT || 6677;
app.listen(port,() => {
    console.log(`Server is running at port ${port}`);
});

app.get("/",(req,res) => {
    res.send(`Welcome`);
});

app.use("/api/job", jobsroute);
app.use("/api/user",userroute);
app.use("/api/company",companyroute);
app.use("/api/application",applicationroute);
app.use('/api/auth', authroute);