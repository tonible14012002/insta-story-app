import { identityService } from "@/apis";
import {
  Avatar,
  Button,
  List,
  Modal,
  ModalClose,
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
import { PlusLine } from "@consolelabs/icons";
import { BasicUser, User } from "@/schema";
import * as Tab from "@radix-ui/react-tabs";
import { StoryUploaderModal } from "@/components/profile/story-uploader-modal";
import { useFetchActiveStoriesByUserId } from "@/hooks/useFetchActiveStoryByUserId";

export default function Profile() {
  const { query } = useRouter();
  const { user } = useAuthContext();
  const { profile, isFirstLoading, mutate } = useFetchProfile(
    query?.id as string | undefined,
  );
  const [isOpenFollower, setIsOpenFollower] = useState(false);
  const [isOpenFollowing, setIsOpenFollowing] = useState(false);

  const { followers, isLoading: isLoadingFollowers } = useFetchFollower(
    isOpenFollower ? (query?.id as string) : undefined,
  );
  const { followings, isLoading: isLoadingFollowings } = useFetchFollowing(
    isOpenFollowing ? (query?.id as string) : undefined,
  );
  const { stories, isFirstLoading: isStoryFirstLoading } =
    useFetchActiveStoriesByUserId(profile?.id, Boolean(profile?.id));

  if (isFirstLoading) {
    return <PageSkeleton />;
  }

  const isCurrentUserProfile = profile?.id === user?.id;

  return (
    <div className="p-4 space-y-8">
      <ProfileHeadSection
        profile={profile}
        followers={followers}
        followings={followings}
        onFollowChange={mutate}
        onOpenFollowerChange={setIsOpenFollower}
        onOpenFollowingChange={setIsOpenFollowing}
        isLoadingFollowers={isLoadingFollowers}
        isLoadingFollowings={isLoadingFollowings}
        isOpenFollower={isOpenFollower}
        isOpenFollowing={isOpenFollowing}
      />
      <div>
        <Tab.Root defaultValue="stories">
          <Tab.List className="flex bg-neutral-plain-hover -mx-4">
            <Tab.Trigger
              value="stories"
              className="flex-1 py-3 transition-all border-b-neutral-solid-hover data-[state=active]:border-b-2 data-[state=active]:!text-neutral-solid data-[state=inactive]:!text-text-secondary text-center cursor-pointer text-md"
            >
              Stories
            </Tab.Trigger>
            <Tab.Trigger
              value="archieved"
              className="flex-1 py-3 transition-all border-b-neutral-solid-hover data-[state=active]:border-b-2 data-[state=active]:!text-neutral-solid data-[state=inactive]:!text-text-secondary text-center cursor-pointer text-md"
            >
              Achieved
            </Tab.Trigger>
          </Tab.List>
          <Tab.Content value="stories" className="-mx-4">
            <div className="grid grid-cols-2">
              {isCurrentUserProfile && (
                <Modal>
                  <ModalTrigger asChild>
                    <div className="cursor-pointer h-[300px] w-full border-br border-neutral-0 flex items-center justify-center">
                      <PlusLine width={30} height={30} />
                    </div>
                  </ModalTrigger>
                  <ModalContent
                    className={clsx(
                      ...animation.modalAnimation,
                      "container h-screen !rounded-none",
                      "!p-0",
                    )}
                  >
                    <StoryUploaderModal />
                  </ModalContent>
                </Modal>
              )}
              {Array(3)
                .fill(null)
                .map((_, index) => (
                  <div
                    key={index}
                    className="bg-neutral-300 animate-pulse h-[300px] w-full odd:border-r border-neutral-0 border-b"
                  />
                ))}
            </div>
          </Tab.Content>
          <Tab.Content value="archieved" className="-mx-4">
            <div className="grid grid-cols-2">
              <div className="h-[300px] w-full border-br border-neutral-0 flex items-center justify-center">
                <PlusLine width={30} height={30} />
              </div>
              {Array(3)
                .fill(null)
                .map((_, index) => (
                  <div
                    key={index}
                    className="bg-neutral-300 animate-pulse h-[300px] w-full odd:border-r border-neutral-0 border-b"
                  />
                ))}
            </div>
          </Tab.Content>
        </Tab.Root>
      </div>
    </div>
  );
}

interface ProfileHeadSectionProps {
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

const ProfileHeadSection = (props: ProfileHeadSectionProps) => {
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
    <Modal>
      <ModalTrigger asChild>
        <Button className="min-w-[120px]" variant="outline" color="secondary">
          Edit Profile
        </Button>
      </ModalTrigger>
      <ModalContent
        className={clsx("duration-200", ...animation.modalAnimation)}
      >
        Edit Profile
      </ModalContent>
    </Modal>
  );

  const userItemRenderer = (user: BasicUser) => (
    <Link key={user.id} href={ROUTES.USER_PROFILE(user.id)}>
      <ModalClose asChild>
        <div className="flex flex-row gap-4 items-center hover:gap-5 transition-all px-2 hover:bg-neutral-plain-hover py-2 rounded-md">
          <Avatar src={user.avatar as string} />
          <Typography level="h7" className="line-clamp-1">
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
      <div className="flex flex-1 flex-col gap-4 justify-between h-full">
        <Typography
          level="h4"
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
