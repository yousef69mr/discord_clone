import { currentUser, redirectToSignIn } from "@clerk/nextjs";

import { db } from "@lib/database";

export const initialProfile = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      return redirectToSignIn();
    }

    const profile = await db.profile.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (profile) {
      return profile;
    }

    const newProfile = await db.profile.create({
      data: {
        userId: user.id,
        name:
          user.firstName && user.lastName
            ? `${user.firstName} ${user.lastName}`
            : `${user.username}`,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
      },
    });

    return newProfile;
  } catch (error) {
    console.error(error);
  }
};
