import useAuth from "@/entities/auth/hooks/useAuth";
import { memo, type FC, type ReactNode } from "react";
import { Navigate } from "react-router";

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard: FC<AuthGuardProps> = ({ children }) => {
  const { stage, user } = useAuth();
  switch (stage) {
    case "error":
      return <Navigate to="/" />;
    case "idle": {
      if (!user) {
        return <Navigate to="/" />;
      }
      break;
    }
    case "loading":
      return null;
    case "success":
      return <>{children}</>;
    default:
      return null;
  }
};

export default memo(AuthGuard);
