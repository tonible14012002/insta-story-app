import { useRouter } from "next/router";
import { useCallback } from "react";

export const DEFAULT_DISCLOSURE_VALUE = "true";

export const useUrlDisclosure = (param: string = "isOpen") => {
  const { query, push } = useRouter();
  const value = (query?.[param] ?? "") as string;
  const isOpen = !!value;

  const onOpen = useCallback(
    (val: string = DEFAULT_DISCLOSURE_VALUE) => {
      const paramValue =
        typeof val === "string" ? val : DEFAULT_DISCLOSURE_VALUE;

      push(
        {
          query: {
            ...query,
            [param]: paramValue,
          },
        },
        undefined,
        { shallow: true },
      );
    },
    [param, push, query],
  );

  const onClose = useCallback(() => {
    const newQuery = { ...query };
    delete newQuery[param];
    push(
      {
        query: newQuery,
      },
      undefined,
      {
        shallow: true,
      },
    );
  }, [param, push, query]);

  const setIsOpen = useCallback(
    (open: boolean, value: string = DEFAULT_DISCLOSURE_VALUE) => {
      open ? onOpen(value) : onClose();
    },
    [onClose, onOpen],
  );

  return {
    onClose,
    isOpen,
    onOpen,
    value,
    setIsOpen,
  };
};
