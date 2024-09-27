const { Router } = require("express");
const userRoutes = Router();
const bcrypt = require("bcrypt");
const saltRound = 5;
const jwt = require("jsonwebtoken");
const { JWT_USER_PASSWORD } = require("../config");
const { userModel } = require("../db"); 

userRoutes.post("/signup",async function (req, res) {

    const { email, password, firstName, lastName } = req.body;

    const hashedPassword = await bcrypt.hash(password,saltRound);

    await userModel.create({ 
        email:email,
        firstName: firstName,
        lastName: lastName,
        password: hashedPassword        
    });

    res.json({
        message: "SignUp successed",
    });
});

userRoutes.post("/signin", async function (req, res) {

    const { email, password,} = req.body;

    const user = await userModel.findOne({
        email: email,
    });

    if (!user) {
        res.status(403).json({
            message: "User does not exits in the database",
        });
        return;
    }
    
    const MatchPassword = await bcrypt.compare(password,user.password);
    
    if(MatchPassword){
        const token = jwt.sign({
            id: user._id 
        },JWT_USER_PASSWORD);

        res.json({
            token: token,
        });

    }else{
        res.status(403).json({
            message: "Incorrect Credentials"
        })
    }
});


module.exports = userRoutes
