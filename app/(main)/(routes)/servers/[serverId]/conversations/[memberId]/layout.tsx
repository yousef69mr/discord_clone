import { redirectToSignIn } from "@clerk/nextjs";
import { getOrCreateConversation } from "@lib/conversation";
import { currentProfile } from "@lib/current-profile";
import { db } from "@lib/database";
import { Metadata } from "next";
import { redirect } from "next/navigation";

interface Props {
  params: {
    memberId: string;
    serverId: string;
  };
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  // read route params
  const { params } = props;

  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const currentMember = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  });

  if (!currentMember) {
    return redirect("/");
  }
  // fetch data

  const members = {
    memberOneId: currentMember.id,
    memberTwoId: params.memberId,
  };

  const conversation = await getOrCreateConversation(members);

  if (!conversation) {
    return redirect(`/servers/${params.serverId}`);
  }

  const { memberOne, memberTwo } = conversation;

  const otherMember =
    memberOne.profileId === profile.id ? memberTwo : memberOne;

  return {
    title: `${otherMember?.profile.name || ""} chat`,
    icons: {
      icon: otherMember?.profile.imageUrl || "",
      apple: [
        {
          url: otherMember?.profile.imageUrl || "",
        },
      ],
    },
  };
}

const ConversationIdLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <>{children}</>;
};

export default ConversationIdLayout;
