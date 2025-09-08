const User = require("../models/user");

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

    try{
        await User.create({
            fullname: name,
            email: email,
            password: password
        });
        return res.redirect("login");
    }
    catch(err){
        console.log(err);
    }
}