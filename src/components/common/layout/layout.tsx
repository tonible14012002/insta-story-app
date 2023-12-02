import { PropsWithChildren } from "react";


export function Layout({ children }: PropsWithChildren) {
   return (
      <main className="h-screen w-full sm:container mx-auto bg-white overflow-auto relative flex flex-col">
         {children}
      </main>
   )
}