import { db } from "./database";

type Conversation = {
  memberOneId: string;
  memberTwoId: string;
};

export const getOrCreateConversation = async (params: Conversation) => {
  let conversation = await findConversation(params);

  if (!conversation) {
    conversation = await createNewConversation(params);
  }

  return conversation;
};

const findConversation = async ({ memberOneId, memberTwoId }: Conversation) => {
  try {
    return await db.conversation.findFirst({
      where: {
        AND: [{ memberOneId: memberOneId }, { memberTwoId: memberTwoId }],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });
  } catch (error) {
    console.error(error);
    return null;
  }
};

const createNewConversation = async ({
  memberOneId,
  memberTwoId,
}: Conversation) => {
  try {
    return await db.conversation.create({
      data: {
        memberOneId,
        memberTwoId,
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });
  } catch (error) {
    console.error(error);
    return null;
  }
};
