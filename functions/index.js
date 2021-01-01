const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')('sk_test_51HavVyFYQlFGDS7GUpQm3yMyj3W8hFYBSc5kd4ZoyHHocrtaPYK9S65SrgiSZTpNpdwNOH80wTwcmssLCR7rHNTv00YyL40MHR');

const app = express();

app.use(cors({ origin: true }));

app.use(express.json());

app.get('/', (req, res) => res.status(200).send('Hello World'));

app.post('/payments/create', async (req, res) => {
    const total = req.query.total;
    console.log('payment receieved', total);

    const paymentIntent = await stripe.paymentIntents.create({
        amount: total,
        currency: "usd",
    });

    res.status(201).send({
        clientSecret: paymentIntent.client_secret,
    })
})

exports.api = functions.https.onRequest(app);

//http://localhost:5001/clone-8a68d/us-central1/api