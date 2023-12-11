import { BasicStory, Story } from "@/schema/story";
import { animation } from "@/utils/style";
import { Modal, ModalContent, ModalTrigger } from "@consolelabs/core";
import { PlusLine } from "@consolelabs/icons";
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
            <StoryUploaderModal onSuccess={onSuccess} />
          </ModalContent>
        </Modal>
      )}
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
