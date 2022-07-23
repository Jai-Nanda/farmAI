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
    res.send('Rewards for employees')
})

router.post('/give', (req, res) => {
    supabase.from('orders').select('quantity, employee').match({id: req.headers.order_id})
    .then(data => {
        const quantity = data.data[0].quantity
        const employee = data.data[0].employee

        supabase.from('employees').select('bonus').match({email: employee})
        .then(data => {

            supabase.from('employees').update({bonus: data.data[0].bonus + quantity}).match({email:employee})
            .then(data => {
                console.log(data)
            })
        })
    })

    
})


module.exports = router