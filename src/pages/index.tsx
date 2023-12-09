import {
  IconButton,
  Modal,
  ModalContent,
  ModalTrigger,
  Avatar,
} from "@consolelabs/core";
import { AddUserSolid, ArrowDownLine, ArrowUpLine } from "@consolelabs/icons";

export default function Home() {
  return (
    <div className="p-2 flex flex-col gap-4">
      {/* <div className="h-24 overflow-x-auto">
        <div className="border-solid flex justify-start items-center gap-3 w-fit">
          {new Array(10).fill(null).map((_, index) => (
            <Modal key={index}>
              <ModalTrigger asChild>
                <div
                  key={index}
                  className="rounded-full w-16 h-16 bg-neutral-400 cursor-pointer border-red-700 border-solid border-2"
                >
                  <Avatar src=""></Avatar>
                </div>
              </ModalTrigger>
              <ModalContent>
                <div className="w-96 h-[80vh]"></div>
              </ModalContent>
            </Modal>
          ))}
        </div>
      </div> */}
      <div className="flex gap-4 py-4 items-center flex-col w-full">
        {new Array(10).fill(null).map((_, index) => (
          <div
            key={index}
            className="w-[300px] h-[400px] bg-neutral-400 rounded-lg"
          />
        ))}
      </div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 space-y-4">
        <IconButton variant="ghost">
          <ArrowUpLine />
        </IconButton>
        <IconButton variant="outline" color="secondary">
          <AddUserSolid />
        </IconButton>
        <IconButton variant="ghost">
          <ArrowDownLine />
        </IconButton>
      </div>
    </div>
  );
}
