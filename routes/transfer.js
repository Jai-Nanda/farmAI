// const express = require('express');
// const router = express.Router();
// const http = require('http');
// const dotenv = require('dotenv');
// dotenv.config();
//
// const IconService = require('icon-sdk-js');
// const { IconAmount, IconConverter, HttpProvider, IconWallet, IconBuilder, SignedTransaction } = IconService;
// const iconWallet = IconService.IconWallet;
// const provider = new HttpProvider('https://bicon.net.solidwallet.io/api/v3');
// const iconService = new IconService(provider);
//
// router.get('/', (req, res) => {
//   res.send('transfer');
// })
//
// router.post('/salary', async (req, res) => {
//   const {
//     to,
//     amount
//   } = req.body;
//   const wallet = new iconWallet(process.env.PRIVATE_KEY);
//   const tx = await wallet.sendTransaction({
//     to: to,
//     value: amount,
//     stepLimit: '0x2710',
//     nid: '0x3',
//     nonce: '0x0',
//     version: '0x3'
//   });
//   res.send(tx);
// })
//
// module.exports = router;
