const express = require("express");
const { userAuth } = require("../middlewares/auth");
const paymentRouter = express.Router();
const razorpayInstance = require("../utils/razorpay");
const Payment = require("../models/payment");
const User = require("../models/user");
const { membershipAmount } = require("../utils/constants");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");


// Route to create a new order(dynamically)
paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const { membershipType } = req.body;
    const { firstName, lastName, emailId } = req.user;

    // Create an order in Razorpay
    const order = await razorpayInstance.orders.create({
      amount: membershipAmount[membershipType] * 100,
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        firstName,
        lastName,
        emailId,
        membershipType: membershipType,
      },
    });

    console.log(order);

    // Save it in my database
    const payment = new Payment({
      userId: req.user._id,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });

    const savedPayment = await payment.save();

    // Return back my order details to frontend
    res.json({
      data: savedPayment,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

// Razorpay will send a post request to this endpoint whenever payment is captured or failed
paymentRouter.post("/payment/webhook", async (req, res) => {
  try {
    // validate the webhook signature
    console.log("Webhook Called");
    const webhookSignature = req.get("X-Razorpay-Signature");
    console.log("Webhook Signature", webhookSignature);

    const isWebhookValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET,
    );

    if (!isWebhookValid) {
      console.log("INvalid Webhook Signature");
      return res.status(400).json({ msg: "Webhook signature is invalid" });
    }
    console.log("Valid Webhook Signature");

    // Udpate my payment Status in DB
    const paymentDetails = req.body.payload.payment.entity;

    const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
    payment.status = paymentDetails.status;
    await payment.save();
    console.log("Payment saved");

    // Update the user as premium
    const user = await User.findOne({ _id: payment.userId });
    user.isPremium = true;
    user.membershipType = payment.notes.membershipType;
    console.log("User saved");
    await user.save();

    // return success response to razorpay
    return res.status(200).json({ msg: "Webhook received successfully" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

//route to verify if user is premium or not
paymentRouter.get("/premium/verify", userAuth, async (req, res) => {
  const user = req.user;
  if (!req.user.isPremium) {
    return res.status(403).json({
      message: "User is not a premium member",
    });
  }
  return res.json({
    message: "User is premium",
    data: {
      membershipType: req.user.membershipType,
    },
  });
});
module.exports = paymentRouter;
