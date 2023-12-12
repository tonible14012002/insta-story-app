import { identityService } from "@/apis";
import { CustomHeader } from "@/components/common/header/custom-header";
import { PageSkeleton } from "@/components/common/skeleton";
import { useAuthContext } from "@/context/auth";
import { useFetchStoryDetail } from "@/hooks/useFetchStoryDetail";
import { useViewStory } from "@/hooks/useViewStory";
import { Avatar, Button, Typography } from "@mochi-ui/core";
import Image from "next/image";
import { useState } from "react";

interface StoryDetailViewProps {
  onClose: () => void;
  id: string;
}

export const StoryDetailView = (props: StoryDetailViewProps) => {
  const { onClose, id } = props;
  const { story, mutate, isFirstLoading } = useFetchStoryDetail(id);
  const { user } = useAuthContext();
  const isCurrentUser = user?.id === story?.owner.id;
  const [isLoadingFollow, setIsLoadingFollow] = useState(false);

  useViewStory(id, Boolean(story?.id));

  if (isFirstLoading || !story) return <PageSkeleton />;
  const renderFollowButton = isCurrentUser ? null : (
    <Button
      variant="outline"
      color="neutral"
      loading={isLoadingFollow}
      className="text-xs h-6 p-1 rounded-md"
      onClick={async () => {
        const toggleFollow = story.owner?.is_followed
          ? identityService.unfollowUser(story.owner?.id)
          : identityService.followUser(story.owner?.id as string);
        try {
          setIsLoadingFollow(true);
          await toggleFollow;
          await mutate();
        } catch (e) {
          console.log(e);
        } finally {
          setIsLoadingFollow(false);
        }
      }}
    >
      Follow
    </Button>
  );

  return (
    <div className="relative w-full h-full shadow-inner-y bg-black">
      <CustomHeader
        title={
          <Typography className="text-white" level="h6">
            Story
          </Typography>
        }
        className=""
        onBack={onClose}
        backButtonClassName="text-white"
      />
      <Image
        src={story.media_url ?? ""}
        alt={story.alt_text ?? ""}
        layout="responsive"
        height={1000}
        width={1000}
      />
      <div className="absolute bottom-8 left-4 flex flex-col gap-4">
        <div className="flex gap-3 items-center">
          <Avatar src={story.owner.avatar ?? ""} />
          <div className="flex flex-col">
            <Typography
              className="text-white max-w-[100px] line-clamp-1"
              level="h8"
            >
              @_{story.owner.nickname}
            </Typography>
            <Typography className="text-white opacity-60" level="p6">
              {story.owner.total_followers}
              {story.owner.total_followers > 0 ? " follower" : " followers"}
            </Typography>
          </div>
          {renderFollowButton}
        </div>
        <Typography className="text-white max-w-[300px]" level="p5">
          aoijsdoajisdas idj aodajsd asjdoai sdoiajsd oiajsd o{story.caption}
        </Typography>
      </div>
    </div>
  );
};
