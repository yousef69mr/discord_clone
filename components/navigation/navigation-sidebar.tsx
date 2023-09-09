import { currentProfile } from "@lib/current-profile";
import { redirect } from "next/navigation";
import { db } from "@lib/database";
import { UserButton } from "@clerk/nextjs";

import { Separator } from "@components/ui/separator";

import NavigationAction from "./navigation-action";
import { ScrollArea } from "@components/ui/scroll-area";

import NavigationItem from "./navigation-item";
import { ModeToggle } from "@components/mode-toggle";

const NavigationSidebar = async () => {
  const profile = await currentProfile();
  if (!profile) {
    redirect("/");
  }

  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });
  return (
    <section className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] bg-[#E3E5E8] py-3">
      <NavigationAction />
      <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
      <ScrollArea className="flex-1 w-full">
        {servers?.map((server) => (
          <div key={server.id} className="mb-4">
            <NavigationItem
              name={server.name}
              imageUrl={server.imageUrl}
              id={server.id}
            />
          </div>
        ))}
      </ScrollArea>
      <div className="pb-3 flex mt-auto items-center flex-col gap-y-4">
        <ModeToggle />
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "h-[48px] w-[48px]",
            },
          }}
        />
      </div>
    </section>
  );
};

export default NavigationSidebar;
