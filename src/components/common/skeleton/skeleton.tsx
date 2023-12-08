import clsx from "clsx";

interface SkeletonProps {
  className?: string;
}

export const Skeleton = (props: SkeletonProps) => {
  const { className } = props;

  return (
    <div
      className={clsx(className, "animate-pulse bg-gray-800 bg-opacity-10")}
    />
  );
};
