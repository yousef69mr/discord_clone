import { NextResponse } from "next/server";

import { MemberRole } from "@prisma/client";

import { currentProfile } from "@lib/current-profile";
import { db } from "@lib/database";

export async function POST(request: Request) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);

    const serverId = searchParams.get("serverId");

    if (!serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }

    const { name, type } = await request.json();

    if (name === "general") {
      return new NextResponse("Name cannot be 'general'", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          create: {
            profileId: profile.id,
            name,
            type,
          },
        },
      },
    });

    return NextResponse.json(server, { status: 201 });
  } catch (error: any) {
    console.error("CHANNELS_POST :", error);
    return new NextResponse("Internel Error", { status: 500 });
  }
}
