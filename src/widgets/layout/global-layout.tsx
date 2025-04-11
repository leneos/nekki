import { memo } from "react";
import { Outlet } from "react-router";
import { Toaster } from "@/shared/components/ui/sonner";

const GlobalLayout = () => {
  return (
    <>
      <Outlet />
      <Toaster richColors />
    </>
  );
};

export default memo(GlobalLayout);
