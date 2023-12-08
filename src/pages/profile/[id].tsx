import { identityService } from "@/apis";
import {
  Avatar,
  Button,
  List,
  Modal,
  ModalContent,
  ModalTrigger,
  SelectSeparator,
  Typography,
} from "@consolelabs/core";
import { useRouter } from "next/router";
import { useAuthContext } from "@/context/auth";
import { useFetchProfile } from "@/hooks/useFetchProfile";
import { PageSkeleton } from "@/components/common/skeleton";
import { useFetchFollower } from "@/hooks/useFetchFollower";
import { useState } from "react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { useFetchFollowing } from "@/hooks/useFetchFollowing";
import clsx from "clsx";
import { animation } from "@/utils/style";
import { MinusLine, PlusLine } from "@consolelabs/icons";
import { BasicUser } from "@/schema";

export default function Profile() {
  const { query } = useRouter();
  const { user } = useAuthContext();
  const { profile, isFirstLoading, mutate } = useFetchProfile(
    query?.id as string | undefined,
  );
  const [isOpenFollower, setIsOpenFollower] = useState(false);
  const [isOpenFollowing, setIsOpenFollowing] = useState(false);
  const [isLoadingFollow, setIsLoadingFollow] = useState(false);

  const { followers } = useFetchFollower(
    isOpenFollower ? (query?.id as string | undefined) : undefined,
  );
  const { followings } = useFetchFollowing(
    isOpenFollower ? (query?.id as string | undefined) : undefined,
  );

  if (isFirstLoading) {
    return <PageSkeleton />;
  }

  const isCurrentUserProfile = profile?.id === user?.id;

  const renderFollowButton = !isCurrentUserProfile && (
    <Button
      className="min-w-[120px]"
      variant={profile?.is_followed ? "outline" : "solid"}
      color={profile?.is_followed ? "neutral" : "primary"}
      loading={isLoadingFollow}
      onClick={async () => {
        const toggleFollow = profile?.is_followed
          ? identityService.unfollowUser(profile?.id)
          : identityService.followUser(profile?.id as string);
        try {
          setIsLoadingFollow(true);
          await toggleFollow;
          mutate();
        } catch (e) {
          console.log(e);
        } finally {
          setIsLoadingFollow(false);
        }
      }}
    >
      {profile?.is_followed ? (
        "Unfollow"
      ) : (
        <>
          <PlusLine /> Follow
        </>
      )}
    </Button>
  );

  const renderBasicUser = (user: BasicUser) => (
    <Link key={user.id} href={ROUTES.USER_PROFILE(user.id)}>
      <div className="flex flex-row gap-4 items-center hover:gap-5 transition-all">
        <Avatar src={user.avatar as string} />
        <Typography level="h7" className="line-clamp-1">
          @_{user.nickname}
        </Typography>
      </div>
    </Link>
  );

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-row items-start gap-4 h-[100px]">
        <div className="w-[100px] h-full shrink-0">
          <Avatar src={profile?.avatar as string} />
        </div>
        <div className="flex flex-col gap-4 justify-between h-full">
          <Typography
            level="h4"
            className="line-clamp-1 tracking-tighter max-w-[200px]"
          >
            @_{profile?.nickname}
          </Typography>
          <div className="flex h-10 gap-6 items-start">
            {renderFollowButton}
            <Modal open={isOpenFollower} onOpenChange={setIsOpenFollower}>
              <ModalTrigger asChild>
                <div className="cursor-pointer h-full flex flex-col">
                  <Typography level="h6" color="textPrimary">
                    {profile?.total_followers}
                  </Typography>
                  <Typography level="p6" color="textSecondary">
                    Followers
                  </Typography>
                </div>
              </ModalTrigger>
              <ModalContent
                className={clsx(
                  "focus:outline-none",
                  "duration-200",
                  "container",
                  "max-w-md",
                  ...animation.modalAnimation,
                )}
              >
                <div className="flex flex-row items-center gap-2 justify-center">
                  <Typography level="p5">
                    {profile?.total_followers} Followers
                  </Typography>
                </div>
                <SelectSeparator />
                <List
                  data={followers ?? []}
                  renderItem={renderBasicUser}
                  ListEmpty={
                    <Typography level="p4" className="m-auto w-fit">
                      No users
                    </Typography>
                  }
                />
              </ModalContent>
            </Modal>
            <Modal open={isOpenFollowing} onOpenChange={setIsOpenFollowing}>
              <ModalTrigger asChild>
                <div className="cursor-pointer flex flex-col">
                  <Typography level="h6" color="textPrimary">
                    {profile?.total_followings}
                  </Typography>
                  <Typography level="p6" color="textSecondary">
                    Followings
                  </Typography>
                </div>
              </ModalTrigger>
              <ModalContent
                className={clsx(
                  "focus:outline-none",
                  "duration-200",
                  "container",
                  "max-w-md",
                  ...animation.modalAnimation,
                )}
              >
                <div className="flex flex-row items-center gap-2 justify-center">
                  <Typography level="p5">
                    {profile?.total_followings} Followings
                  </Typography>
                </div>
                <SelectSeparator />
                <List
                  data={followings ?? []}
                  renderItem={renderBasicUser}
                  ListEmpty={
                    <Typography level="p4" className="m-auto w-fit">
                      No users
                    </Typography>
                  }
                />
              </ModalContent>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
}
