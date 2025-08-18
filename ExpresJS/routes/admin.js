const express = require("express");
const router = express.Router();

const db = require("../data/db");

router.get("/blog/create", async function(req, res) {
    try {
        
        const [categories, ] = await db.execute("select * from category");
        res.render("admin/blog-create", {
            title: "add blog",
            categories: categories,
        });

    } 
    catch (err) {
        console.log(err);
    }
});

router.post("/blog/create", async function(req, res) {
    const baslik = req.body.baslik;
    const aciklama = req.body.aciklama;
    const resim = req.body.resim;
    const kategori = req.body.kategori;
    const anasayfa = req.body.anasayfa == "on" ? 1 : 0;
    const onay = req.body.onay == "on" ? 1 : 0;

    try {
        await db.execute("INSERT INTO blog (baslik, aciklama, resim, anasayfa, onay, categoryid) VALUES (?,?,?,?,?,?)" , [baslik, aciklama, resim, anasayfa, onay, kategori]);
        res.redirect("/");    
    }
    catch (err) {
        console.log(err);
    }
});

router.get("/blogs/:blogid", function(req, res) {
    res.render("admin/blog-edit");
});

router.get("/blogs", function(req, res) {
    res.render("admin/blog-list");
});

module.exports = router;