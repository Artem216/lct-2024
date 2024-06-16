import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  setOpen: (value: boolean) => void;
}

const ImageChooseButtonDialog = ({ open, title, description, onConfirm, onCancel, setOpen }: ConfirmDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={() => {setOpen(false)}}>
      <DialogContent className="sm:max-w-[425px] bg-white text-black">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="default" className="bg-primary-500 text-white" onClick={onCancel}>Перейти в конструктор</Button>
          <Button variant="default" className="bg-secondary-500 text-black" onClick={onConfirm}>Сгенерировать новую</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageChooseButtonDialog;
