import { useState } from "react";
import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import { List, ListItem, ListItemText, Checkbox, Box } from "@mui/material";
import { PopupDialog } from "shared/ui/PopupDialog";
import { MKInput } from "shared/ui/MKInput";
import { MKButton } from "shared/ui/MKButton";
import { MKTypography } from "shared/ui/MKTypography";
import { MKBox } from "shared/ui/MKBox";

const MY_TODOS = gql`
  query {
    myTodos {
      id
      title
      completed
    }
  }
`;

const CREATE_TODO = gql`
  mutation CreateTodo($title: String!) {
    createTodo(title: $title) {
      todo {
        id
        title
        completed
      }
    }
  }
`;

const TOGGLE_TODO = gql`
  mutation ToggleTodo($id: ID!) {
    toggleTodo(id: $id) {
      todo {
        id
        completed
      }
    }
  }
`;

const UPDATE_TODO = gql`
  mutation UpdateTodo($id: ID!, $title: String, $completed: Boolean) {
    updateTodo(id: $id, title: $title, completed: $completed) {
      todo {
        id
        title
        completed
      }
    }
  }
`;

const DELETE_TODO = gql`
  mutation DeleteTodo($id: ID!) {
    deleteTodo(id: $id) {
      ok
    }
  }
`;

type TodoItem = {
  id: string;
  title: string;
  completed: boolean;
};

type MyTodosData = {
  myTodos: TodoItem[];
};

export function TodoList() {
  const { data, loading, refetch } = useQuery<MyTodosData>(MY_TODOS);
  const [title, setTitle] = useState("");
  const [editingTodo, setEditingTodo] = useState<TodoItem | null>(null);
  const [deletingTodo, setDeletingTodo] = useState<TodoItem | null>(null);
  const [createTodo] = useMutation(CREATE_TODO);
  const [toggleTodo] = useMutation(TOGGLE_TODO);
  const [updateTodo] = useMutation(UPDATE_TODO);
  const [deleteTodo] = useMutation(DELETE_TODO);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!title) return;
    await createTodo({ variables: { title } });
    setTitle("");
    refetch();
  }

  async function handleToggle(id: string) {
    await toggleTodo({ variables: { id } });
    refetch();
  }

  if (loading) return <div>Loading...</div>;

  return (
    <MKBox>
      <MKBox
        component="form"
        onSubmit={handleAdd}
        sx={{ display: "flex", gap: 1.5, mb: 2, alignItems: "center" }}
      >
        <MKInput
          placeholder="New todo"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <MKButton type="submit" sx={{ whiteSpace: "nowrap" }}>
          Add
        </MKButton>
      </MKBox>
      {data?.myTodos.length ? (
        <List>
          {data.myTodos.map(todo => (
            <ListItem
              key={todo.id}
              divider
              secondaryAction={
                <Box sx={{ display: "flex", gap: 1 }}>
                  <MKButton
                    size="small"
                    variant="outlined"
                    onClick={() => setEditingTodo(todo)}
                  >
                    Edit
                  </MKButton>
                  <MKButton
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={() => setDeletingTodo(todo)}
                  >
                    Delete
                  </MKButton>
                </Box>
              }
            >
              <Checkbox
                edge="start"
                checked={todo.completed}
                onChange={() => handleToggle(todo.id)}
              />
              <ListItemText
                primary={
                  <MKTypography
                    variant="body1"
                    sx={{
                      textDecoration: todo.completed ? "line-through" : "none",
                    }}
                  >
                    {todo.title}
                  </MKTypography>
                }
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <MKTypography variant="body2" color="textSecondary">
          No todos yet. Add your first task.
        </MKTypography>
      )}
      <PopupDialog
        open={Boolean(editingTodo)}
        title="Edit todo"
        fields={
          editingTodo
            ? [
                {
                  name: "title",
                  label: "Title",
                  initialValue: editingTodo.title,
                },
              ]
            : []
        }
        onClose={() => setEditingTodo(null)}
        onConfirm={async values => {
          if (!editingTodo) return;
          const nextTitle = values.title || "";
          if (!nextTitle || nextTitle === editingTodo.title) {
            setEditingTodo(null);
            return;
          }
          await updateTodo({ variables: { id: editingTodo.id, title: nextTitle } });
          setEditingTodo(null);
          refetch();
        }}
      />
      <PopupDialog
        open={Boolean(deletingTodo)}
        title="Delete todo"
        fields={[]}
        onClose={() => setDeletingTodo(null)}
        onConfirm={async () => {
          if (!deletingTodo) return;
          await deleteTodo({ variables: { id: deletingTodo.id } });
          setDeletingTodo(null);
          refetch();
        }}
        extraContent={
          deletingTodo ? (
            <MKTypography variant="body2">
              Are you sure you want to delete "{deletingTodo.title}"?
            </MKTypography>
          ) : null
        }
      />
    </MKBox>
    
  );
}
