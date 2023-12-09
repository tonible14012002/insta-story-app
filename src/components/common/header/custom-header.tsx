import { IconButton, ModalClose, Typography } from "@consolelabs/core";
import { ArrowLeftLine } from "@consolelabs/icons";
import clsx from "clsx";
import Link from "next/link";
import { Fragment, PropsWithChildren, ReactNode } from "react";

interface CustomHeaderProps extends PropsWithChildren {
  onBack?: () => void;
  backHref?: string;
  title?: ReactNode;
  closeModalOnBack?: boolean;
  className?: string;
}

export const CustomHeader = (props: CustomHeaderProps) => {
  const {
    onBack,
    backHref,
    title,
    closeModalOnBack = false,
    className,
    children,
  } = props;

  const renderBackLinkWrapper = (childNode: ReactNode) => {
    if (backHref) {
      return <Link href={backHref}>{childNode}</Link>;
    }
    return childNode;
  };
  const CloseModal = closeModalOnBack ? ModalClose : Fragment;

  const showBackButton = backHref || onBack || closeModalOnBack;

  return (
    <div className={clsx("flex gap-2 items-center h-16 px-4", className)}>
      {showBackButton &&
        renderBackLinkWrapper(
          <CloseModal>
            <IconButton variant="ghost" color="neutral" onClick={onBack}>
              <ArrowLeftLine className="text-lg" />
            </IconButton>
          </CloseModal>,
        )}
      {typeof title === "string" ? (
        <Typography level="h6" className="tracking-tight">
          {title}
        </Typography>
      ) : (
        title
      )}
      {children}
    </div>
  );
};