import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import RouterProvider from "./providers/RouterProvider/index.tsx";
import ReduxProvider from "./providers/ReduxProvider.tsx";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReduxProvider>
      <RouterProvider />
    </ReduxProvider>
  </StrictMode>
);
