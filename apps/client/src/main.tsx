import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { ErrorProvider, useError } from "./shared/context/ErrorContext";
import { ErrorModal } from "./shared/components/ErrorModal";
import "./index.css";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function AppWithQueryClient() {
  const { showError } = useError();

  const [queryClient] = useState(
    () =>
      new QueryClient({
        mutationCache: new MutationCache({
          onError: (error) =>
            showError(
              error instanceof Error ? error.message : "An unexpected error occurred",
            ),
        }),
        queryCache: new QueryCache({
          onError: (error) =>
            showError(
              error instanceof Error ? error.message : "An unexpected error occurred",
            ),
        }),
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ErrorModal />
    </QueryClientProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorProvider>
      <AppWithQueryClient />
    </ErrorProvider>
  </StrictMode>,
);
