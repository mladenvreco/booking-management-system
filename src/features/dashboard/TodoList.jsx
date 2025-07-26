import { useState, useEffect } from "react";
import supabase from "../../services/supabase";
import { IoAlertCircleOutline } from "react-icons/io5";
import { HiOutlinePlusSm, HiOutlineTrash, HiX } from "react-icons/hi";

import styled from "styled-components";

// Styled Components
const TodoContainer = styled.div`
  margin-bottom: 2rem;
`;

const TodoHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const TodoTitle = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: #374151;
  display: flex;
  align-items: center;
`;

const TodoCard = styled.div`
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  padding: 1.5rem;
`;

const ErrorAlert = styled.div`
  margin-bottom: 1rem;
  padding: 0.75rem;
  background-color: #fee2e2;
  border: 1px solid #f87171;
  color: #b91c1c;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
`;

const ErrorIcon = styled(IoAlertCircleOutline)`
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.5rem;
`;

const DismissButton = styled.button`
  margin-left: auto;
`;

const DismissIcon = styled(HiX)`
  width: 1rem;
  height: 1rem;
`;

const InputGroup = styled.div`
  display: flex;
  margin-bottom: 1.5rem;
`;

const TodoInput = styled.input`
  flex-grow: 1;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-top-left-radius: 0.5rem;
  border-bottom-left-radius: 0.5rem;

  &:focus {
    outline: none;
    /* box-shadow: 0 0 0 2px #10b981; */
  }
`;

const AddButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #10b981;
  color: white;
  border: none;
  border-top-right-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #059669;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #10b981;
  }

  &:disabled {
    background-color: #d1d5db;
    cursor: not-allowed;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 1rem 0;
`;

const StyledTodoList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const TodoItem = styled.li`
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 0.75rem;
  background-color: #f9fafb;
`;

const TodoItemContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TodoText = styled.span`
  flex-grow: 1;
  word-break: break-word;
`;

const TodoNumber = styled.span`
  font-weight: 500;
  color: #374151;
  margin-right: 0.5rem;
`;

const TodoActions = styled.div`
  display: flex;
  align-items: center;
  margin-left: 0.5rem;
`;

const DeleteButton = styled.button`
  padding: 0.25rem;
  color: #dc2626;

  &:hover {
    color: #991b1b;
  }

  &:disabled {
    color: #9ca3af;
    cursor: not-allowed;
  }
`;

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("podsjetnik").select("*");

      if (error) throw error;

      if (data && data.length > 0) {
        setTodos(data);
      } else {
        setTodos([]);
      }
      setError(null);
    } catch (error) {
      setError("Neuspješno učitavanje zadataka");
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async () => {
    if (!newTodo.trim()) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("podsjetnik")
        .insert([{ podsjetnik: newTodo.trim() }]);

      if (error) throw error;

      // Refresh todos after adding
      await fetchTodos();
      setNewTodo("");
    } catch (error) {
      setError("Neuspješno dodavanje zadatka");
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = async (id) => {
    try {
      setLoading(true);

      const { error } = await supabase.from("podsjetnik").delete().eq("id", id);

      if (error) throw error;

      // Refresh todos after deleting
      await fetchTodos();
    } catch (error) {
      setError("Neuspješno brisanje zadatka");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  return (
    <TodoContainer>
      <TodoHeader>
        <TodoTitle>Podsjetnik</TodoTitle>
      </TodoHeader>

      <TodoCard>
        {error && (
          <ErrorAlert>
            <ErrorIcon />
            <span>{error}</span>
            <DismissButton
              onClick={() => setError(null)}
              aria-label="Dismiss error"
            >
              <DismissIcon />
            </DismissButton>
          </ErrorAlert>
        )}

        <InputGroup>
          <TodoInput
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <AddButton onClick={addTodo} disabled={!newTodo.trim() || loading}>
            <HiOutlinePlusSm size={25} />
          </AddButton>
        </InputGroup>

        {loading && todos.length === 0 ? (
          <LoadingMessage>Učitavanje zadataka...</LoadingMessage>
        ) : todos.length === 0 ? (
          ""
        ) : (
          <StyledTodoList>
            {todos.map((todo, index) => (
              <TodoItem key={todo.id}>
                <TodoItemContent>
                  <TodoText>
                    <TodoNumber>{index + 1}.</TodoNumber>
                    {todo.podsjetnik}
                  </TodoText>
                  <TodoActions>
                    <DeleteButton
                      onClick={() => deleteTodo(todo.id)}
                      aria-label="Delete"
                      disabled={loading}
                    >
                      <HiOutlineTrash size={20} />
                    </DeleteButton>
                  </TodoActions>
                </TodoItemContent>
              </TodoItem>
            ))}
          </StyledTodoList>
        )}
      </TodoCard>
    </TodoContainer>
  );
}

export default TodoList;
