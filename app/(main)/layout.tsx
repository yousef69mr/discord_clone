import "../globals.css";

import NavigationSidebar from "@components/navigation/navigation-sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0">
        <NavigationSidebar />
      </div>
      <section className="md:pl-[72px] h-full">{children}</section>
    </div>
  );
}
