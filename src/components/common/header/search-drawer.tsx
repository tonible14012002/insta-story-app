import { ROUTES } from "@/constants";
import { useSearchUsers } from "@/hooks/useSearchUsers";
import { useDebounce } from "@/libs/use-debounce";
import { BaseResponse, User } from "@/schema";
import {
  Avatar,
  IconButton,
  List,
  ModalClose,
  TextFieldInput,
  TextFieldRoot,
  Typography,
} from "@consolelabs/core";
import { ArrowLeftLine } from "@consolelabs/icons";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";

export const SearchUserDrawer = () => {
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const searchDebounce = useDebounce(searchValue, 200);

  const { userCollections, size, setSize, isLoading } = useSearchUsers(
    {
      search: searchDebounce,
      page,
    },
    !!searchDebounce,
  );

  useEffect(() => {
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
                <div className="flex-1 flex flex-col gap-2">
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
              </Link>
            </ModalClose>
          );
        })}
      </Fragment>
    );
  };

  return (
    <div className="h-full overflow-y-auto flex flex-col">
      <div className="flex gap-4 items-center h-16 px-4">
        <ModalClose asChild>
          <IconButton variant="link" color="neutral">
            <ArrowLeftLine className="text-lg" />
          </IconButton>
        </ModalClose>
        <Typography level="h7">Search user</Typography>
      </div>
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
