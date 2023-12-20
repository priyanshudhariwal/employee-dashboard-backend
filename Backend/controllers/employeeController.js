const Employee = require('../models/Employee');

exports.registerEmployee = async(req, res) => {
    try {
        const {name, username, email, password} = req.body;

        let unEmail = await Employee.findOne({ email });
        if(unEmail){
            return res.status(400).json({
                success: false,
                message: "email already exists"
            });
        }
        let unUsername = await Employee.findOne({ username });
        if(unUsername){
            return res.status(400).json({
                success: false,
                message: "username already exists"
            });
        }

        const employee = await Employee.create({name, username, email, password});

        const token = await employee.generateToken();

        const options = {
            expires: new Date(Date.now() + 3*60*60*1000),
            httpOnly: true
        }

        res.status(201).cookie("token", token, options).json({
            success: true,
            message: "registration successful",
            employee,
            token
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

exports.loginEmployee = async(req, res) => {
    try {
        const { email, password } = req.body;
        const employee = await Employee.findOne({ email }).select('+password');
        if(!employee){
            return res.status(400).json({
                success: false,
                message: "email does not exist"
            });
        }
        const isMatch = await employee.matchPassword(password);

        if(!isMatch){
            return res.status(400).json({
                success: false,
                message: "incorrect password"
            });
        }

        const token = await employee.generateToken();

        const options = {
            expires: new Date(Date.now() + 3*60*60*1000),
            httpOnly: true
        }

        res.status(200).cookie("token", token, options).json({
            success: true,
            employee,
            token
        });

    } catch(err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

exports.logoutEmployee = async(req, res) => {
    try {
        const options = {
            expires: new Date(Date.now()),
            httpOnly: true
        }

        res.status(200).cookie('token', null, options).json({
            success: true,
            message: "Logged out successfully"
        });

    } catch(err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

exports.getEmployeeProfile = async(req, res) => {
    try {
        const employee = await Employee.findById(req.params.id).populate('posts');

        if(!employee){
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        res.status(200).json({
            success: true,
            employee
        });
    } catch(err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}