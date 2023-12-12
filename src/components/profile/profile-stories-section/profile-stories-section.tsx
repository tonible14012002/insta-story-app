import { BasicStory, Story } from "@/schema/story";
import { animation } from "@/utils/style";
import { Modal, ModalContent, ModalTrigger } from "@mochi-ui/core";
import { Plus as PlusLine } from "lucide-react";
import clsx from "clsx";
import { StoryUploaderModal } from "../story-uploader-modal";
import { Skeleton } from "@mochi-ui/core";
import { StoryCard } from "../story-card";

interface ProfileStorySection {
  stories?: BasicStory[];
  isLoading?: boolean;
  isCurrentUserProfile?: boolean;
  onSuccess?: () => void;
}

export const ProfileStorySection = (props: ProfileStorySection) => {
  const { stories, isCurrentUserProfile, onSuccess } = props;

  return (
    <div className="grid grid-cols-2">
      {!stories ? (
        true
      ) : (
        <>
          {stories.map((props) => (
            <StoryCard {...props} key={props.id} />
          ))}
        </>
      )}
    </div>
  );
};
