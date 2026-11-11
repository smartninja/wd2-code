import type { ReactNode } from "react";
import { render } from "@testing-library/react";
import {
  createRootRoute,
  createRoute,
  createRouter,
  createMemoryHistory,
  RouterProvider,
} from "@tanstack/react-router";

// Components that use <Link> need a router in the tree. This wraps the UI under
// test in a minimal in-memory router that knows the detail route, so links can
// resolve without pulling in the whole app.
export function renderWithRouter(ui: ReactNode) {
  const rootRoute = createRootRoute({ component: () => <>{ui}</> });
  const detailRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/recipes/$recipeId",
    component: () => null,
  });
  const router = createRouter({
    routeTree: rootRoute.addChildren([detailRoute]),
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return render(<RouterProvider router={router as any} />);
}
