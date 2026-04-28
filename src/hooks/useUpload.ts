import { useMutation } from "@tanstack/react-query";
import { createObjectPreview, revokeObjectPreview } from "@/lib/image";
import { supabase } from "@/lib/supabase";

export interface PreparedUpload {
  objectKey: string;
  publicUrl: string;
  previewUrl: string;
  cleanupPreview: () => void;
}

export function useUpload() {
  return useMutation({
    mutationFn: async (file: File): Promise<PreparedUpload> => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${fileExt}`;
      const filePath = `items/${fileName}`;

      const { data, error } = await supabase.storage
        .from('item-images')
        .upload(filePath, file);

      if (error) {
        throw new Error(`Upload failed: ${error.message}`);
      }

      const { data: { publicUrl } } = supabase.storage
        .from('item-images')
        .getPublicUrl(filePath);

      const previewUrl = createObjectPreview(file);

      return {
        objectKey: filePath,
        publicUrl,
        previewUrl,
        cleanupPreview: () => revokeObjectPreview(previewUrl),
      };
    },
  });
}


