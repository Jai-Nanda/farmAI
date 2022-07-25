const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const sb = require('@supabase/supabase-js');


//supabase
const config = require('../supabase/config')

const supabase = sb.createClient(config.url, config.key)


//middlewares
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())


//routes
router.get('/', (req, res) => {
    res.send('Fetching Details of employees and orders from database')
})


router.get('/employee', (req, res) => {
    supabase.from('employees').select()
    .then(data => {
        res.json(data.data)
    })
})

router.post('/user', (req, res) => {
    supabase.from('employees').select().match({email: req.body.email})
    .then(data => {
        // res.json(data.data[0])
    })
})


router.get('/feedback', (req, res) => {
    supabase.from('feedbacks').select()
    .then(data => {
        res.json(data.data)
    })
})


router.post('/orders', (req, res) => {
    supabase.from('orders').select().match({status: req.body.status, employee:req.body.email})
    .then(data => {
        res.json(data.data)
    })
})

router.post('/neworders', (req, res) => {
    supabase.from('orders').select().match({status: req.body.status})
    .then(data => {
        res.json(data.data)
    })
})

router.get('/topemployee', (req, res) =>{
    supabase.from('employees').select()
    .then(data => {
        const arr = data.data.sort(function(a,b){return b.bonus - a.bonus})
        res.json(arr)
    })
})


module.exports = router