import Razorpay from "razorpay";
export default async function handler(req, res) {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const options = {
      amount: 50000, // amount in smallest currency unit
      currency: "INR",
      receipt: "receipt_order_74394",
    };

    const order = await instance.orders.create(options);

    if (!order) return res.status(500).send("Some error occured");

    console.log(order);

    res.json(order);
  } catch (error) {
    res.status(500).send(error);
  }

  //   res.status(200).json({ text: "Hello" });
}
