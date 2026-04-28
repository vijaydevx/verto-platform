import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  archiveItem,
  claimItem,
  createComment,
  createItem,
  fetchComments,
  fetchItemById,
  fetchItems,
  fetchMyItems,
  restoreItem,
  updateProfile,
} from "@/lib/api";


import type { ItemInsert, ItemWithProfile, PaginatedItemsResult, ProfileRow } from "@/types";

const STALE_TIME = 5 * 60 * 1000;
const GC_TIME = 10 * 60 * 1000;

export function itemsQueryKey(filters: {
  page?: number;
  location?: string;
  type?: "lost" | "found" | "all";
  q?: string;
  category?: string;
  sort?: "latest" | "oldest";
  includeArchived?: boolean;
}) {
  return ["items", filters] as const;
}


export function myItemsQueryKey(filters: {
  userId?: string;
  page?: number;
  location?: string;
  type?: "lost" | "found" | "all";
  includeArchived?: boolean;
}) {
  return ["my-items", filters] as const;
}

export function itemDetailQueryKey(id?: string) {
  return ["item", id] as const;
}

export function useItems(filters: {
  page?: number;
  location?: string;
  type?: "lost" | "found" | "all";
  q?: string;
  category?: string;
  sort?: "latest" | "oldest";
  includeArchived?: boolean;
}) {

  return useQuery<PaginatedItemsResult>({
    queryKey: itemsQueryKey(filters),
    queryFn: () => fetchItems(filters),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
}

export function useItem(itemId?: string) {
  return useQuery<ItemWithProfile | null>({
    queryKey: itemDetailQueryKey(itemId),
    queryFn: () => {
      if (!itemId) {
        throw new Error("Item ID is required.");
      }

      return fetchItemById(itemId);
    },
    enabled: Boolean(itemId),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
}

export function useMyItems(filters: {
  userId?: string;
  page?: number;
  location?: string;
  type?: "lost" | "found" | "all";
  includeArchived?: boolean;
}) {
  return useQuery<PaginatedItemsResult>({
    queryKey: myItemsQueryKey(filters),
    queryFn: () => {
      if (!filters.userId) {
        throw new Error("User ID is required.");
      }

      return fetchMyItems({
        userId: filters.userId,
        page: filters.page,
        location: filters.location,
        type: filters.type,
        includeArchived: filters.includeArchived,
      });
    },
    enabled: Boolean(filters.userId),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
}

export function useCreateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ItemInsert) => createItem(payload),
    onSuccess: async (createdItem) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["items"] }),
        queryClient.invalidateQueries({ queryKey: ["my-items"] }),
        queryClient.invalidateQueries({ queryKey: itemDetailQueryKey(createdItem.id) }),
      ]);
    },
  });
}

export function useArchiveItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => archiveItem(id),
    onMutate: async (id) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ["items"] }),
        queryClient.cancelQueries({ queryKey: ["my-items"] }),
        queryClient.cancelQueries({ queryKey: itemDetailQueryKey(id) }),
      ]);

      const previousItem = queryClient.getQueryData<ItemWithProfile | null>(itemDetailQueryKey(id));

      queryClient.setQueryData<ItemWithProfile | null>(itemDetailQueryKey(id), (current) =>
        current ? { ...current, is_active: false } : current,
      );

      return { previousItem };
    },
    onError: (_error, id, context) => {
      if (context?.previousItem) {
        queryClient.setQueryData(itemDetailQueryKey(id), context.previousItem);
      }
    },
    onSettled: async (_data, _error, id) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["items"] }),
        queryClient.invalidateQueries({ queryKey: ["my-items"] }),
        queryClient.invalidateQueries({ queryKey: itemDetailQueryKey(id) }),
      ]);
    },
  });
}

export function useRestoreItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => restoreItem(id),
    onSettled: async (_data, _error, id) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["items"] }),
        queryClient.invalidateQueries({ queryKey: ["my-items"] }),
        queryClient.invalidateQueries({ queryKey: itemDetailQueryKey(id) }),
      ]);
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, fullName }: { userId: string; fullName: string }) =>
      updateProfile(userId, fullName),
    onSuccess: async (updatedProfile) => {
      await queryClient.invalidateQueries({ queryKey: ["my-items"] });
      queryClient.setQueryData<ProfileRow>(["profile", updatedProfile.id], updatedProfile);
    },
  });
}

export function useClaimItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, userId, message }: { itemId: string; userId: string; message: string }) =>
      claimItem(itemId, userId, message),
    onSuccess: async (_data, { itemId }) => {
      await queryClient.invalidateQueries({ queryKey: itemDetailQueryKey(itemId) });
    },
  });
}
export function useComments(itemId: string) {
  return useQuery({
    queryKey: ["comments", itemId],
    queryFn: () => fetchComments(itemId),
    enabled: Boolean(itemId),
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, userId, content }: { itemId: string; userId: string; content: string }) =>
      createComment(itemId, userId, content),
    onSuccess: async (_data, { itemId }) => {
      await queryClient.invalidateQueries({ queryKey: ["comments", itemId] });
    },
  });
}
