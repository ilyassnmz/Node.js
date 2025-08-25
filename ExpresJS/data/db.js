const mysql = require("mysql2");
const config = require("../config");

const Sequelize = require("sequelize");

const sequelize = new Sequelize(config.db.database, config.db.user, config.db.password, {
    dialect: "mysql",
    host: config.db.host,
});

async function connect() {
    try {
        sequelize.authenticate();
        console.log("MySQL Server Bağlantısı Yapıldı");
    }
    catch (err) {
        console.log("MySQL Bağlantı Hatası: ", err);
    }
}

connect();

module.exports = sequelize;

// let connection = mysql.createConnection(config.db);

// connection.connect(function(err){
//     if(err) {
//         return console.log(err);
//     }

//     connection.query("select * from blog", function(err, result){
//         console.log(result[0].baslik);
//     })

//     console.log("MySQL Server Bağlantısı Yapıldı")
// });

// module.exports = connection.promise();