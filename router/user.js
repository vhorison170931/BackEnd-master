const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const bcrypt = require('bcrypt')
const saltRounds = 10
const auth = require('../middlewares/auth.js')
router.use(express.json())
router.use(express.urlencoded())

var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'to_develop'
})

conn.connect(function(err){
    if(err)
        throw err
})

// router.get('/', function (req, res) {
//     res.send(`
//         <html>
//             <form action="/user" method="POST">
//                 <label>Username</label>
//                 <input name = "username"></input>
//                 <label>Password</label>
//                 <input name = "password" type = "password"></input>
//                 <button>Submit</button>
//             </form>
//         </html>
//     `)
// })

router.post('/',function(req,res,next){
    const sql = `SELECT * FROM users`
    conn.query(sql, function(err,result){
        if(err)
            throw err
        if(result.length > 0)
            auth(req,res,next)
        else
            next()
    })
},function(req,res){
    bcrypt.genSalt(saltRounds, function (err, salt) {
        bcrypt.hash(req.body.password, salt, function (err, hash) {
            const sql = "INSERT INTO users(username, password) VALUES ('" + req.body.username + "' , '" + hash + "')"
            conn.query(sql, function (err) {
                if (err) throw err
                console.log("1 record inserted")
                res.end()
            })
        })
    })
})

// router.post('/', function (req,res){
//     bcrypt.genSalt(saltRounds, function (err, salt) {
//         bcrypt.hash(req.body.password, salt, function (err, hash) {
//             const sql = "INSERT INTO users(username, password) VALUES ('" + req.body.username + "' , '" + hash + "')"
//             conn.query(sql, function (err) {
//                 if (err) throw err
//                 console.log("1 record inserted")
//                 res.end()
//             })
//         })
//     })
// })

router.get('/',function(req,res){
    const sql = 'SELECT * FROM users'
    conn.query(sql,function(err,result){
        if(err)
            throw err
        res.send(result)
    })
})

router.delete('/:id',(req,res,next) => {
    const sql = 'SELECT * FROM users'
    conn.query(sql, function(err,result){
        if(err)
            throw err
        else if(result.length > 1)
            next()
        else
            res.sendStatus(401)
    })
},function(req,res){
    const sql = `DELETE FROM users WHERE id=\'${req.params.id}\'`
    conn.query(sql,function(err,result){
        if(err)
            throw err
        res.send("User Deleted")
    })
})

module.exports = router