const User = require("../models/user");
const bcrypt = require("bcrypt");

exports.get_register = async function (req, res) {
    try{
        return res.render("auth/register",{
            title: "Register"
        });
    }
    catch(err){
        console.log(err);
    }
}

exports.post_register = async function (req, res) {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    const hashedPassword = await bcrypt.hash(password, 10);

    try{
        await User.create({
            fullname: name,
            email: email,
            password: hashedPassword
        });
        return res.redirect("login");
    }
    catch(err){
        console.log(err);
    }
}