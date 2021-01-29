import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { username } = req.body;
  console.log("------", username);

  switch (req.method) {
    case "GET":
      //...
      break;
    case "POST":
      try {
        const user = await prisma.user.findFirst({
          where: { name: username },
        });

        // if (!user)
        //   return res.status(500).json({ error: "User doesn't exist !" });

        res.json(user);
      } catch (error) {
        res.status(500).json({ error });
      }
      break;
    default:
      res.status(405).end();
      break;
  }
}
