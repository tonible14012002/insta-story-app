import { Modal, ModalContent, ModalTrigger } from "@mochi-ui/core";
import { useRouter } from "next/router";
import { useAuthContext } from "@/context/auth";
import { useFetchProfile } from "@/hooks/useFetchProfile";
import { PageSkeleton } from "@/components/common/skeleton";
import { useFetchFollower } from "@/hooks/useFetchFollower";
import { useState } from "react";
import { useFetchFollowing } from "@/hooks/useFetchFollowing";
import { Plus as PlusLine } from "lucide-react";
import * as Tab from "@radix-ui/react-tabs";
import { useFetchActiveStoriesByUserId } from "@/hooks/useFetchActiveStoryByUserId";
import { ProfileHeadSection } from "@/components/profile/profile-head-section";
import { ProfileStorySection } from "@/components/profile/profile-stories-section";

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
  const {
    stories,
    isFirstLoading: isStoryFirstLoading,
    mutate: storiesMutate,
  } = useFetchActiveStoriesByUserId(profile?.id, Boolean(!isFirstLoading));

  const isCurrentUserProfile = profile?.id === user?.id;

  if (isFirstLoading) {
    return <PageSkeleton />;
  }

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
            <ProfileStorySection
              isLoading={isStoryFirstLoading}
              stories={stories}
              isCurrentUserProfile={isCurrentUserProfile}
              onSuccess={storiesMutate}
            />
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
