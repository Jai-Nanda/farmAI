express = require('express');
nodemailer = require('nodemailer');
dotenv = require('dotenv');
dotenv.config();

router = express.Router();
const sb = require('@supabase/supabase-js');

const config = require('../supabase/config');
const supabase = sb.createClient(config.url, config.key)


async function placeOrder(inv_id) {
    let order_value;
    let order_item;
    const data = await supabase
        .from('inventory')
        .select(('default_order_value, item'))
        .match({id: inv_id})
        .then(res => {
            order_value = res.data[0].default_order_value;
            order_item = res.data[0].item;
        })

    // nodemailer
    let transporter = nodemailer.createTransport({
        host: 'smtp.porkbun.com',
        port: 587, // TODO: change to 465
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });

    const message = `Order details:\nQuantity: ${order_value}\nItem: ${order_item} \n\nThank you!`;
    const html = `<p>Order details:</p><ul><li>Quantity: ${order_value}</li><li>Item: ${order_item}</li></ul><p>Thank you!</p>`;
    let info = transporter.sendMail({
        from: '"Manan" <hello@mananpro.co>',
        to: 'mananman23@gmail.com',
        subject: 'Order',
        text: message,
        html: html
    });
    console.log('Message sent: %s', info.messageId);
    return true;
}


router.get('/', (req, res) => {
    res.send("Inventory");
});


router.post('/create', async (req, res) => {
    const item = req.body.item;
    const quantity = req.body.quantity;
    const min_quantity = req.body.min_quantity;
    const default_order_value = req.body.default_order;
    const data = await supabase
        .from('inventory')
        .insert({item, quantity, min_quantity, default_order_value})
        .then(
            res.json({
                response: true
            })
        );
    // TODO: catch all errors
})


router.post('/update', async (req, res) => {
    const item = req.body.item;
    const quantity_used = req.body.quantity_used;
    let min_quantity;
    let curr_quantity;
    const data = await supabase
        .from('inventory')
        .select(('quantity, min_quantity'))
        .match({item: item})
        .then(data => {
            min_quantity = data.data[0].min_quantity;
            curr_quantity = data.data[0].quantity;
        });
    let operation = false;
    if (curr_quantity - quantity_used < 0) {
        operation = false;
    } else if (curr_quantity - quantity_used < min_quantity) {
        const data = await supabase
            .from('inventory')
            .select(('id'))
            .match({item: item})
            .then(data => {
                if (placeOrder(data.data[0].id)) {
                    operation = true;
                }
            });
    }
    else {
        const data = await supabase
            .from('inventory')
            .update({quantity: curr_quantity - quantity_used})
            .match({item: item})
            .then(() => {
                operation = true;
            });
    }
    if (operation) {
        res.json({
            response: true
        })
    } else {
        res.json({
            response: false
        })
    }
});

router.post('/fetch', async (req, res) => {
    const item = req.body.item;
    const data = await supabase
        .from('inventory')
        .select('*')
        .match({item: item})
        .then(data => {
            res.json(data);
        })
});

router.get('/list', async (req, res) => {
    const data = await supabase
        .from('inventory')
        .select('*')
        .then(data => {
            res.json(data.data);
        })
});

module.exports = router