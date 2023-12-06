import { identityService } from "@/apis";
import {
  Avatar,
  Button,
  Modal,
  ModalContent,
  ModalTrigger,
} from "@consolelabs/core";
import { useRouter } from "next/router";
import { useAuthContext } from "@/context/auth";
import { useFetchProfile } from "@/hooks/useFetchProfile";
import { PageSkeleton } from "@/components/common/skeleton";

export default function Profile() {
  const { query } = useRouter();
  const { user } = useAuthContext();
  const { profile, isFirstLoading, mutate } = useFetchProfile(
    query?.id as string | undefined
  );

  if (isFirstLoading) {
    return <PageSkeleton />;
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-row items-center gap-16 ">
        <div className="">
          <Avatar src={profile?.avatar as string} />
          <h5 className="line-clamp-1 w-52 font-bold text-xl mt-2 absolute">
            {user?.nickname}
          </h5>
        </div>
        <div className="flex flex-col gap-2 ">
          {user?.id !== profile?.id && (
            <div className="flex gap-4">
              <Button
                onClick={async () => {
                  try {
                    await identityService.followUser(profile?.id as string);
                    mutate();
                  } catch (e) {}
                }}
              >
                Follow
              </Button>
              <Button variant="outline">Unfollow</Button>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <Modal>
              <ModalTrigger asChild>
                <div className="cursor-pointer flex items-center flex-col ">
                  <h3 className="font-bold text-2xl">
                    {profile?.total_followers}
                  </h3>
                  <h3 className="hover:underline">Followers</h3>
                </div>
              </ModalTrigger>
              <ModalContent>
                <div className="w-96 h-96">
                  <div className="flex flex-row gap-2 justify-center items-center border-b-2 border-solid border-gray-400">
                    <h3 className="font-bold text-lg">
                      {profile?.total_followers}
                    </h3>
                    <h3>Followers</h3>
                  </div>
                </div>
              </ModalContent>
            </Modal>
            <Modal>
              <ModalTrigger asChild>
                <div className="cursor-pointer flex items-center flex-col">
                  <h3 className="font-bold text-2xl">
                    {profile?.total_followings}
                  </h3>
                  <h3 className="hover:underline">Followings</h3>
                </div>
              </ModalTrigger>
              <ModalContent>
                <div className="w-96 h-96">
                  <div className="flex flex-row gap-2 justify-center items-center border-b-2 border-solid border-gray-400">
                    <h3 className="font-bold text-lg">
                      {profile?.total_followings}
                    </h3>
                    <h3>Followings</h3>
                  </div>
                </div>
              </ModalContent>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
}
