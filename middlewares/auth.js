const mysql = require('mysql')
const bcrypt = require('bcrypt')

const conn = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'to_develop'
})

module.exports = function(req,res,next){
    const username = req.headers.username
    const password = req.headers.password
    
    const sql = "SELECT * FROM users WHERE username = '" + username + "'"
    conn.query(sql, function (err, result) {
        if (err) throw err
        if (result.length < 1)
            res.send(401)
        else {
            bcrypt.compare(password, result[0].password, function (err, resultt) {
                if (resultt == true) {
                    next();
                }
                else {
                    res.send(401)
                }
            });
        }
    })
}