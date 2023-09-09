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
    const { name, imageUrl } = await request.json();

    const server = await db.server.update({
      where: {
        profileId: profile.id,
        id: params.serverId,
      },
      data: {
        name,
        imageUrl,
      },
    });

    return NextResponse.json(server, { status: 200 });
  } catch (error: any) {
    console.error("SERVER_ID_PATCH :", error);
    return new NextResponse("Internel Error", { status: 500 });
  }
}

export async function DELETE(
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

    const server = await db.server.delete({
      where: {
        profileId: profile.id,
        id: params.serverId,
      },
    });

    return NextResponse.json(server, { status: 200 });
  } catch (error: any) {
    console.error("SERVER_ID_DELETE :", error);
    return new NextResponse("Internel Error", { status: 500 });
  }
}
