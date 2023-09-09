import { redirectToSignIn } from "@clerk/nextjs";
import { currentProfile } from "@lib/current-profile";
import { db } from "@lib/database";
import { redirect } from "next/navigation";

interface Props {
  params: {
    inviteCode: string;
  };
}

const Page = async (props: Props) => {
  const { params } = props;
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  if (!params.inviteCode) {
    return redirect("/");
  }

  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (existingServer) {
    return redirect(`/servers/${existingServer.id}`);
  }

  const server = await db.server.update({
    where: {
      inviteCode: params.inviteCode,
    },
    data: {
      members: {
        create: [
          {
            profileId: profile.id,
          },
        ],
      },
    },
  });

  if (server) {
    return redirect("/servers/" + server?.id);
  }
};

export default Page;
