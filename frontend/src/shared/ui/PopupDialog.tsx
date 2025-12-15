import { ReactNode, useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack } from "@mui/material";
import { MKInput } from "shared/ui/MKInput";

type PopupField = {
  name: string;
  label: string;
  type?: string;
  initialValue?: string;
};

type PopupDialogProps = {
  open: boolean;
  title: string;
  fields?: PopupField[];
  confirmLabel?: string;
  cancelLabel?: string;
  onClose: () => void;
  onConfirm: (values: Record<string, string>) => void;
  extraContent?: ReactNode;
};

export function PopupDialog({
  open,
  title,
  fields,
  confirmLabel,
  cancelLabel,
  onClose,
  onConfirm,
  extraContent,
}: PopupDialogProps) {
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) {
      return;
    }
    const initial: Record<string, string> = {};
    (fields || []).forEach(field => {
      initial[field.name] = field.initialValue || "";
    });
    setValues(initial);
  }, [open, fields]);

  function handleChange(name: string, value: string) {
    setValues(current => ({ ...current, [name]: value }));
  }

  function handleConfirm() {
    onConfirm(values);
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {fields && fields.length > 0 && (
          <Stack spacing={2} mt={1}>
            {fields.map(field => (
              <MKInput
                key={field.name}
                label={field.label}
                type={field.type}
                value={values[field.name] || ""}
                onChange={e => handleChange(field.name, e.target.value)}
              />
            ))}
          </Stack>
        )}
        {extraContent}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{cancelLabel || "Cancel"}</Button>
        <Button onClick={handleConfirm} variant="contained">
          {confirmLabel || "OK"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
