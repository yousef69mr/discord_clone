import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

import { currentProfile } from "@lib/current-profile";
import { db } from "@lib/database";

export async function PATCH(
  request: Request,
  {
    params,
  }: {
    params: {
      serverId: string;
    };
  }
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.serverId) {
      return new NextResponse("Server ID missing !", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        profileId: {
          not: profile.id,
        },
        id: params.serverId,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      data: {
        members: {
          deleteMany: {
            profileId: profile.id,
          },
        },
      },
    });

    return NextResponse.json(server, { status: 200 });
  } catch (error: any) {
    console.error("SERVER_ID :", error);
    return new NextResponse("Internel Error", { status: 500 });
  }
}
