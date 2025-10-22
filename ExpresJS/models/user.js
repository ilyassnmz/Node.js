const { DataTypes } = require("sequelize");
const sequelize = require("../data/db");

const User = sequelize.define("user", {
    fullname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: "İsim alanı boş bırakılamaz." },
            isFullname(value) {
                if(value.split(" ").length < 2) {
                    throw new Error("Lütfen geçerli bir ad soyad giriniz.");
                }
            }
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            args: true,
            msg: "Bu email adresi zaten kayıtlı."
        },
        validate: {
            notEmpty: { msg: "Mail alanı boş bırakılamaz." }
        },
        isEmail: { msg: "Lütfen geçerli bir email adresi giriniz. " }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    resetToken :{
        type: DataTypes.STRING,
        allowNull: true 
    },
    resetTokenExpiration :{
        type: DataTypes.DATE,
        allowNull: true
    }
}, { timestamps: true});

module.exports = User;