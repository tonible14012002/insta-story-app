import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { User } from "@/schema";
import JWTManager from "@/libs/jwt-manager";

export type AuthContextValue = {
  user?: User;
  setUser: (_: User) => void;
  logout?: () => void;
};

export const AuthContext = createContext<AuthContextValue>({
  user: undefined,
  setUser: (_: User) => {},
});

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User>();
  const logout = useCallback(() => {
    setUser(undefined);
    JWTManager.clearRefreshToken();
    JWTManager.clearToken();
  }, []);

  const authState = useMemo(
    () => ({
      user,
      setUser,
      logout,
    }),
    [logout, user],
  );

  return (
    <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
  );
};
