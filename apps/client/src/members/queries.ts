import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createMember,
  deleteMember,
  getMembers,
  updateMember,
  type GetMembersRequestQuery,
} from "./api";

type UpdateMemberData = {
  id: string;
  data: Parameters<typeof updateMember>[1];
};

export const useGetMemberList = (filters?: GetMembersRequestQuery) =>
  useQuery({
    queryKey: ["members", filters],
    queryFn: () => getMembers(filters),
  });

export const useCreateMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMember,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["members"] }),
  });
};

export const useUpdateMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: UpdateMemberData) => updateMember(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["members"] }),
  });
};

export const useDeleteMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMember,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["members"] }),
  });
};
