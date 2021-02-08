import Razorpay from "razorpay";
import crypto from "crypto";
import { PrismaClient } from "@prisma/client";

export default async function handler(req, res) {
  const prisma = new PrismaClient({ log: ["query"] });
  console.log(req.body);
  try {
    // getting the details back from our font-end
    const {
      orderCreationId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
      amount,
      name,
      email,
      mobile,
      address,
      address_two,
      locality,
      city,
      pin,
      state,
      country,
      order_status,
      items_placed,
    } = req.body;

    // Creating our own digest
    // The format should be like this:
    // digest = hmac_sha256(orderCreationId + "|" + razorpayPaymentId, secret);
    const shasum = crypto.createHmac("sha256", "GqawpZHXIFvf2GmsRN9gm66s");

    shasum.update(`${orderCreationId}|${razorpayPaymentId}`);

    const digest = shasum.digest("hex");

    console.log(digest);
    console.log(razorpaySignature);

    // comaparing our digest with the actual signature
    if (digest !== razorpaySignature)
      return res.status(400).json({ msg: "Transaction not legit!" });

    // THE PAYMENT IS LEGIT & VERIFIED
    // YOU CAN SAVE THE DETAILS IN YOUR DATABASE IF YOU WANT

    await prisma.orders.create({
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      name: name,
      email: email,
      mobile: mobile,
      addressOne: address,
      addressTwo: address_two,
      locality: locality,
      city: city,
      pin: pin,
      state: state,
      country: country,
      amount: amount,
      orderStatus: order_status,
      items: items_placed,
    });

    res.json({
      msg: "success",
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      amount: amount,
    });
  } catch (error) {
    res.status(500).send(error);
  } finally {
    async () => {
      await prisma.$disconnect();
    };
  }
}
