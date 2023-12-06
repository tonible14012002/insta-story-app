import { PropsWithChildren, useEffect, useState } from "react";
import { useAuthContext } from "@/context/auth";
import useIsMounted from "@/hooks/use-mouted";
import { identityService } from "@/apis";
import JWTManager from "@/libs/jwt-manager";
import { LoginForm } from "./login";
import { PageSkeleton } from "@/components/common/skeleton";

const AuthGuard = ({ children }: PropsWithChildren) => {
  const { user, setUser } = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const isMounted = useIsMounted();

  const handleTokenGuard = () => {
    const tokenIsValid = JWTManager?.getToken() && JWTManager?.isTokenValid();
    const refreshTokenIsValid =
      JWTManager?.getRefreshToken() && JWTManager?.isRefreshTokenValid();
    const isAuth = tokenIsValid || refreshTokenIsValid;

    if (isAuth) {
      if (user) {
        setIsAuthenticated(true);
        return;
      }

      const getMyProfile = async () => {
        try {
          setIsLoading(true);
          const result = await identityService.profile();
          if (isMounted()) {
            setUser(result.data);
            setIsAuthenticated(true);
          }
        } catch (e) {
          setIsAuthenticated(false);
        } finally {
          if (isMounted()) {
            setIsLoading(false);
          }
        }
      };
      getMyProfile();
    } else {
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  useEffect(handleTokenGuard, [setUser, user, isMounted]);

  return (
    <>
      {isLoading ? (
        <PageSkeleton />
      ) : isAuthenticated ? (
        children
      ) : (
        <div className="bg-white sm:container m-auto">
          <LoginForm />
        </div>
      )}
    </>
  );
};

export default AuthGuard;
