import { useRef, useState, type DragEvent } from "react";
import { ImagePlus, UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface DropzoneProps {
  file: File | null;
  previewUrl?: string | null;
  error?: string;
  disabled?: boolean;
  onFileSelect: (file: File) => void;
  onClear: () => void;
}

export function Dropzone({
  file,
  previewUrl,
  error,
  disabled,
  onFileSelect,
  onClear,
}: DropzoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = useState(false);

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!disabled) {
      setDragging(true);
    }
  };

  const handleDragLeave = () => setDragging(false);

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);

    if (disabled) {
      return;
    }

    const nextFile = event.dataTransfer.files?.[0];

    if (nextFile) {
      onFileSelect(nextFile);
    }
  };

  return (
    <div className="space-y-3">
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "group relative overflow-hidden rounded-[28px] border border-dashed bg-white p-6 text-center shadow-sm transition focus-visible:outline-none focus-visible:ring-4",
          dragging
            ? "border-primary bg-primary/5 focus-visible:ring-primary/20"
            : "border-border hover:border-primary/40 hover:bg-surface focus-visible:ring-primary/15",
          error ? "border-danger bg-danger/5" : "",
          disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer",
        )}
        aria-label="Upload item image"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          disabled={disabled}
          onChange={(event) => {
            const nextFile = event.target.files?.[0];
            if (nextFile) {
              onFileSelect(nextFile);
            }
          }}
        />

        {previewUrl ? (
          <div className="space-y-4">
            <img src={previewUrl} alt={file?.name ?? "Uploaded preview"} className="mx-auto max-h-72 rounded-3xl object-contain" />
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button type="button" variant="secondary">
                Replace Image
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={(event) => {
                  event.stopPropagation();
                  onClear();
                }}
              >
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-surface text-primary">
              {dragging ? <UploadCloud className="h-8 w-8" aria-hidden="true" /> : <ImagePlus className="h-8 w-8" aria-hidden="true" />}
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">Drop an image here or browse</p>
              <p className="mt-2 text-sm text-muted-foreground">
                JPG, PNG, or WebP. We’ll compress it client-side before upload.
              </p>
            </div>
          </div>
        )}
      </div>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
    </div>
  );
}
