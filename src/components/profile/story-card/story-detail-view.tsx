import { identityService } from "@/apis";
import { CustomHeader } from "@/components/common/header/custom-header";
import { PageSkeleton } from "@/components/common/skeleton";
import { ROUTES } from "@/constants";
import { useAuthContext } from "@/context/auth";
import { useFetchStoryDetail } from "@/hooks/useFetchStoryDetail";
import { useViewStory } from "@/hooks/useViewStory";
import {
  Avatar,
  Button,
  IconButton,
  Modal,
  ModalClose,
  ModalContent,
  ModalTitle,
  ModalTrigger,
  Typography,
} from "@mochi-ui/core";
import { Eye } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { formatDistance } from "date-fns";

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
        onBack={onClose}
        backButtonClassName="text-white"
      >
        <div className="flex-1" />
        <Modal>
          <ModalTrigger>
            <IconButton size="sm" variant="link" className="flex items-center">
              <Typography className="text-white" level="p6" fontWeight="sm">
                {story.total_view} {story.total_view > 1 ? "views" : "view"}
              </Typography>
              <Eye className="text-white" width={16} height={16} />
            </IconButton>
          </ModalTrigger>
          <ModalContent className="h-[70%] translate-y-0 !top-auto bottom-0 rounded-b-none container">
            <ModalTitle asChild>
              <Typography level="h8">Viewers</Typography>
            </ModalTitle>
            <div className="w-full h-px bg-gray-400 my-4" />
            <div className="-mx-4 px-2">
              {story.views.map((view) => {
                const { pkid, user, viewed_at } = view;
                return (
                  <Link
                    key={user.id}
                    href={ROUTES.USER_PROFILE(user.id)}
                    className="flex flex-row items-center justify-between  hover:bg-neutral-plain-hover rounded-md group"
                  >
                    <div className="flex flex-row gap-4 items-center group-hover:gap-5 transition-all px-2 py-2">
                      <Avatar src={user.avatar ?? ""} />
                      <Typography level="h8" className="line-clamp-1">
                        @_{user.nickname}
                      </Typography>
                    </div>
                    <Typography
                      level="p6"
                      color="textSecondary"
                      className="pr-2"
                    >
                      {formatDistance(new Date(viewed_at), Date.now())} ago
                    </Typography>
                  </Link>
                );
              })}
            </div>
          </ModalContent>
        </Modal>
      </CustomHeader>
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
        <Typography
          className="text-white max-w-[300px] min-h-[20px]"
          level="p5"
        >
          {story.caption}
        </Typography>
      </div>
    </div>
  );
};
