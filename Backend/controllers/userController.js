const mongoose = require("mongoose");
const User = mongoose.model("User");
const Profile = mongoose.model("Profile");
const sha256 = require("js-sha256");
const jwt = require("jwt-then");
require("dotenv").config();
const {v4: uuidv4} = require('uuid');


exports.login = async (req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({
        email,
        password: sha256.sha256(password + process.env.SALT)
    });

    if (!user) throw "Email and password must match.";

    const token = await jwt.sign({id: user.id}, process.env.SECRET);

    res.json({
        message: "User logged in successfully",
        token
    });
}

exports.register = async (req, res) => {
    const {name, password, email} = req.body;

    const emailRegex = /@gmail.com|@yahoo.com|@hotmail.com|@live.com/;

    if (!emailRegex.test(email)) throw "Email is not supported from your domain.";
    if (password.length <= 6) throw "Password must be at least 6 characters long.";

    const userExists = await User.findOne({
        email
    });

    if (userExists) throw "User already exists";

    const user = new User({name, email, password: sha256.sha256(password + process.env.SALT)});

    await user.save();

    res.json({
        message: `User ${name} registered successfully`
    });
}

exports.getAllUsers = async (req, res) => {
    const users = await User.find({});

    let newUsers = []

    let profile;
    await Promise.all(users.map( async (user)  =>  {
        const objCount = await Profile.countDocuments({user: user._id});
        if(objCount!==0){
            profile = await Profile.findOne({user: user._id});
            // res.json(profile);

        }else{
            profile = null;
        }
        newUsers.push({user, profile})
    }));

    res.json(newUsers);

}

exports.getMe = async (req, res) => {
    // console.log("getMe is called")
    const token = req.headers.authorization.split(" ")[1];
    // console.log(token)
    const payload = await jwt.verify(token, process.env.SECRET);
    // console.log(payload)
    const user = await User.findOne({_id: payload.id});

    let profile;

    const objCount = await Profile.countDocuments({user: payload.id});

    if(objCount!==0){
        profile = await Profile.findOne({user: payload.id});
        // res.json(profile);

    }else{
        profile = {

        }
    }

    res.json({user: user, profile: profile })
}


exports.uploadProfilePic = async (req, res) => {

    const baseFile = `uploads/${req.file.filename}`
    // res.setHeader('Content-Type', 'application/json');
    if (req.file === undefined) {
        return res.json({msg: 'No file selected!'})
    }

    const objCount = await Profile.countDocuments({user: req.body.user})
    if(objCount !== 0){
        const profile = await Profile.findOneAndUpdate({user: req.body.user}, {image: baseFile} );
        await profile.save()
    } else{
        const profile = new Profile({
            user: req.body.user,
            image: baseFile,
        })
        profile.save()
    }

    // console.log("User: ",req.body.user);
    // console.log(objCount);

    res.status(201).json({
        msg: 'File uploaded successfully!',
        file: req.file.filename
    });

}