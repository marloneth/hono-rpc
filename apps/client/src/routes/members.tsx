import { createFileRoute } from "@tanstack/react-router";
import { MembersList } from "../members/MembersList";

export const Route = createFileRoute("/members")({
  component: MembersList,
});
