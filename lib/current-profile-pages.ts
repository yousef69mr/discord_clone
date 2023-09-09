import { getAuth } from "@clerk/nextjs/server";
import { NextApiRequest } from "next";
import { db } from "@lib/database";

export const currentProfilePages = async (request: NextApiRequest) => {
  const { userId } = getAuth(request);

  if (!userId) {
    return null;
  }

  const profile = await db.profile.findUnique({
    where: {
      userId,
    },
  });

  return profile;
};
