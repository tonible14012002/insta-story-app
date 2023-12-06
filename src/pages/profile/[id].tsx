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
import { useFetchFollower } from "@/hooks/useFetchFollower";
import { useState } from "react";
import Link from "next/link";
import { ROUTES_MANIFEST } from "next/dist/shared/lib/constants";
import { ROUTES } from "@/constants/routes";
import { useFetchFollowing } from "@/hooks/useFetchFollowing";

export default function Profile() {
  const { query } = useRouter();
  const { user } = useAuthContext();
  const { profile, isFirstLoading, mutate } = useFetchProfile(
    query?.id as string | undefined
  );
  const [follow, setFollow] = useState("Follow");
  const [isOpenFollower, setIsOpenFollower] = useState(false);
  const [isOpenFollowing, setIsOpenFollowing] = useState(false);
  const { followers } = useFetchFollower(
    isOpenFollower ? (query?.id as string | undefined) : undefined
  );
  const { followings } = useFetchFollowing(
    isOpenFollower ? (query?.id as string | undefined) : undefined
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
            {profile?.nickname}
          </h5>
        </div>
        <div className="flex flex-col gap-2 ">
          <div className="grid grid-cols-2 gap-2">
            <Modal open={isOpenFollower} onOpenChange={setIsOpenFollower}>
              <ModalTrigger asChild>
                <div className="cursor-pointer flex items-center flex-col ">
                  <h3 className="font-bold text-2xl">
                    {profile?.total_followers}
                  </h3>
                  <h3 className="hover:underline">Followers</h3>
                </div>
              </ModalTrigger>
              <ModalContent>
                <div className="w-96 h-96 overflow-auto">
                  <div className="flex flex-row gap-2 justify-center items-center border-b-2 border-solid border-gray-400">
                    <h3 className="font-bold text-lg">
                      {profile?.total_followers}
                    </h3>
                    <h3>Followers</h3>
                  </div>
                  <div>
                    {followers?.map((follower) => (
                      <Link
                        onClick={() => setIsOpenFollower(false)}
                        href={ROUTES.USER_PROFILE(follower.id)}
                      >
                        <div className="flex flex-row gap-2 justify-left items-center border-b-2 border-solid border-gray-400 mt-3 p-2">
                          <Avatar src={follower.avatar as string} />
                          <h3 className="font-bold text-lg line-clamp-1">
                            {follower.nickname}
                          </h3>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </ModalContent>
            </Modal>
            <Modal open={isOpenFollowing} onOpenChange={setIsOpenFollowing}>
              <ModalTrigger asChild>
                <div className="cursor-pointer flex items-center flex-col">
                  <h3 className="font-bold text-2xl">
                    {profile?.total_followings}
                  </h3>
                  <h3 className="hover:underline">Followings</h3>
                </div>
              </ModalTrigger>
              <ModalContent>
                <div className="w-96 h-96 overflow-auto">
                  <div className="flex flex-row gap-2 justify-center items-center border-b-2 border-solid border-gray-400">
                    <h3 className="font-bold text-lg">
                      {profile?.total_followings}
                    </h3>
                    <h3>Followings</h3>
                  </div>
                  <div>
                    {followings?.map((following) => (
                      <Link
                        onClick={() => setIsOpenFollowing(false)}
                        href={ROUTES.USER_PROFILE(following.id)}
                      >
                        <div className="flex flex-row gap-2 justify-left items-center border-b-2 border-solid border-gray-400 mt-3 p-2">
                          <Avatar src={following.avatar as string} />
                          <h3 className="font-bold text-lg line-clamp-1">
                            {following.nickname}
                          </h3>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </ModalContent>
            </Modal>
          </div>
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
                {follow}
              </Button>
              <Button
                variant="outline"
                onClick={async () => {
                  try {
                    await identityService.unfollowUser(profile?.id as string);
                    mutate();
                  } catch (e) {}
                }}
              >
                Unfollow
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
