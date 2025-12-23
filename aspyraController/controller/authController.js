const User = require('../modules/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

exports.register = async (req, res) => {
  try {
    const { FullName, Email, Password, PhoneNo, Address, Pincode, role } = req.body;
    if (!FullName || !Email || !Password) {
      return res.status(400).json({ error: 'FullName, Email and Password are required' });
    }

    const existing = await User.findOne({ Email });
    if (existing) return res.status(400).json({ error: 'Email already registered' });

    // Only allow registering as 'recruiter' or default to 'jobseeker'. Do not allow admin via public registration.
    const assignRole = role === 'recruiter' ? 'recruiter' : 'jobseeker';

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(Password, salt);

    const user = await User.create({ FullName, Email, Password: hashed, PhoneNo, Address, Pincode, role: assignRole });

    const token = jwt.sign({ id: user._id, email: user.Email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    return res.status(201).json({ token, user: { id: user._id, FullName: user.FullName, Email: user.Email, role: user.role } });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  try {
    const { Email, Password } = req.body;
    if (!Email || !Password) return res.status(400).json({ error: 'Email and Password required' });

    const user = await User.findOne({ Email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(Password, user.Password);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, email: user.Email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, user: { id: user._id, FullName: user.FullName, Email: user.Email, role: user.role } });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Login failed' });
  }
};
