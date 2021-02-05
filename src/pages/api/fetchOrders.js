import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { email } = req.body;
  console.log(email);

  switch (req.method) {
    case "GET":
      //...
      break;
    case "POST":
      try {
        const orders = await prisma.orders.findMany({
          where: { email: email },
        });

        if (!orders) return res.status(500).json({ error: "no orders" });
        res.json(orders);
      } catch (error) {
        res.status(500).json({ error });
      } finally {
        async () => {
          await prisma.$disconnect();
        };
      }
      break;
    default:
      res.status(405).end();
      break;
  }
}
