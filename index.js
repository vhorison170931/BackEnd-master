const express = require('express')
const cors = require('cors')

const app = express()
const routerTodos = require('./router/todo.js')
const routerUsers = require('./router/user')
const auth = require('./middlewares/auth.js')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/todo', auth, routerTodos)
app.use('/user', routerUsers)

app.listen(3000, () => {
    console.log('Server Running Port : 3000')
})