import { useState } from "react";
import { gql } from "@apollo/client";
import { useQuery, useMutation, useApolloClient } from "@apollo/client/react";
import { Login } from "./features/auth/Login";
import { TodoList } from "./features/todos/TodoList";
import { AppHeader } from "shared/layout/AppHeader";
import { AppFooter } from "shared/layout/AppFooter";
import { MKBox } from "shared/ui/MKBox";

const ME = gql`
  query Me {
    me {
      id
      username
      role
    }
  }
`;

const USERS = gql`
  query Users {
    users {
      id
      username
      role
    }
  }
`;

const LOGOUT = gql`
  mutation Logout {
    logout {
      ok
    }
  }
`;

type MeData = {
  me: {
    id: string;
    username: string;
    role: string;
  } | null;
};

type UsersData = {
  users: {
    id: string;
    username: string;
    role: string;
  }[];
};

function App() {
  const client = useApolloClient();
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("token"))
  );

  const { data: meData } = useQuery<MeData>(ME, {
    skip: !isLoggedIn,
  });

  const { data: usersData } = useQuery<UsersData>(USERS, {
    skip: !isLoggedIn || meData?.me?.role !== "ADMIN",
  });

  const [logout] = useMutation(LOGOUT);

  function handleLogout() {
    logout();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
     client.clearStore();
    setIsLoggedIn(false);
  }

  if (!isLoggedIn) {
    return <Login onLoggedIn={() => setIsLoggedIn(true)} />;
  }

  return (
    <MKBox display="flex" flexDirection="column" minHeight="100vh">
      <AppHeader onLogout={handleLogout} />
      <MKBox component="main" flexGrow={1} sx={{ padding: 2 }}>
        {meData?.me && (
          <div style={{ marginBottom: 16 }}>
            <div>
              Logged in as {meData.me.username} ({meData.me.role})
            </div>
          </div>
        )}
        {meData?.me?.role === "ADMIN" && usersData && (
          <div style={{ marginBottom: 16 }}>
            <h3>All users</h3>
            <ul>
              {usersData.users.map(user => (
                <li key={user.id}>
                  {user.username} ({user.role})
                </li>
              ))}
            </ul>
          </div>
        )}
        <TodoList />
      </MKBox>
      <AppFooter />
    </MKBox>
  );
}

export default App;