const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const sb = require('@supabase/supabase-js');

const config = require('../supabase/config')

const supabase = sb.createClient(config.url, config.key)

router.get('/', (req, res) => {
    res.send('Camera OpenRCS')
});

router.get('/show', async (req, res) => {
    const data = await supabase
        .from('camera')
        .select('enabled')
        .match({id: 1})
        .then(data => {
            res.json(data.data)
        })
})
