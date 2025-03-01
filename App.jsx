import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [Todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [deadline, setDeadline] = useState("");
  const [showFinished, setShowFinished] = useState(true);

  useEffect(() => {
    let todoString = localStorage.getItem("todos");
    if (todoString) {
      try {
        let todos = JSON.parse(todoString);
        setTodos(todos);
      } catch (e) {
        console.error("Error parsing todos from localStorage", e);
        setTodos([]);
      }
    }
  }, []);

  const saveToLS = (newTodos) => {
    localStorage.setItem("todos", JSON.stringify(newTodos));
  };

  const toggleFinished = () => {
    setShowFinished(!showFinished);
  };

  const handleEdit = (e, id) => {
    let t = todos.find(i => i.id === id);
    setTodo(t.todo);
    setDeadline(t.deadline);
    let newTodos = todos.filter(item => item.id !== id);
    setTodos(newTodos);
    saveToLS(newTodos);
  };

  const handleDelete = (e, id) => {
    let newTodos = todos.filter(item => item.id !== id);
    setTodos(newTodos);
    saveToLS(newTodos);
  };

  const handleAdd = () => {
    const newTodos = [...todos, { id: uuidv4(), todo: Todo, deadline: deadline, isCompleted: false }];
    setTodos(newTodos);
    saveToLS(newTodos);
    setTodo("");
    setDeadline("");
  };

  const handleChange = (e) => {
    setTodo(e.target.value);
  };

  const handleDeadlineChange = (e) => {
    setDeadline(e.target.value);
  };

  const handleCheckbox = (e) => {
    let id = e.target.name;
    let newTodos = todos.map(item =>
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    );
    setTodos(newTodos);
    saveToLS(newTodos);
  };

  return (
    <>
      <Navbar />
      <div className="mx-3 md:container md:mx-auto my-5 rounded-xl p-5 bg-violet-100 min-h-[80vh] md:w-1/2">
        <h1 className='font-bold text-center text-xl'>Task Manager - Manage your todos at one place</h1>
        <div className='addTodo my-5 flex-col gap-4'>
          <h2 className='text-lg font-bold'>Add a To-Do</h2>
          <input 
            onChange={handleChange} 
            value={Todo} 
            type="text" 
            placeholder="Enter your task" 
            className="w-full rounded-full px-5 py-1" 
          />
          <input 
            onChange={handleDeadlineChange} 
            value={deadline} 
            type="datetime-local" 
            className="w-full rounded-full px-5 py-1 mt-2" 
          />
          <button 
            onClick={handleAdd} 
            disabled={Todo.length <= 3 || !deadline} 
            className='bg-violet-800 hover:bg-violet-950 disabled:bg-violet-700 p-2 text-sm font-bold text-white rounded-md mt-2 w-full'
          >
            Save
          </button>
        </div>
        <input 
          className='my-4' 
          onChange={toggleFinished} 
          type="checkbox" 
          checked={showFinished} 
        /> Show Finished
        <h2 className='text-lg font-bold'>Your To-Dos</h2>
        <div className="todos">
          {todos.length === 0 && <div className='m-5'>There are No To-dos to display</div>}
          {todos.map(item => (
            (showFinished || !item.isCompleted) && (
              <div key={item.id} className="todo flex justify-between items-center my-3 p-2 bg-white rounded-lg shadow-md">
                <div className='flex gap-5 items-center'>
                  <input 
                    name={item.id} 
                    onChange={handleCheckbox} 
                    type="checkbox" 
                    checked={item.isCompleted} 
                  />
                  <div className={item.isCompleted ? "line-through" : ""}>{item.todo}</div>
                  <div className='text-sm text-gray-500 ml-5'>{item.deadline}</div>
                </div>
                <div className="buttons flex h-full">
                  <button 
                    onClick={(e) => handleEdit(e, item.id)} 
                    className='bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1'
                  >
                    <FaEdit />
                  </button>
                  <button 
                    onClick={(e) => handleDelete(e, item.id)} 
                    className='bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1'
                  >
                    <AiFillDelete />
                  </button>
                </div>
              </div>
            )
          ))}
        </div>
      </div>
    </>
  );
}

export default App;