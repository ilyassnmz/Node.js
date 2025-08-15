const mysql = require("mysql2");
const config = require("../config");

let connection = mysql.createConnection(config.db);

connection.connect(function(err){
    if(err) {
        return console.log(err);
    }

    connection.query("select * from blog", function(err, result){
        console.log(result[0].baslik);
    })

    console.log("MySQL Server Bağlantısı Yapıldı")
});

module.exports = connection.promise();