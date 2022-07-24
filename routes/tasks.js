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


router.post('/')

module.exports = router
