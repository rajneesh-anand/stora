import { getSession } from "next-auth/client";
import { PrismaClient } from "@prisma/client";

export default async function handler(req, res) {
  const prisma = new PrismaClient({ log: ["query"] });
  const session = await getSession({ req });

  try {
    // getting the details back from our font-end
    const {
      orderId,
      paymentId,
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

    const result = await prisma.orders.create({
      data: {
        orderId: orderId,
        paymentId: paymentId,
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
        amount: parseFloat(amount),
        orderStatus: order_status,
        items: items_placed,
      },
    });

    console.log(result);

    res.json({
      msg: "success",
      // orderId: razorpayOrderId,
      // paymentId: razorpayPaymentId,
      // amount: amount,
      result: result,
    });
  } catch (error) {
    res.status(500).send(error);
  } finally {
    async () => {
      await prisma.$disconnect();
    };
  }
}
