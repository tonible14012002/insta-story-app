import { CustomHeader } from "@/components/common/header/custom-header";
import { PageSkeleton } from "@/components/common/skeleton";
import { useFetchStoryDetail } from "@/hooks/useFetchStoryDetail";
import { useViewStory } from "@/hooks/useViewStory";
import { Typography } from "@mochi-ui/core";
import Image from "next/image";

interface StoryDetailViewProps {
  onClose: () => void;
  id: string;
}

export const StoryDetailView = (props: StoryDetailViewProps) => {
  const { onClose, id } = props;
  const { story, isFirstLoading } = useFetchStoryDetail(id);

  useViewStory(id, Boolean(story?.id));

  if (isFirstLoading || !story) return <PageSkeleton />;

  return (
    <div className="relative w-full h-full shadow-inner-y">
      <CustomHeader
        title={<Typography level="h7">Story</Typography>}
        className=""
        onBack={onClose}
      />
      <div className="absolute inset-0 -z-10 w-full h-full max-w-full  max-h-full">
        <Image
          src={story.media_url ?? ""}
          alt={story.alt_text ?? ""}
          objectFit="cover"
          width={1000}
          height={1000}
        />
      </div>
    </div>
  );
};
