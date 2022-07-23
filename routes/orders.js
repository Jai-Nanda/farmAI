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
    res.send('Order related functions')
})


router.post('/add', (req, res) => {
    const date = new Date()
    const today = String(date.getFullYear()) + '-' + String(date.getMonth() + 1) + '-' + String(date.getDate())

    supabase.from('orders').insert([{
        name: req.body.name,
        email: req.body.email,
        flavour: req.body.flavour,
        quantity: req.body.quantity,
        order_date: today
    }])
    .then(data => {
        res.json(data)
    })
})


router.get('/past', async (req, res) => {
    const arr = []
    const date = new Date()
    const month = date.getMonth()
    const year = date.getFullYear()
    const today = date.getDate() - 7

    for(let i=today; i < today +7; i++){
        await supabase.from('orders').select()
        .match({order_date: String(year) + '-' + String(month + 1)+ '-' + String(i)})
        .then(data => {
            if(data.data)arr.push(data.data.length)
            else arr.push(0)

            if (i===today+6){
                res.json(arr)
            }
        })
    }

})

router.get('/month', (req, res) => {
    supabase.from('orders').select()
    .then(data => {
        supabase.from('inventory').select()
        .then(result => {
            let count = 0
            for(let i in data.data){
                result.data.filter(item => {
                    if (item.item === data.data[i].flavour){
                        count = count + item.price
                    }
                })
            }
            res.json(count)
        })
    })
})


module.exports = router