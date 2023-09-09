import { redirectToSignIn } from "@clerk/nextjs";
import { currentProfile } from "@lib/current-profile";
import { redirect } from "next/navigation";
import { db } from "@lib/database";
import { getOrCreateConversation } from "@lib/conversation";
import ChatHeader from "@components/chat/chat-header";
import ChatInput from "@components/chat/chat-input";
import ChatMessages from "@components/chat/chat-messages";
import { MediaRoom } from "@components/media-room";

interface Props {
  params: {
    memberId: string;
    serverId: string;
  };
  searchParams: {
    video?: boolean;
  };
}

const Page = async (props: Props) => {
  const { params, searchParams } = props;

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

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        serverId={params.serverId}
        imageUrl={otherMember.profile.imageUrl}
        name={otherMember.profile.name}
        type="conversation"
      />

      {!searchParams.video ? (
        <>
          <ChatMessages
            name={otherMember.profile.name}
            member={currentMember}
            chatId={conversation.id}
            type="conversation"
            apiUrl="/api/direct-messages"
            socketUrl="/api/socket/direct-messages"
            socketQuery={{
              conversationId: conversation.id,
            }}
            paramKey="conversationId"
            paramValue={conversation.id}
          />
          <ChatInput
            name={otherMember.profile.name}
            type="conversation"
            apiUrl="/api/socket/direct-messages"
            query={{
              conversationId: conversation.id,
            }}
          />
        </>
      ) : (
        <MediaRoom chatId={conversation.id} video={false} audio={true} />
      )}
    </div>
  );
};

export default Page;
