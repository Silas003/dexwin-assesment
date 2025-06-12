import { useState,useEffect } from "react";
import axios from "axios";
import {FaTrash} from "react-icons/fa6";
import {MdOutlineDone} from "react-icons/md";
import {IoClose} from "react-icons/io5";
import { MdModeEditOutline } from "react-icons/md";
import { IoClipboardOutline } from "react-icons/io5";

function App() {

  const [newTodo,setNewTodo] = useState("");
  const [todos,setTodos]=useState([])
  const [editingTodo,setEditingTodo] = useState(null);
  const [editedText,setEditedText] = useState("");
  const addTodo = async(e)=>{
    e.preventDefault();
    if (!newTodo.trim()) return;
    try{
      const response = await axios.post("/api/todos/v1",{
        text:newTodo,
      })
      setTodos([...todos,response.data])
      setNewTodo("")
    }catch(error){
      console.error("Error adding todo:",error);
    }
  }

  const fetchTodos = async()=>{
    try{
      const response = await axios.get("/api/todos/v1")
      setTodos(response.data)
    }catch(error){
      console.error("Error fetching todos:",error);
    }
  }

  useEffect(()=>{
    fetchTodos();
  },[])

  const startEditing = (todo) => {
    setEditingTodo(todo._id);
    setEditedText(todo.text);
  }

  const saveEdit = async(id) => {
    try{
      const response = await axios.patch(`/api/todos/v1/${id}`,{
        text:editedText
      })
      setTodos(todos.map((todo)=>
        todo._id === id ? response.data : todo
      ))
      setEditingTodo(null)
    }catch(error){
      console.log("Error updating task:",error )
    }
  }

  const deleteTodo = async(id) => {
    try{
      await axios.delete(`/api/todos/v1/${id}`)
      setTodos(todos.filter((todo)=>todo._id !== id))
    }catch(error){
      console.log("Error deleting task:",error )
    }
  }
  const toggleTodo = async(id) => {
    try{
      const todo = todos.find((todo)=>todo._id === id)  
      const response = await axios.patch(`/api/todos/v1/${id}`,{
        completed: !todo.completed
      })
      setTodos(todos.map((todo)=>
        todo._id === id ? response.data : todo
      ))
    }catch(error){
      console.log("Error toggling task:",error )
    }
  }
  return (
   <div className="min-h-screen
   bg-gradient-to-br from gray-50 to-gray-100 flex items-center  
   justify-center p-2 sm:p-4">
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-4 sm:p-8">
    <div>
    <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-4 sm:mb-8 text-center">Task Manager</h1>
    </div>
    <form onSubmit={addTodo}
    className="flex flex-col sm:flex-row items-center gap-2 shadow-sm border-gray-200 p-2 rounded-lg">
      <input 
      className="w-full sm:flex-1 outline-none px-3 py-2"
      type="text" 
      value={newTodo} 
      onChange={(e)=>setNewTodo(e.target.value)}
      placeholder="what needs to be done?"
      required/>
      <button type="submit"
      className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white 
      px-4 py-2 rounded-md font-medium cursor-pointer">Add Task</button>
    </form>
    <div className="mt-4">
      {
        todos.length === 0 ? (
          <div></div>
        ) :(
          <div className="flex flex-col gap-4">
            {
              todos.map((todo)=>(
                <div key={todo._id}
                className="">
                {editingTodo == todo._id ? (
                   <div className="flex flex-col sm:flex-row items-center gap-3">
                    <input type="text"
                    value={editedText}
                    onChange={(e)=>setEditedText(e.target.value)}
                    className="w-full sm:flex-1 outline-none p-3 border border-gray-100
                     rounded-lg focus:ring-2 focus:ring-blue-300
                     text-gray-700 shadow-inner"
                    />
                   <div className="flex gap-x-2 w-full sm:w-auto justify-center sm:justify-start">
                   <button onClick={()=>saveEdit(todo._id)}
                   className="flex-1 sm:flex-none px-4 py-2 bg-green-500 
                   text-white rounded-lg hover:bg-green-600
                   cursor-pointer">
                        <MdOutlineDone/>
                      </button >
                      <button  className="flex-1 sm:flex-none px-4 py-2 bg-gray-200 
                   text-gray-700 rounded-lg hover:bg-gray-300
                   cursor-pointer"
                      onClick={()=>setEditingTodo(null)}>
                        <IoClose/>
                      </button>
                   </div>
                  </div>
                  ) : (
                  <div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                      <div className="flex items-center gap-x-4 w-full sm:w-auto">
                      <button onClick={()=>toggleTodo(todo._id)}
                      className={`flex-shrink-0 h-6 w-6 border rounded-full
                        flex items-center justify-center
                        ${todo.completed ? "bg-green-500 border-green-500" : "border-gray-300 hover:border-blue-400"}`}>
                        {todo.completed &&  <MdOutlineDone/>}
                     
                      </button>
                    <span className="text-gray-800 truncate
                    font-medium flex-1">{todo.text}</span>
                      </div>
                         
                      <div className="flex gap-x-2 w-full sm:w-auto justify-end" >
                      <button 
                      className="p-2 
                   text-blue-500  hover:text-blue-700 rounded-lg
                   hover:bg-blue-50 duration-200
                   cursor-pointer"
                      onClick={()=>startEditing(todo)}>
                        <MdModeEditOutline/>
                      </button>
                      <button onClick={()=>deleteTodo(todo._id)}
                      className="p-2 
                   text-red-500  hover:text-red-700 rounded-lg
                   hover:bg-red-50 duration-200
                   cursor-pointer"> 
                        <FaTrash/>
                      </button>
                      </div>
                    </div>
                  </div>
                )
                }
                </div>
              ))
            }
          </div>
        )
      }
    </div>
    </div> 
   </div>
  )
}

export default App
