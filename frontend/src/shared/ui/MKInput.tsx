import { TextField, TextFieldProps } from "@mui/material";

export function MKInput(props: TextFieldProps) {
  return <TextField variant={props.variant || "outlined"} fullWidth {...props} />;
}
