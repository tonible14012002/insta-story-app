import { IconButton} from "@consolelabs/core";
import { AddUserSolid, ArrowDownLine, ArrowUpLine, ThreeDotLoading } from "@consolelabs/icons";

export default function Home () {

   return (
      <div className="p-4 flex flex-col gap-4 flex-1 pt-16">
         <div className="flex gap-4 overflow-x-auto -mx-4 h-full">
            <div className="flex gap-4 py-4 items-center flex-col w-full">
               {new Array(10).fill(null).map((_, index) => (
                  <div key={index}
                     className="w-[300px] h-[400px] bg-neutral-400 rounded-lg"
                  />
               ))}
            </div>
         </div>
         <div className="absolute right-4 top-1/2 -translate-y-1/2 space-y-4">
            <IconButton variant="ghost">
               <ArrowUpLine/>
            </IconButton>
            <IconButton variant="outline" color="secondary">
               <AddUserSolid/>
            </IconButton>
            <IconButton variant="ghost">
               <ArrowDownLine/>
            </IconButton>
         </div>
      </div>
   )
}