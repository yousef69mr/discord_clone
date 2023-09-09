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
      memberId: string;
    };
  }
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.memberId) {
      return new NextResponse("Member ID missing !", { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const { role } = await request.json();

    const serverId = searchParams.get("serverId");

    if (!serverId) {
      return new NextResponse("Server ID missing !", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id, // only admin can modify
      },
      data: {
        members: {
          update: {
            where: {
              id: params.memberId,
              profileId: {
                not: profile.id,
              },
            },
            data: {
              role,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    });
    return NextResponse.json(server, { status: 200 });
  } catch (error: any) {
    console.error("MEMBER_ID_PATCH :", error);
    return new NextResponse("Internel Error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  {
    params,
  }: {
    params: {
      memberId: string;
    };
  }
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.memberId) {
      return new NextResponse("Member ID missing !", { status: 400 });
    }

    const { searchParams } = new URL(request.url);

    const serverId = searchParams.get("serverId");

    if (!serverId) {
      return new NextResponse("Server ID missing !", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id, // only admin can modify
      },
      data: {
        members: {
          deleteMany: {
            id: params.memberId,
            profileId: {
              not: profile.id,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    });
    return NextResponse.json(server, { status: 200 });
  } catch (error: any) {
    console.error("MEMBER_ID_DELETE :", error);
    return new NextResponse("Internel Error", { status: 500 });
  }
}
