import { PropsWithChildren } from "react";
import Image from "next/image";
import { BasicStory, Story } from "@/schema/story";
import { Avatar, AvatarProps, Typography } from "@consolelabs/core";

export function StoryView(props: BasicStory) {
  return (
    <div className="h-[200px] shrink-0 border w-40 rounded-lg drop-shadow-sm overflow-hidden relative">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <div className="bg-inherit absolute left-2 top-2 w-10 h-10 border-4 border-primary-700 rounded-full">
        <Avatar src={props.owner.avatar} />
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="w-full h-full object-cover"
        src={props.media_url}
        alt={props.created_at}
      />
      <Typography className="absolute bottom-2 left-2 text-white" level="p5">
        {props.owner.nickname}
      </Typography>
    </div>
  );
}
