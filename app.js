const express = require('express')
const cors = require('cors')


//routes
const auth = require('./routes/auth')
const user = require('./routes/user')
const details = require('./routes/details')
const orders = require('./routes/orders')
const tasks = require('./routes/tasks')
const feedbacks = require('./routes/feedbacks')
const rewards = require('./routes/rewards')
const inventory = require('./routes/inventory')
const transfer = require('./routes/transfer')


const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())


app.use('/auth', auth)
app.use('/user', user)
app.use('/details', details)
app.use('/orders', orders)
app.use('/feedbacks', feedbacks)
app.use('/tasks', tasks)
app.use('/reward', rewards)
app.use('/inventory', inventory)
// app.use('/transfer', transfer)

app.get('/', (req, res) => {
    // res.send('Chocolate Factory')
    res.send(req.cookies);
})


app.listen(8000, () => {
    console.log('Server is running on port 8000')
})
