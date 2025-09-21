const User = require("../models/user");
const bcrypt = require("bcrypt");
const emailService = require("../helpers/send-mail");
const config = require("../config");
const ctypto = require("crypto");

exports.get_register = async function(req, res) {
    try {
        return res.render("auth/register", {
            title: "register"
        });
    }
    catch(err) {
        console.log(err);
    }
}

exports.post_register = async function(req, res) {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user  = await User.findOne({ where: { email: email }});
        if(user) {
            req.session.message = { text: "Girdiğiniz email adresiyle daha önce kayıt olunmuş.", class: "warning"};
            return res.redirect("login");
        }
        const newUser = await User.create({ fullname: name, email: email, password: hashedPassword });

        emailService.sendMail({
            from: config.email.from,
            to: newUser.email,
            subject: "Hesabınızı oluşturuldu.",
            text: "Hesabınızı başarılı şekilde oluşturuldu."
        });

        req.session.message = { text: "Hesabınıza giriş yapabilirsiniz", class: "success"};
        return res.redirect("login");
    }
    catch(err) {
        console.log(err);
    }
}

exports.get_login = async function(req, res) {
    const message = req.session.message;
    delete req.session.message;
    try {
        return res.render("auth/login", {
            title: "login",
            message: message,
            csrfToken: req.csrfToken()
        });
    }
    catch(err) {
        console.log(err);
    }
}


exports.get_logout = async function(req, res) {
    try {
        await req.session.destroy();
        return res.redirect("/account/login");
    }
    catch(err) {
        console.log(err);
    }
}

exports.post_login = async function(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    try {

        const user = await User.findOne({
            where: {
                email: email
            }
        });

        if(!user) {
            return res.render("auth/login", {
                title: "login",
                message: { text: "Email hatalı", class: "danger"}
            });
        }

        // parola kontrolü
        const match = await bcrypt.compare(password, user.password);

        if(match) {
            // session
            req.session.isAuth = true;
            req.session.fullname = user.fullname;
            // session in db
            // token-based auth - api
            const url = req.query.returnUrl || "/";
            return res.redirect(url);
        } 
        
        return res.render("auth/login", {
            title: "login",
            message: { text: "Parola hatalı", class: "danger"}
        });     
    }
    catch(err) {
        console.log(err);
    }
}

exports.get_reset = async function(req, res) {
    const message = req.session.message;
    delete req.session.message;
    try {
        return res.render("auth/reset-password", {
            title: "reset password",
            message: message
        });
    }
    catch(err) {
        console.log(err);
    }
}

exports.post_reset = async function(req, res) {
    const email = req.body.email;

    try {
        var token = ctypto.randomBytes(32).toString("hex");
        const user = await User.findOne({ where: { email: email }});
        
        if(!user) {
            req.session.message = { text: "Email bulunamadı", class: "danger"};
            return res.redirect("reset-password");
        }

        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + (1000 * 60 * 60);
        await user.save();

        emailService.sendMail({
            from: config.email.from,
            to: email,
            subject: "Reset Password",
            html: `
                <p>Parolanızı güncellemek için aşağıdaki linke tıklayınız.</p>
                <p>
                    <a href="http://127.0.0.1:3000/account/reset-password/${token}">Parola Sıfırla<a/>
                </p>
            `
        });

        req.session.message = { text: "parolanızı sıfırlamak için eposta adresinizi kontrol ediniz.", class: "success"};
        res.redirect("login");
    }
    catch(err) {
        console.log(err);
    }
}