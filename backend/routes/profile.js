const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const AlumniProfile = require('../models/AlumniProfile');
const InstitutionProfile = require('../models/InstitutionProfile');
const StudentProfile = require('../models/StudentProfile');
const User = require('../models/User');
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get user profile
router.get('/', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let profile = null;
    if (user.role === 'alumni') {
      profile = await AlumniProfile.findOne({ user: req.userId }).populate('user', 'name email role');
    } else if (user.role === 'institution') {
      profile = await InstitutionProfile.findOne({ user: req.userId }).populate('user', 'name email role');
    } else if (user.role === 'student') {
      profile = await StudentProfile.findOne({ user: req.userId }).populate('user', 'name email role');
    }

    res.json({ profile, role: user.role });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create or update alumni profile
router.post('/alumni', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'alumni') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const {
      collegeName,
      graduationYear,
      currentCompany,
      department,
      industry,
      location,
      skills,
      availableForMentorship,
      availableForDonation,
      linkedin,
      profilePicture
    } = req.body;

    const institution = await InstitutionProfile.findOne({ name: collegeName });
    if (!institution) {
      return res.status(400).json({ message: 'Institution not found. Please enter a valid college name.' });
    }

    let profile = await AlumniProfile.findOne({ user: req.userId });

    if (profile) {
      // Update existing
      Object.assign(profile, {
        collegeName,
        graduationYear,
        currentCompany,
        department,
        industry,
        location,
        skills,
        availableForMentorship,
        availableForDonation,
        linkedin,
        profilePicture: profilePicture || profile.profilePicture,
        verificationStatus: 'pending' // Reset to pending on update
      });
    } else {
      // Create new
      profile = new AlumniProfile({
        user: req.userId,
        collegeName,
        graduationYear,
        currentCompany,
        department,
        industry,
        location,
        skills,
        availableForMentorship,
        availableForDonation,
        linkedin,
        profilePicture: profilePicture || 'https://via.placeholder.com/150',
        verificationStatus: 'pending'
      });
    }

    await profile.save();

    // TODO: Send verification notification to institution
    // Find institution based on collegeName and send email or in-app notification

    res.json({ message: 'Profile updated successfully', profile });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create or update institution profile
router.post('/institution', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'institution') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const {
      institutionId,
      name,
      address,
      departments,
      contactEmail,
      events,
      profilePicture
    } = req.body;

    let profile = await InstitutionProfile.findOne({ user: req.userId });

    if (profile) {
      // Update existing
      Object.assign(profile, {
        institutionId,
        name,
        address,
        departments,
        contactEmail,
        events,
        profilePicture: profilePicture || profile.profilePicture
      });
    } else {
      // Create new
      profile = new InstitutionProfile({
        user: req.userId,
        institutionId,
        name,
        address,
        departments,
        contactEmail,
        events,
        profilePicture: profilePicture || 'https://via.placeholder.com/150'
      });
    }

    await profile.save();

    res.json({ message: 'Profile updated successfully', profile });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get pending alumni for institution
router.get('/institution/pending-alumni', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'institution') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const institutionProfile = await InstitutionProfile.findOne({ user: req.userId });
    if (!institutionProfile) {
      return res.status(404).json({ message: 'Institution profile not found' });
    }

    const pendingAlumni = await AlumniProfile.find({
      collegeName: institutionProfile.name,
      verificationStatus: 'pending'
    }).populate('user', 'name email');

    res.json({ pendingAlumni });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get approved alumni for institution
router.get('/institution/approved-alumni', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'institution') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const institutionProfile = await InstitutionProfile.findOne({ user: req.userId });
    if (!institutionProfile) {
      return res.status(404).json({ message: 'Institution profile not found' });
    }

    const approvedAlumni = await AlumniProfile.find({
      collegeName: institutionProfile.name,
      verificationStatus: 'verified'
    }).populate('user', 'name email');

    res.json({ approvedAlumni });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve or reject alumni
router.post('/institution/verify-alumni/:alumniId', verifyToken, async (req, res) => {
  try {
    const { action } = req.body; // 'approve' or 'reject'
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'institution') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const institutionProfile = await InstitutionProfile.findOne({ user: req.userId });
    if (!institutionProfile) {
      return res.status(404).json({ message: 'Institution profile not found' });
    }

    const alumniProfile = await AlumniProfile.findById(req.params.alumniId);
    if (!alumniProfile) {
      return res.status(404).json({ message: 'Alumni profile not found' });
    }

    if (alumniProfile.collegeName !== institutionProfile.name) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (action === 'approve') {
      alumniProfile.verificationStatus = 'verified';
    } else if (action === 'reject') {
      alumniProfile.verificationStatus = 'rejected';
    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }

    await alumniProfile.save();

    res.json({ message: `Alumni ${action}d successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create or update student profile
router.post('/student', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'student') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const {
      institutionName,
      name,
      email,
      batch,
      department,
      skills,
      interests,
      location,
      mentorPreferences,
      profilePicture
    } = req.body;

    // Check if institution exists
    const institution = await InstitutionProfile.findOne({ name: institutionName });
    if (!institution) {
      return res.status(400).json({ message: 'Institution not found. Please enter a valid institution name.' });
    }

    let profile = await StudentProfile.findOne({ user: req.userId });

    if (profile) {
      // Update existing
      Object.assign(profile, {
        institutionName,
        name,
        email,
        batch,
        department,
        skills,
        interests,
        location,
        mentorPreferences,
        profilePicture: profilePicture || profile.profilePicture,
        verificationStatus: 'pending' // Reset to pending on update
      });
    } else {
      // Create new
      profile = new StudentProfile({
        user: req.userId,
        institutionName,
        name,
        email,
        batch,
        department,
        skills,
        interests,
        location,
        mentorPreferences,
        profilePicture: profilePicture || 'https://via.placeholder.com/150',
        verificationStatus: 'pending'
      });
    }

    await profile.save();

    res.json({ message: 'Profile updated successfully', profile });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get pending students for institution
router.get('/institution/pending-students', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'institution') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const institutionProfile = await InstitutionProfile.findOne({ user: req.userId });
    if (!institutionProfile) {
      return res.status(404).json({ message: 'Institution profile not found' });
    }

    const pendingStudents = await StudentProfile.find({
      institutionName: institutionProfile.name,
      verificationStatus: 'pending'
    }).populate('user', 'name email');

    res.json({ pendingStudents });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get approved students for institution
router.get('/institution/approved-students', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'institution') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const approvedStudents = await StudentProfile.find({
      institutionName: institutionProfile.name,
      verificationStatus: 'verified'
    }).populate('user', 'name email');

    res.json({ approvedStudents });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve or reject student
router.post('/institution/verify-student/:studentId', verifyToken, async (req, res) => {
  try {
    const { action } = req.body; // 'approve' or 'reject'
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'institution') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const studentProfile = await StudentProfile.findById(req.params.studentId);
    if (!studentProfile) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    if (action === 'approve') {
      studentProfile.verificationStatus = 'verified';
    } else if (action === 'reject') {
      studentProfile.verificationStatus = 'rejected';
    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }

    await studentProfile.save();

    res.json({ message: `Student ${action}d successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;