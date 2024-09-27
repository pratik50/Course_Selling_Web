const { Router } = require("express");
const adminRoute = Router();
const { adminModel } = require("../db");
const { courseModel } = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { adminMiddleware } = require("../middlewares/admin"); 
const { JWT_ADMIN_PASSWORD } = require("../config");
const saltRound = 5;

adminRoute.post("/signup", async function (req, res) {
    const { email, password, firstName, lastName } = req.body;

    const hashedPassword = await bcrypt.hash(password,saltRound);

    await adminModel.create({ 
        email:email,
        firstName: firstName,
        lastName: lastName,
        password: hashedPassword        
    });

    res.json({
        message: "SignUp successed",
    });
});

adminRoute.post("/signin", async function (req, res) {

    const { email, password,} = req.body;

    const admin = await adminModel.findOne({
        email: email,
    });

    if (!admin) {
        res.status(403).json({
            message: "User does not exits in the database",
        });
        return;
    }
    
    const MatchPassword = await bcrypt.compare(password,admin.password);
    
    if(MatchPassword){
        const token = jwt.sign({
            id: admin._id 
        },JWT_ADMIN_PASSWORD);

        res.json({
            token: token,
        });

    }else{
        res.status(403).json({
            message: "Incorrect Credentials"

        })
    }
});

adminRoute.post("/course", adminMiddleware, async function (req, res) {

    const adminId = req.userId;

    const { title, description, imageUrl, price } = req.body;

    const course = await courseModel.create({
      title: title,
      description: description,
      price: price,
      imageUrl: imageUrl,
      creatorId: adminId
    });
    
    res.json({
      message: "Course created",
      courseId : course._id
    });
});

adminRoute.put("/course", adminMiddleware, async function (req, res) {
    
    const adminId = req.userId;
    const { title, description, imageUrl, price, courseId } = req.body;

    const course = await courseModel.updateOne(
      {
        _id: courseId,
        creatorId: adminId,
      },
      {
        title: title,
        description: description,
        imageUrl: imageUrl,
        price: price,
      }
    );

    res.json({
      message: "Course updated",
      courseId: course._id,
    });

});


adminRoute.post("/course/bulk", adminMiddleware, async function (req, res) {
    const adminId = req.userId;

    const courses = await courseModel.find({
        creatorId: adminId 
    });

    res.json({
        message: "Course updated",
        courses
    })
});

module.exports = adminRoute



