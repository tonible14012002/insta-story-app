import { identityService } from "@/apis";
import { ROUTES } from "@/constants";
import { useSearchUsers } from "@/hooks/useSearchUsers";
import { useDebounce } from "@/libs/use-debounce";
import { BaseResponse, User } from "@/schema";
import {
  Avatar,
  Button,
  IconButton,
  List,
  ModalClose,
  TextFieldInput,
  TextFieldRoot,
  Typography,
} from "@consolelabs/core";
import { ArrowLeftLine, PlusLine } from "@consolelabs/icons";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { CustomHeader } from "./custom-header";
import { useRouter } from "next/router";

export const SearchUserDrawer = () => {
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const searchDebounce = useDebounce(searchValue, 200);
  const [loadingFollow, setLoadingFollow] = useState(false);
  const [clickedFolowId, setClickedFollowId] = useState<string>();
  const { back } = useRouter();

  const { userCollections, setSize, mutate, isLoading } = useSearchUsers(
    {
      search: searchDebounce,
      page,
    },
    !!searchDebounce,
  );

  useEffect(() => {
    // Reset serach page on search value change
    setPage(1);
  }, [searchDebounce]);

  const renderEmptyList = (
    <div className="h-full w-full flex items-center justify-center">
      <Typography level="p5" color="textSecondary">
        No Recent Search
      </Typography>
    </div>
  );

  const handleReachEndList = () => {
    if (searchValue !== searchDebounce) return;
    if (!userCollections || isLoading) return;
    const nextPage =
      userCollections[userCollections.length - 1].pageable?.next_page;
    if (nextPage) {
      setSize(nextPage);
    }
  };

  const renderFollowButton = (user: User) => (
    <Button
      size="sm"
      color={user.is_followed ? "neutral" : "primary"}
      loading={loadingFollow && user.id === clickedFolowId}
      variant="outline"
      onClick={async (e) => {
        e.preventDefault();
        setLoadingFollow(true);
        setClickedFollowId(user.id);

        const toggleFollow = user.is_followed
          ? identityService.unfollowUser(user.id)
          : identityService.followUser(user.id);
        try {
          // setIsLoadingFollow(true);
          await toggleFollow;
          // mutate();
        } catch (e) {
          console.log(e);
        } finally {
          await mutate();
          setLoadingFollow(false);
          setClickedFollowId(undefined);
        }
      }}
    >
      {user.is_followed ? (
        <>Unfollow</>
      ) : (
        <>
          <PlusLine />
          Follow
        </>
      )}
    </Button>
  );

  const renderSearchItem = (userCollection: BaseResponse<User[]>) => {
    const { data: users } = userCollection;
    return (
      <Fragment>
        {users.map((user) => {
          return (
            <ModalClose asChild key={user.id}>
              <Link
                href={ROUTES.USER_PROFILE(user.id)}
                className="flex gap-4 mx-2 px-2 py-4 hover:bg-neutral-plain-hover rounded-lg items-center"
              >
                <Avatar src={user.avatar} size="lg" />
                <div className="flex-1 flex gap-4 items-center">
                  <div className="w-full flex flex-col gap-2">
                    <Typography
                      level="h7"
                      className="line-clamp-1 tracking-tighter"
                    >
                      @_{user.nickname}
                    </Typography>
                    <Typography
                      level="p6"
                      className="line-clamp-1 flex gap-1"
                      color="textSecondary"
                    >
                      <span>{user.total_followers}</span>
                      <span>
                        {user.total_followers > 1 ? " Followers" : "Follower"}
                      </span>
                    </Typography>
                  </div>
                  {renderFollowButton(user)}
                </div>
              </Link>
            </ModalClose>
          );
        })}
      </Fragment>
    );
  };

  return (
    <div className="h-full overflow-y-auto flex flex-col">
      <CustomHeader title="Search Users" closeModalOnBack />
      <div className="px-4 border-b">
        <TextFieldRoot size="lg">
          <TextFieldInput
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Type in username, email, ..."
          />
        </TextFieldRoot>
      </div>
      <div className="flex-1 overflow-y-auto">
        <List
          rootClassName="h-full pt-4"
          listClassName="space-y-1"
          onEndReachedThreshold={60}
          onEndReached={handleReachEndList}
          data={userCollections ?? []}
          renderItem={renderSearchItem}
          ListEmpty={renderEmptyList}
        />
      </div>
    </div>
  );
};
