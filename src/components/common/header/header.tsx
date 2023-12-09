import { ROUTES } from "@/constants/routes";
import { useAuthContext } from "@/context/auth";
import { Avatar, IconButton, Typography } from "@consolelabs/core";
import { LogoutSolid, ArrowLeftLine, AddUserSolid } from "@consolelabs/icons";
import {
  Modal,
  ModalTrigger,
  ModalClose,
  ModalTitle,
  ModalContent,
  TextFieldRoot,
  TextFieldDecorator,
  TextFieldInput,
} from "@consolelabs/core";
import Link from "next/link";
import { useRouter } from "next/router";
import { SearchUserDrawer } from "./search-drawer";
import clsx from "clsx";
import { animation } from "@/utils/style";

export function Header() {
  const { user, logout } = useAuthContext();
  const { pathname } = useRouter();
  const renderAuthHeader = !user ? null : (
    <Typography level="h4">Story Inbox</Typography>
  );

  return (
    <header className="h-[64px] fixed top-0 z-10 w-full sm:container p-4 bg-white border-b flex items-center">
      {!user ? (
        renderAuthHeader
      ) : (
        <div className="flex items-center gap-2 w-full ">
          {pathname !== ROUTES.HOME && (
            <Link className="flex" href={ROUTES.HOME}>
              <IconButton variant="ghost" color="neutral">
                <ArrowLeftLine width={20} height={20} />
              </IconButton>
            </Link>
          )}
          <Link
            className="flex w-fit h-fit "
            href={ROUTES.USER_PROFILE(user.id)}
          >
            <Avatar src="" />
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
            <Modal>
              <ModalTrigger>
                <IconButton variant="ghost">
                  <AddUserSolid width={20} height={20} />
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

            <IconButton variant="ghost" color="neutral" onClick={logout}>
              <LogoutSolid width={20} height={20} />
            </IconButton>
          </div>
        </div>
      )}
    </header>
  );
}
