import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import useAuth from "@/entities/auth/hooks/useAuth";
import { memo } from "react";
import { Outlet } from "react-router";

const AuthLayout = () => {
  const { user, thunks } = useAuth();

  return (
    <>
      <header className="sticky top-0 z-10 bg-zinc-900 p-4 justify-between w-full flex items-center">
        <Button
          type="button"
          onClick={thunks.logout}
          variant="destructive"
          className="ml-auto flex cursor-pointer"
        >
          <p>Logout</p>
          <Avatar className="w-6 h-6">
            <AvatarImage src={user?.avatar_url} alt={user?.login} />
            <AvatarFallback>
              {user?.login?.[0]}
              {user?.login?.[1]}
            </AvatarFallback>
          </Avatar>
        </Button>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default memo(AuthLayout);
