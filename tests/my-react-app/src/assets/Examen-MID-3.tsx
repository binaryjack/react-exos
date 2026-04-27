///EXO 3

import { memo, useCallback, useEffect, useState } from 'react';

interface Todo {
  id: number;
  title: string;
}

const ToDoApi = (delay: number) =>
  new Promise<Todo[]>((resolve) => {
    const output: Todo[] = [];

    for (let i = 0; i < 20; i++) {
      output.push({ id: i, title: `Task to do : ${i}` });
    }

    setTimeout(() => {
      resolve(output);
    }, delay);
  });

interface TodoItemProps {
  todo: Todo;
  select: (todo: Todo) => void;
}

type TodoType = Record<number, Todo>;

const ToDoItem = memo(({ todo, select }: TodoItemProps) => {
  console.log('render item', todo.id);
  return (
    <div onClick={() => select(todo)}>
      <b>{todo.id}</b>) {todo.title}
    </div>
  );
});

interface TodoListProps {
  todos: Todo[];
}
export function TodoList({ todos }: TodoListProps) {
  const [todoRecords, setTodoRecords] = useState<TodoType>({});

  const convertTodos = useCallback(() => {
    setTodoRecords(
      Object.fromEntries(Object.entries(todos).map((o) => [o[1].id, o[1]]))
    );
  }, [todos]);
  console.log('render parent');
  useEffect(() => {
    convertTodos();
  }, [convertTodos]);

  const [selectedTodo, setSelectedTodo] = useState<Todo | undefined>(undefined);
  const handleSelect = useCallback((todo: Todo | undefined) => {
    setSelectedTodo(todo);
  }, []);

  return (
    <div>
      <h1>Todos</h1>
      <div>selected Todo: {selectedTodo?.title}</div>
      <div>
        {Object.values(todoRecords).map((o: Todo) => {
          return <ToDoItem key={o.id} todo={o} select={handleSelect} />;
        })}
      </div>
    </div>
  );
}

export const TestTodo = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const fetchTodos = useCallback(async () => {
    console.log('loading todos');
    const todos = await ToDoApi(200);
    setTodos(todos);
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  return <TodoList todos={todos} />;
};
