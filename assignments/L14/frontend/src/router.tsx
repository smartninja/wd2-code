import {
  createRootRoute,
  createRoute,
  createRouter,
  Link,
  Outlet,
} from "@tanstack/react-router";
import RecipeListPage from "./pages/RecipeListPage";
import RecipeDetailPage from "./pages/RecipeDetailPage";
import AddRecipePage from "./pages/AddRecipePage";
import AuthStatus from "./components/AuthStatus";

const rootRoute = createRootRoute({
  component: () => (
    <div className="max-w-xl mx-auto p-6">
      <AuthStatus />
      <nav className="flex gap-4 mb-4">
        <Link to="/" className="text-blue-600">
          Recipes
        </Link>
        <Link to="/add" className="text-blue-600">
          Add
        </Link>
      </nav>
      <Outlet /> {/* the current page renders here */}
    </div>
  ),
});

const listRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: RecipeListPage,
});

const detailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/recipes/$recipeId",
  component: RecipeDetailPage,
});

const addRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/add",
  component: AddRecipePage,
});

const routeTree = rootRoute.addChildren([listRoute, detailRoute, addRoute]);

export const router = createRouter({ routeTree });

// Register the router for full type-safety on <Link>, useParams, useNavigate.
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
