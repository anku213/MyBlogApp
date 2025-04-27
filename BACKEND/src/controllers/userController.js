const User = require('../models/userModel');
const multer = require('multer');

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('name email image');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        if (!name || !email) {
            return res.status(400).json({ message: 'Name and email are required' });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let imageUrl = user.image;
        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { name, email, image: imageUrl },
            { new: true, runValidators: true }
        ).select('name email image');

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
};


module.exports = { getProfile, updateProfile };