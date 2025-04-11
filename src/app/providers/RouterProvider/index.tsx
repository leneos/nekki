import { memo, type FC } from "react";
import {
  createBrowserRouter,
  RouterProvider as ReactRouterProvider,
} from "react-router";
import ReposPage from "@/pages/repos";
import AuthLayout from "@/widgets/layout/auth-layout";
import { PATHS } from "./paths";
import { Toaster } from "@/shared/components/ui/sonner";
import MainPage from "@/pages/main";
import AuthGuard from "@/app/guards/AuthGuard";
import GlobalLayout from "@/widgets/layout/global-layout";
<Toaster />;
const router = createBrowserRouter([
  {
    element: <GlobalLayout />,
    children: [
      {
        index: true,
        element: <MainPage />,
      },
      {
        element: (
          <AuthGuard>
            <AuthLayout />
          </AuthGuard>
        ),
        children: [
          {
            path: PATHS.REPOS,
            element: <ReposPage />,
          },
        ],
      },
    ],
  },
]);

const RouterProvider: FC = () => {
  return <ReactRouterProvider router={router} />;
};

export default memo(RouterProvider);
