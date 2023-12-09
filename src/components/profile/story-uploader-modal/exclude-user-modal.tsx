import { ROUTES } from "@/constants";
import { useAuthContext } from "@/context/auth";
import { useFetchFollower } from "@/hooks/useFetchFollower";
import { useSearchUsers } from "@/hooks/useSearchUsers";
import { useDebounce } from "@/libs/use-debounce";
import { BaseResponse, User } from "@/schema";
import {
  Avatar,
  Button,
  Checkbox,
  List,
  TextFieldDecorator,
  TextFieldInput,
  TextFieldRoot,
  Typography,
} from "@consolelabs/core";
import { UserSolid } from "@consolelabs/icons";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";

interface ExcludeUsersModalProps {
  onChange?: (_: string[]) => void;
  value: string[];
}

export const ExcludeUsersModal = (props: ExcludeUsersModalProps) => {
  const { value, onChange } = props;
  const [internalSelect, setInternalSelect] = useState<string[]>(value);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 300);

  const { userCollections, setSize, isLoading } = useSearchUsers(
    {
      search: debouncedSearch,
      page,
    },
    !!debouncedSearch,
  );

  const handleReachEndList = () => {
    if (search !== debouncedSearch) return;
    if (!userCollections || isLoading) return;
    const nextPage =
      userCollections[userCollections.length - 1].pageable?.next_page;
    if (nextPage) {
      setSize(nextPage);
    }
  };

  const renderUserList = (users: User[]) => (
    <>
      {users.map((user) => {
        return (
          <label
            key={user.id}
            htmlFor={`exclude_user_${user.id}`}
            className="flex text-left gap-4 mx-2 px-2 py-4 hover:bg-neutral-plain-hover rounded-lg items-center"
          >
            <Avatar src={user.avatar} />
            <div className="flex-1 flex gap-4 items-center">
              <div className="w-full flex flex-col">
                <Typography
                  level="h8"
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
              <div className="pr-2">
                <Checkbox
                  checked={internalSelect.includes(user.id)}
                  onChange={(state) =>
                    state
                      ? setInternalSelect([...internalSelect, user.id])
                      : setInternalSelect(
                          internalSelect.filter((id) => id !== user.id),
                        )
                  }
                  appearance="neutral"
                  id={`exclude_user_${user.id}`}
                />
              </div>
            </div>
          </label>
        );
      })}
    </>
  );

  const renderSearchItem = (userCollection: BaseResponse<User[]>) => {
    const { data: users } = userCollection;
    return <>{renderUserList(users)}</>;
  };

  const renderEmptyList = (
    <div className="h-full w-full flex items-center justify-center">
      <Typography level="p5" color="textSecondary">
        No Recent Search
      </Typography>
    </div>
  );

  useEffect(() => {
    // Reset serach page on search value change
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {}, []);

  return (
    <form
      className="h-full flex flex-col"
      onSubmit={(e) => {
        e.preventDefault();
        onChange?.(internalSelect);
      }}
    >
      <div className="p-4 space-y-4">
        <Typography>Exclude Users</Typography>
        <TextFieldRoot>
          <TextFieldDecorator>
            <UserSolid />
          </TextFieldDecorator>
          <TextFieldInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </TextFieldRoot>
      </div>
      <div className="overflow-y-auto flex-1">
        <List
          rootClassName="h-full"
          listClassName="space-y-1"
          onEndReachedThreshold={60}
          onEndReached={handleReachEndList}
          data={userCollections ?? []}
          renderItem={renderSearchItem}
          ListEmpty={renderEmptyList}
        />
      </div>
      <div className="fixed bottom-0 w-full p-4 bg-white">
        <Button variant="solid" color="neutral" className="w-full">
          Select
        </Button>
      </div>
    </form>
  );
};
