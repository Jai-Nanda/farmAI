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
    res.send('User Functions like attendance and rewards')
})

router.post('/attendance', (req, res) => {
    const email = req.headers.user
    const date = new Date()

    supabase.from('employees').select().match({email: email})
    .then(data => {
        if (data.data[0].last_workday > date.getDate()){
            const salary = data.data[0].salary
            const bonus = data.data[0].bonus

            const new_salary = salary + Math.floor(bonus/500)*100

            supabase.from('employees').update({
                last_workday: date.getDate(),
                work_days: 1,
                bonus: 0,
                last_salary: new_salary
            })
            .match({email: email})
            .then(data => {
                console.log(data)
            })
        }

        else if (data.data[0].last_workday != date.getDate()){
            supabase.from('employees').update({
                last_workday: date.getDate(),
                work_days: data.data[0].work_days + 1
            })
            .then(data => {
                console.log(data)
            })
        }
    })
})


module.exports = router