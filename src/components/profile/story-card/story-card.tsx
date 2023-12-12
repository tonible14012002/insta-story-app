import { useUrlDisclosure } from "@/hooks/use-url-disclosure";
import { BasicStory } from "@/schema/story";
import { Modal, ModalContent, ModalTrigger, Typography } from "@mochi-ui/core";
import { Eye } from "lucide-react";
import Image from "next/image";
import { StoryDetailView } from "./story-detail-view";
import clsx from "clsx";
import { overlay } from "@/utils/style";

const STORY_PARAM_KEY = "story";

export const StoryCard = (props: BasicStory) => {
  const { media_url, total_view, id } = props;
  const {
    isOpen,
    onOpen: _originOnOpen,
    onClose,
    value: selectedId,
  } = useUrlDisclosure(STORY_PARAM_KEY);
  const onOpen = () => {
    _originOnOpen(id);
  };
  const onOpenChange = (open: boolean) => {
    open ? onOpen() : onClose();
  };

  const showView = typeof total_view === "number";

  return (
    <Modal open={isOpen} onOpenChange={onOpenChange}>
      <ModalTrigger onClick={onOpen} asChild>
        <div className="relative">
          <div className="relative w-full pb-[100%]">
            <Image src={media_url} alt="" objectFit="cover" fill />
          </div>
          {showView && (
            <div className="absolute bottom-2 right-2 text-xl text-text-secondary flex items-center gap-1">
              <Eye className="text-white" />
              <Typography
                level="p6"
                className="max-w-[50px] line-clamp-1 text-white"
              >
                {total_view}
              </Typography>
            </div>
          )}
        </div>
      </ModalTrigger>
      <ModalContent className={clsx(overlay.screen)}>
        <StoryDetailView onClose={onClose} id={selectedId} />
      </ModalContent>
    </Modal>
  );
};
