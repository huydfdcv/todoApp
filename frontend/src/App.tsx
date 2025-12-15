import { useState } from "react";
import { gql } from "@apollo/client";
import { useQuery, useMutation, useApolloClient } from "@apollo/client/react";
import { Login } from "./features/auth/Login";
import { TodoList } from "./features/todos/TodoList";
import { AllUsers } from "./features/users/AllUsers";
import { AppHeader } from "shared/layout/AppHeader";
import { AppFooter } from "shared/layout/AppFooter";
import { Sidebar } from "shared/layout/Sidebar";
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
  const [activeView, setActiveView] = useState<"todos" | "users">("todos");
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
      <AppHeader onLogout={handleLogout} userName={meData?.me?.username} />
      <MKBox component="main" flexGrow={1} sx={{ padding: 2, display: "flex" }}>
        <Sidebar
          activeView={activeView}
          onChangeView={setActiveView}
          canViewUsers={meData?.me?.role === "ADMIN"}
        />
        <MKBox sx={{ flexGrow: 1 }}>
          {activeView === "todos" && <TodoList />}
          {activeView === "users" && meData?.me?.role === "ADMIN" && usersData && (
            <AllUsers users={usersData.users} />
          )}
        </MKBox>
      </MKBox>
      <AppFooter />
    </MKBox>
  );
}

export default App;