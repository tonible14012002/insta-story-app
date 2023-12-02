import { identityService } from "@/apis";
import { Avatar, Button, Modal, ModalContent, ModalTrigger } from "@consolelabs/core";
import { useRouter } from "next/router";
import { useAuthContext } from "@/context/auth";
import { useFetchProfile } from "@/hooks/useFetchProfile";
import { PageSkeleton } from "@/components/common/skeleton";

export default function Profile () {

   const { query } = useRouter()
   const { user } = useAuthContext()
   const { profile, isFirstLoading, mutate } = useFetchProfile(query?.id as string | undefined)

   if (isFirstLoading) {
      return (
         <PageSkeleton />
      )
   }

   return (
      <div className="p-4 space-y-4">
         <div className="flex flex-row items-center gap-16">
            <div className="">
               <Avatar src={profile?.avatar as string} />
            </div>
            <div className="flex flex-col gap-2">
               {user?.id !== profile?.id && (
                  <div className="flex gap-4">
                     <Button onClick={async () => {
                        try{
                           await identityService.followUser(profile?.id as string)
                           mutate()
                        }
                        catch (e) {}
                     }}>
                        Follow
                     </Button>
                     <Button variant="outline">
                        Unfollow
                     </Button>
                  </div>
               )}
               <div className="grid grid-cols-3 gap-4">
                  <Modal>
                     <ModalTrigger asChild>
                        <h3 className="hover:underline cursor-pointer">
                           {profile?.total_followers} Followers
                        </h3>
                     </ModalTrigger>
                     <ModalContent>
                     </ModalContent>
                  </Modal>
                  <h3>{profile?.total_followings} Followings</h3>
               </div>
            </div>
         </div>
      </div>
   )
}

