const express = require('express');
const router = express.Router();
const http = require('http');
const sb = require('@supabase/supabase-js');

//supabase
const config = require('../supabase/config');
const supabase = sb.createClient(config.url, config.key)


router.get("/", (req, res) => {
  res.send("Task manager")
});


// Update the status of the task using the task id
router.post("/claim", (req, res) => {
    supabase.from('orders')
        .update({status: "inprogress", employee: req.body.employee})
        .match({id: req.body.id})
        .then(data => {
            res.json(data)
        });
});


router.post('/complete', (req, res) => {
    const date = new Date()
    const today = String(date.getFullYear()) + '-' + String(date.getMonth() + 1) + '-' + String(date.getDate())

    supabase.from('orders')
        .update({status: "completed", complete_date: today})
        .match({id: req.body.id})
        .then(data => {
            supabase.from('inventory').select().match({item: data.data[0].flavour})
            .then(result => {
                supabase.from('inventory').update({quantity: result.data[0].quantity - data.data[0].quantity}).match({item: data.data[0].flavour})
                .then(re => {
                    const post = http.request({
                        host: 'localhost',
                        port: '8000',
                        path: '/reward/give',
                        method: 'POST',
                        headers: {order_id: req.body.id}
                    })
        
                    post.end()
        
                    res.json(data);
                })
            })
        })
});

module.exports = router
