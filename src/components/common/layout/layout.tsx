import { PropsWithChildren } from "react";

export function Layout({ children }: PropsWithChildren) {
  return (
    <main className="h-screen w-full container mx-auto bg-white overflow-auto relative flex flex-col pt-16">
      {children}
    </main>
  );
}
