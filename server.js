const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 3000;
const SECRETE_KEY = process.env.SECRETE_KEY;
const PUB_KEY = process.env.PUB_KEY;
const stripe = require("stripe")(SECRETE_KEY);

app.get("/", (req, res) => {
  res.send("Welcome to Stripe Payment!");
});

app.post("/payment-sheet", async (req, res) => {
  // Use an existing Customer ID if this is a returning customer.
  const customer = await stripe.customers.create();
  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: customer.id },
    { apiVersion: "2022-11-15" }
  );
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1,
    currency: "usd",
    customer: customer.id,
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    publishableKey: PUB_KEY,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
