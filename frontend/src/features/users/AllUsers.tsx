import { MKBox } from "shared/ui/MKBox";
import { MKTypography } from "shared/ui/MKTypography";

type UserItem = {
  id: string;
  username: string;
  role: string;
};

type AllUsersProps = {
  users: UserItem[];
};

export function AllUsers({ users }: AllUsersProps) {
  return (
    <MKBox>
      <MKTypography variant="h6" sx={{ mb: 1 }}>
        All users
      </MKTypography>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.username} ({user.role})
          </li>
        ))}
      </ul>
    </MKBox>
  );
}
