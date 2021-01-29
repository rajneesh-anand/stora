import Razorpay from "razorpay";
export default async function handler(req, res) {
  const { totalCartAmount } = req.body;

  switch (req.method) {
    case "GET":
      //...
      break;
    case "POST":
      try {
        const instance = new Razorpay({
          key_id: process.env.RAZORPAY_KEY_ID,
          key_secret: process.env.RAZORPAY_SECRET,
        });

        const options = {
          amount: totalCartAmount * 100, // amount in smallest currency unit
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
      break;
    default:
      res.status(405).end();
      break;
  }
}
