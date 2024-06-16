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
}

const ConfirmDialog = ({ open, title, description, onConfirm, onCancel }: ConfirmDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={open ? onCancel : undefined}>
      <DialogContent className="sm:max-w-[425px] bg-white text-black">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}> Отменить</Button>
          <Button variant="default" className="shad-button_secondary px-5" onClick={onConfirm}>Подтвердить</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;
