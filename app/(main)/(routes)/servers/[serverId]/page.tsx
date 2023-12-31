import { db } from "@lib/database";
import { redirect } from "next/navigation";

import { currentProfile } from "@lib/current-profile";
import { redirectToSignIn } from "@clerk/nextjs";


interface Props {
  params: {
    serverId: string;
  };
}

const Page = async (props: Props) => {
  const { params } = props;
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include: {
      channels: {
        where: {
          name: "general",
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!server) {
    return redirect("/");
  }

  const initialChannel = server?.channels[0];

  if (initialChannel?.name !== "general") {
    return null;
  }

  return redirect(`/servers/${params.serverId}/channels/${initialChannel.id}`);
};

export default Page;
