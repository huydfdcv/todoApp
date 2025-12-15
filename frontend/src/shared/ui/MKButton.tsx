import { Button, ButtonProps } from "@mui/material";

export function MKButton(props: ButtonProps) {
  return <Button variant={props.variant || "contained"} color={props.color || "primary"} {...props} />;
}
