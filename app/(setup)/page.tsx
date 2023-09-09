import { db } from "@lib/database";
import { initialProfile } from "@lib/initial-profile";
import { redirect } from "next/navigation";
import InitialModal from "@components/modals/initial-modal";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

const Page = async () => {
  const profile = await initialProfile();

  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile && profile.id,
        },
      },
    },
  });

  if (server) {
    redirect(`/servers/${server.id}`);
  }

  return (
    <Suspense fallback={<Loader2 />}>
      <main>
        <InitialModal />
      </main>
    </Suspense>
  );
};

export default Page;
