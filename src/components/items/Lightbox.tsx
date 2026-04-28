import { Modal } from "@/components/ui/Modal";

interface LightboxProps {
  open: boolean;
  imageUrl: string;
  alt: string;
  onClose: () => void;
}

export function Lightbox({ open, imageUrl, alt, onClose }: LightboxProps) {
  return (
    <Modal open={open} title="Item image" onClose={onClose}>
      <img src={imageUrl} alt={alt} className="max-h-[70vh] w-full rounded-3xl object-contain" />
    </Modal>
  );
}
