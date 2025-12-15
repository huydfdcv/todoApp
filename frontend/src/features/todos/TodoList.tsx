import { useState } from "react";
import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import { PopupDialog } from "shared/ui/PopupDialog";

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
    <div>
      <h2>My Todos</h2>
      <form onSubmit={handleAdd}>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="New todo"
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {data?.myTodos.map(todo => (
          <li key={todo.id}>
            <label>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggle(todo.id)}
              />
              {todo.title}
            </label>
            <button type="button" onClick={() => setEditingTodo(todo)}>
              Edit
            </button>
            <button type="button" onClick={() => setDeletingTodo(todo)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
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
            <p>
              Are you sure you want to delete "{deletingTodo.title}"?
            </p>
          ) : null
        }
      />
    </div>
  );
}
