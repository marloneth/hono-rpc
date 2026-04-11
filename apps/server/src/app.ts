import { Hono } from "hono";
import { cors } from "hono/cors";
import { tasksRouter } from "./tasks/router";

export const app = new Hono()
  .use(
    "*",
    cors({
      origin: "http://localhost:5173",
    }),
  )
  .get("/hello", (c) => {
    return c.json({ message: "Hello from server" });
  })
  .route("/tasks", tasksRouter);

export type AppType = typeof app;
