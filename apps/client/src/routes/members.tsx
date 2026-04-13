import { createFileRoute } from "@tanstack/react-router";
import { MembersList } from "../MembersList";

export const Route = createFileRoute("/members")({
  component: MembersList,
});
