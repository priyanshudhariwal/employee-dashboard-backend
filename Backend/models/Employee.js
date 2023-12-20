const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,"Please enter a name"]
    },
    username: {
        type: String,
        required: [true, "Please enter a valid username"],
        unique: [true, "Username already exists"]
    },
    email: {
        type: String,
        required: [true, "Please enter an email"],
        unique: [true, "Email already exists"]
    },
    password: {
        type: String,
        required: [true, "Please enter a password"],
        select: false
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }]
});

employeeSchema.pre('save', async function(next) {
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

employeeSchema.methods.matchPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

employeeSchema.methods.generateToken = function() {
    return jwt.sign({_id: this._id}, process.env.JWT_SECRET);
}

module.exports = mongoose.model('Employee', employeeSchema);