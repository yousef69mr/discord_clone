import { db } from "@lib/database";
import { Metadata } from "next";

type Props = {
  params: {
    channelId: string;
  };
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  // read route params
  const { params } = props;

  const channel = await db.channel.findUnique({
    where: {
      id: params.channelId,
    },
    include: {
      server: true,
    },
  });

  return {
    title: `#${channel?.name || ""} channel - ${channel?.server.name} server`,
    description: `#${channel?.name || ""} channel(${channel?.type}) - ${
      channel?.server.name
    } server`,
  };
}

const ChannelIdLayout = async ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default ChannelIdLayout;
