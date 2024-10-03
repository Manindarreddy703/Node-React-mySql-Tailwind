import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Modal from "react-modal";

// Item type for drag-and-drop
const ItemType = {
  TODO: 'todo',
};

// Draggable Todo Item Component
const TodoItem = ({ todo, index, moveTodo, onEdit, onDelete }) => {
  const [, ref] = useDrag({
    type: ItemType.TODO,
    item: { id: todo.id, index },
  });

  const [, drop] = useDrop({
    accept: ItemType.TODO,
    hover(item) {
      if (item.index !== index) {
        moveTodo(item.index, index);
        item.index = index; // Update the index for the dragged item
      }
    },
  });

  return (
    <div ref={(node) => ref(drop(node))} className="p-4 bg-white border rounded shadow-md flex justify-between items-center">
      <span>{todo.title}</span>
      <div>
        <button onClick={() => onEdit(todo)} className="bg-yellow-500 text-white p-1 rounded mr-2">
          Edit
        </button>
        <button onClick={() => onDelete(todo.id)} className="bg-red-500 text-white p-1 rounded">
          Delete
        </button>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // Step 1: Create search state
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchTodos = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found, please log in");
        return;
      }

      try {
        const response = await axios.get("https://node-react-my-sql-tailwind-backend.vercel.app/api/todos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTodos(response.data);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };

    if (isAuthenticated) {
      fetchTodos();
    }
  }, [isAuthenticated]);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        "https://node-react-my-sql-tailwind-backend.vercel.app/api/todos",
        { title: newTodo },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTodos([...todos, response.data]);
      setNewTodo("");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const moveTodo = (fromIndex, toIndex) => {
    const updatedTodos = Array.from(todos);
    const [movedTodo] = updatedTodos.splice(fromIndex, 1);
    updatedTodos.splice(toIndex, 0, movedTodo);
    setTodos(updatedTodos);
  };

  const handleEditTodo = async (updatedTodo) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        `https://node-react-my-sql-tailwind-backend.vercel.app/api/todos/${updatedTodo.id}`,
        { title: updatedTodo.title },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedTodos = todos.map((todo) => (todo.id === updatedTodo.id ? response.data : todo));
      setTodos(updatedTodos);
      setModalIsOpen(false);
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const handleDeleteTodo = async (id) => {
    const token = localStorage.getItem("token");
    
    try {
      await axios.delete(`https://node-react-my-sql-tailwind-backend.vercel.app/api/todos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const openEditModal = (todo) => {
    setEditingTodo(todo);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setEditingTodo(null);
  };

  // Step 2: Filter todos based on the search query
  const filteredTodos = todos.filter(todo =>
    todo.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Your Todos:</h2>

        {/* Search Input Field */}
        <input
          type="text"
          placeholder="Search todos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Step 3: Capture search query
          className="border p-2 mb-4 rounded"
        />

        {/* Add Todo Form */}
        <form onSubmit={handleAddTodo} className="mb-4">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new todo"
            className="border p-2 mr-2 rounded"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Add Todo
          </button>
        </form>

        {/* Draggable Todo List */}
        <div className="space-y-2">
          {filteredTodos.map((todo, index) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              index={index}
              moveTodo={moveTodo}
              onEdit={openEditModal}
              onDelete={handleDeleteTodo}
            />
          ))}
        </div>

        {/* Edit Todo Modal */}
        <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
          <h2 className="text-2xl font-bold mb-4">Edit Todo</h2>
          {editingTodo && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditTodo(editingTodo);
              }}
            >
              <input
                type="text"
                value={editingTodo.title}
                onChange={(e) => setEditingTodo({ ...editingTodo, title: e.target.value })}
                className="border p-2 rounded mb-4"
              />
              <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                Save
              </button>
            </form>
          )}
          <button onClick={closeModal} className="mt-2 text-red-500">
            Cancel
          </button>
        </Modal>
      </div>
    </DndProvider>
  );
};

export default AdminDashboard;
