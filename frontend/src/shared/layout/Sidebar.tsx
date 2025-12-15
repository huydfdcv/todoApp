import { MKBox } from "shared/ui/MKBox";
import { MKButton } from "shared/ui/MKButton";

type SidebarView = "todos" | "users";

type SidebarProps = {
  activeView: SidebarView;
  onChangeView: (view: SidebarView) => void;
  canViewUsers: boolean;
};

export function Sidebar({ activeView, onChangeView, canViewUsers }: SidebarProps) {
  return (
    <MKBox sx={{ width: 220, mr: 2, display: "flex", flexDirection: "column", gap: 1 }}>
      <MKButton
        variant={activeView === "todos" ? "contained" : "outlined"}
        onClick={() => onChangeView("todos")}
      >
        My todos
      </MKButton>
      {canViewUsers && (
        <MKButton
          variant={activeView === "users" ? "contained" : "outlined"}
          onClick={() => onChangeView("users")}
        >
          All users
        </MKButton>
      )}
    </MKBox>
  );
}
