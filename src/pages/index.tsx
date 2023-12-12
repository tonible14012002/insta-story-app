import { identityService } from "@/apis";
import { PageSkeleton } from "@/components/common/skeleton";
import { useAuthContext } from "@/context/auth";
import { useFetchActiveStoriesFeed } from "@/hooks/useFetchActiveStoryFeed";
import { BasicStory } from "@/schema/story";
import { Avatar, Typography, Button } from "@mochi-ui/core";
import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const { user } = useAuthContext();
  const { stories, isLoading } = useFetchActiveStoriesFeed(user?.id);

  if (isLoading) return <PageSkeleton />;

  return (
    <div className="p-4 flex flex-col gap-4">
      {stories?.map((story) => {
        return <StoryViewFeedCard key={story.id} story={story} />;
      })}
    </div>
  );
}

interface StoryViewFeedProps {
  story: BasicStory;
  onFollowChanged?: () => void;
}

const StoryViewFeedCard = (props: StoryViewFeedProps) => {
  const { story, onFollowChanged } = props;
  const [isLoadingFollow, setIsLoadingFollow] = useState(false);
  const isCurrentUser = story.owner.is_followed;
  const renderFollowButton = isCurrentUser ? null : (
    <Button
      variant="outline"
      color="neutral"
      loading={isLoadingFollow}
      className="!text-[10px] h-6 !px-2 rounded-md"
      onClick={async () => {
        const toggleFollow = story.owner?.is_followed
          ? identityService.unfollowUser(story.owner?.id)
          : identityService.followUser(story.owner?.id as string);
        try {
          setIsLoadingFollow(true);
          await toggleFollow;
          await onFollowChanged?.();
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
    <div className="flex gap-3 items-start w-full" key={story.id}>
      <div className="flex flex-col justify-start gap-2 items-center h-full">
        <div>
          <Avatar src={story.owner.avatar ?? ""} size="sm" />
        </div>
        <div className="flex-1 w-px bg-text-tertiary h-full" />
      </div>
      <div className="flex flex-col w-full">
        <div className="flex justify-between w-full">
          <div className="w-full">
            <Typography
              className="max-w-[100px] line-clamp-1 !text-[12px]"
              level="h8"
            >
              @_{story.owner.nickname}
            </Typography>
          </div>
          {renderFollowButton}
        </div>
        <Typography level="p6">{story.caption}</Typography>
        <div className="relative w-full min-h-[300px] mt-3 rounded-lg overflow-hidden border">
          <Image
            src={story.media_url ?? ""}
            alt={story.alt_text}
            layout="responsive"
            width={1000}
            height={400}
          />
        </div>
        <div className="mt-2">
          <Typography color="textSecondary" level="p6">
            {story.total_view}
            {story.total_view > 0 ? " view" : " views"}
          </Typography>
        </div>
      </div>
    </div>
  );
};
