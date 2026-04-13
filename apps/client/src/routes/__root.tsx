import { createRootRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <div>
      <nav className="bg-white border-b px-6 py-3 flex gap-6">
        <Link
          to="/tasks"
          className="font-semibold text-gray-600 hover:text-black"
          activeProps={{ className: "font-semibold text-black" }}
        >
          Tasks
        </Link>
        <Link
          to="/members"
          className="font-semibold text-gray-600 hover:text-black"
          activeProps={{ className: "font-semibold text-black" }}
        >
          Members
        </Link>
      </nav>
      <Outlet />
    </div>
  ),
});
