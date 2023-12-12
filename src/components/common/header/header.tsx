import { ROUTES } from "@/constants/routes";
import { useAuthContext } from "@/context/auth";
import {
  Avatar,
  IconButton,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Typography,
} from "@mochi-ui/core";
import {
  LogOut as LogoutSolid,
  ArrowLeft as ArrowLeftLine,
  Search as SearchLine,
  Menu,
} from "lucide-react";
import { Modal, ModalTrigger, ModalContent } from "@mochi-ui/core";
import Link from "next/link";
import { useRouter } from "next/router";
import { SearchUserDrawer } from "./search-drawer";
import clsx from "clsx";
import { animation } from "@/utils/style";
import { StoryUploaderModal } from "@/components/profile/story-uploader-modal";
import { Plus } from "lucide-react";
import { useState } from "react";

export function Header() {
  const { user, logout } = useAuthContext();
  const { pathname } = useRouter();
  const [openMenu, setOpenMenu] = useState(false);
  const renderAuthHeader = !user ? null : (
    <Typography level="h4">Story Inbox</Typography>
  );

  return (
    <header className="h-[64px] fixed top-0 z-10 w-full container p-4 bg-white border-b flex items-center">
      {!user ? (
        renderAuthHeader
      ) : (
        <div className="flex items-center gap-2 w-full ">
          {pathname !== ROUTES.HOME && (
            <Link className="flex" href={ROUTES.HOME}>
              <IconButton variant="ghost" color="neutral">
                <ArrowLeftLine width={18} height={18} />
              </IconButton>
            </Link>
          )}
          <Link
            className="flex w-fit h-fit "
            href={ROUTES.USER_PROFILE(user.id)}
          >
            <Avatar src={user.avatar ?? ""} />
          </Link>
          <div className="flex flex-col line-clamp-1">
            <Typography className="line-clamp-1" level="h7">
              @_{user.nickname}
            </Typography>
            <Typography level="p6">
              {user.first_name + user.last_name}
            </Typography>
          </div>
          <div className="flex-1" />
          <div className="flex h-fit gap-4">
            <div className="relative">
              <IconButton
                variant="ghost"
                color="neutral"
                onClick={() => setOpenMenu((prev) => !prev)}
              >
                <Menu width={18} height={18} />
              </IconButton>
              {openMenu && (
                <div className="absolute top-14 border right-0 p-2 bg-white shadow-md flex flex-col !rounded-full gap-2">
                  <Modal>
                    <ModalTrigger>
                      <IconButton variant="ghost">
                        <SearchLine width={18} height={18} />
                      </IconButton>
                    </ModalTrigger>
                    <ModalContent
                      className={clsx(
                        "container !rounded-none",
                        "h-screen",
                        "!p-0",
                        ...animation.modalAnimation,
                      )}
                    >
                      <SearchUserDrawer />
                    </ModalContent>
                  </Modal>

                  <Modal>
                    <ModalTrigger asChild>
                      <IconButton variant="ghost">
                        <Plus width={18} height={18} />
                      </IconButton>
                    </ModalTrigger>
                    <ModalContent
                      className={clsx(
                        ...animation.modalAnimation,
                        "container h-screen !rounded-none",
                        "!p-0",
                      )}
                    >
                      <StoryUploaderModal />
                    </ModalContent>
                  </Modal>

                  {/* Logout */}
                  <IconButton variant="ghost" color="danger" onClick={logout}>
                    <LogoutSolid width={18} height={18} />
                  </IconButton>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
