const express = require('express');
const path = require('path')
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const taskRouter = require('./routers/task')
app.use('/api/tasks', taskRouter)


app.use('/public', express.static(path.join(__dirname, '/public')));
app.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})


app.listen(3000)