import { type NextApiRequest, type NextApiResponse } from "next";

import { prisma } from "../../server/db/client";

const examples = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "POST":
      handlePost(req, res);
      break;
    case "GET":
      handleGet(req, res);
      break;
    default:
      break;
  }
};

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const { name } = JSON.parse(req.body);
  console.log(name);

  if (!name) {
    return res.status(400).send({
      error: "Name must be provided!",
    });
  }

  const result = await prisma.example.create({
    data: {
      message: name,
    },
    select: {
      id: true,
      createdAt: true,
      message: true,
      updatedAt: true,
    },
  });
  console.log("created entity:");
  console.log(result);

  res.status(200).json({
    data: result,
  });
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(
    (await prisma.example.findMany()) ?? {
      error: "no data found",
    }
  );
}

export default examples;
