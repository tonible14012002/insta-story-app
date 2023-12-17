import type { User, BasicUser } from "@/schema";
import { useAuthContext } from "@/context/auth";
import {
  Typography,
  Modal,
  ModalContent,
  ModalTrigger,
  ModalClose,
  Button,
  List,
  SelectSeparator,
  Avatar,
} from "@mochi-ui/core";
import { identityService } from "@/apis";
import { Plus as PlusLine } from "lucide-react";
import { animation } from "@/utils/style";
import { ROUTES } from "@/constants";
import { useState } from "react";
import clsx from "clsx";
import Link from "next/link";

export interface ProfileHeadSectionProps {
  profile?: User;
  onFollowChange?: () => void;
  isOpenFollower?: boolean;
  onOpenFollowerChange?: (_: boolean) => void;
  isOpenFollowing?: boolean;
  onOpenFollowingChange?: (_: boolean) => void;
  isLoadingFollowers: boolean;
  isLoadingFollowings: boolean;
  followers?: BasicUser[];
  followings?: BasicUser[];
}

export const ProfileHeadSection = (props: ProfileHeadSectionProps) => {
  const { user } = useAuthContext();
  const {
    followers,
    followings,
    profile,
    onFollowChange,
    onOpenFollowerChange,
    onOpenFollowingChange,
    isOpenFollower,
    isOpenFollowing,
    isLoadingFollowers,
    isLoadingFollowings,
  } = props;
  const isCurrentUserProfile = user?.id === profile?.id;
  const [isLoadingFollow, setIsLoadingFollow] = useState(false);

  const renderFollowButton = (
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
          await onFollowChange?.();
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

  const renderEditProfileModal = (
    <Link href={ROUTES.USER_PROFILE_SETTING}>
      <Button className="min-w-[120px]" variant="outline" color="secondary">
        Edit Profile
      </Button>
    </Link>
  );

  const userItemRenderer = (user: BasicUser) => (
    <Link key={user.id} href={ROUTES.USER_PROFILE(user.id)}>
      <ModalClose asChild>
        <div className="flex flex-row gap-4 items-center hover:gap-5 transition-all px-2 hover:bg-neutral-plain-hover py-2 rounded-md">
          <Avatar src={user.avatar ?? ""} />
          <Typography level="h8" className="line-clamp-1">
            @_{user.nickname}
          </Typography>
        </div>
      </ModalClose>
    </Link>
  );

  return (
    <div className="flex flex-row items-start gap-4 h-[100px]">
      <div className="w-[100px] h-full shrink-0">
        <Avatar src={profile?.avatar as string} />
      </div>
      <div className="flex flex-1 flex-col gap-4 pt-2 justify-between h-full">
        <Typography
          level="h5"
          className="line-clamp-1 tracking-tighter max-w-[90%]"
        >
          @_{profile?.nickname}
        </Typography>
        <div className="flex h-10 gap-6 items-start">
          {isCurrentUserProfile ? renderEditProfileModal : renderFollowButton}
          <Modal open={isOpenFollower} onOpenChange={onOpenFollowerChange}>
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
                "h-[500px]",
                "overflow-y-auto",
                "no-scrollbar",
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
                loading={isLoadingFollowers}
                rootClassName="-mx-2 -mb-2"
                listClassName="space-y-1"
                data={followers ?? []}
                renderItem={userItemRenderer}
                ListEmpty={
                  <Typography level="p4" className="m-auto w-fit">
                    No users
                  </Typography>
                }
              />
            </ModalContent>
          </Modal>
          <Modal open={isOpenFollowing} onOpenChange={onOpenFollowingChange}>
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
                "h-[500px]",
                "overflow-y-auto",
                "no-scrollbar",
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
                loading={isLoadingFollowings}
                rootClassName="-mx-2 -mb-2"
                data={followings ?? []}
                renderItem={userItemRenderer}
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
  );
};
