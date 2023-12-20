const Employee = require('../models/Employee');
const jwt = require('jsonwebtoken');

exports.isAuthenticated = async(req, res, next) => {
    try{
        const { token } = req.cookies;

        if(!token){
            return res.status(401).json({
                message: "Unauthorized access"
            });
        }
    
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    
        req.employee = await Employee.findById(decoded._id);
    
        next();
    } catch(err) {
        res.status(500).json({
            success: false,
            message: err.message,
            message2: "auth middleware error"
        });
    }
}