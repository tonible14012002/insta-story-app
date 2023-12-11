import { BasicStory } from "@/schema/story";
import { Typography } from "@consolelabs/core";
import { EyeShowSolid } from "@consolelabs/icons";
import Image from "next/image";

export const StoryCard = (props: BasicStory) => {
  const { media_type, media_url, total_view } = props;
  const showView = typeof total_view === "number";

  return (
    <div className="relative">
      <div className="">
        <Image
          src={media_url}
          layout="responsive"
          alt=""
          width={300}
          height={400}
        />
      </div>
      {showView && (
        <div className="absolute bottom-2 right-2 text-xl text-text-secondary flex items-center gap-1">
          <EyeShowSolid />
          <Typography
            level="p6"
            color="textSecondary max-w-[50px] line-clamp-1"
          >
            {total_view}
          </Typography>
        </div>
      )}
    </div>
  );
};
