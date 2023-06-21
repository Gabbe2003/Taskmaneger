import { useState, useReducer } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Folder , State , Task } from '../App';


const reducer = ( state: State, action: taskActions ) => {
    switch(action.type) {
        case 'ADD_TASK':
            return { ...state, folders: state.folders.map(folder => folder.id === action.payload.folder.id ? { ...folder, tasks: [...folder.tasks, { ...action.payload.task }] } : folder )};
        case 'SET_TASK_NAME':
          return { ...state, taskName: action.payload };
        case 'SET_TASK_PRIORITY':
          return { ...state, taskPriority: action.payload };
        case 'SET_TASK_STATUS':
          return { ...state, taskStatus: action.payload };
        case 'SET_TASK_DUE_DATE':
          return { ...state, taskDueDate: action.payload };
        case 'SET_SEARCH':
          return { ...state, search: action.payload };
        case 'SET_SELECTED_TASK':
          return { ...state, selectedTask: action.payload };
        case 'EDIT_FOLDER':
          return { ...state, folders: state.folders.map(folder => folder.id === action.payload.original.id ? action.payload.updated : folder )};
        case 'REMOVE_TASK':
          return { ...state, folders: state.folders.map(folder => folder.id === action.payload.folder.id ? { ...folder, tasks: folder.tasks.filter(task => task.id !== action.payload.task.id) } : folder)};
        case 'EDIT_TASK':
            const updatedFolders = state.folders.map(folder => 
                folder.id === action.payload.folder.id ? 
                { 
                    ...folder, 
                    tasks: folder.tasks.map(task => 
                        task.id === action.payload.original.id ? action.payload.updated : task
                    ) 
                } : folder
            );
            
            let updatedSelectedFolder = state.selectedFolder;
            if (state.selectedFolder) {
                updatedSelectedFolder = {
                    ...state.selectedFolder,
                    tasks: state.selectedFolder.tasks.map(task =>
                        task.id === action.payload.original.id ? action.payload.updated : task
                    ),
                };
            }
            return { 
                ...state, 
                folders: updatedFolders,
                selectedFolder: updatedSelectedFolder,
                selectedTask: null,
              }
              
          default:
          return state;
      }
      
}

export const initialState: State = {
    tasks: [],
    folders: [],
    selectedFolder: null,
    editingFolder: null,
    folderName: '',
    taskName: '',
    taskPriority: 'low',
    taskStatus: "pending",
    taskDueDate: '',
    search: '',
    selectedTask: null,
    }

export type taskActions =
{ type: 'SET_TASKS', payload: Task[] }
| { type: 'ADD_TASK', payload: { folder: Folder, task: Task } }
| { type: 'REMOVE_TASK', payload: { folder: Folder, task: Task } }
| { type: 'EDIT_TASK', payload: { folder: Folder, original: Task, updated: Task } }
| { type: 'SET_FOLDER_NAME', payload: string }
| { type: 'SET_TASK_NAME', payload: string }
| { type: 'SET_TASK_PRIORITY', payload: 'low' | 'medium' | 'high' }
| { type: 'SET_TASK_STATUS', payload: "completed" | "in progress" | "pending" }
| { type: 'SET_TASK_DUE_DATE', payload: string } 
| { type: 'SET_SEARCH', payload: string }
| { type: 'SET_SELECTED_TASK', payload: Task | null }
| { type: 'EDIT_FOLDER', payload: { original: Folder, updated: Folder } }

export const TasksActions = () =>  {
    const [state, dispatch] = useReducer(reducer, initialState)
    const [newTask, setNewTask] = useState({
        name: '',
        priority: 'low',
        status: 'pending',
        dueDate: ''
      });
      ;
    
    const handleSelectTask = (task: Task) => {
        dispatch({ type: 'SET_SELECTED_TASK', payload: task });
      };
      
      // Function to handle task deletion
      const deleteTask = (task: Task) => {
        if (state.selectedFolder) {
          handleRemoveTask(state.selectedFolder, task);
        }
      };
  
      const handleAddTask = (folder: Folder, task: Task) => {
        // Add the task to the tasks array of the folder
        const updatedTasks= Array.isArray(folder.tasks) ? [...folder.tasks, task] : [task];
        const updatedFolder: Folder = {
          ...folder,
          tasks: updatedTasks,
        };
      
          console.log(updatedFolder); // Let's log the updated tasks list here to see the changes
  
        // Dispatch an action to update the folder
        dispatch({ type: 'EDIT_FOLDER', payload: { original: folder, updated: updatedFolder } });
      };

      const handleTaskNameChange = (e) => {
        setNewTask({
          ...newTask,
          name: e.target.value
        });
      };

      const handleTaskDueDateChange = (e) => {
        setNewTask({
          ...newTask,
          dueDate: e.target.value
        });
      };
      
      const handleTaskPriorityChange = (e) => {
        setNewTask(prev => ({ ...prev, priority: e.target.value }));
      };
      
      const handleTaskStatusChange = (e) => {
        setNewTask(prev => ({ ...prev, status: e.target.value }));
      };
       
    const handleSubmit = (e) => {
        e.preventDefault()
        const newTask: Task = {
            id: uuidv4(),
            name: state.taskName,
            priority: state.taskPriority,
            status: state.taskStatus,
            dueDate: state.taskDueDate,
        };
        if (state.selectedFolder) {
            handleAddTask(state.selectedFolder, newTask);
        }else {
            return 
        }
          // Clear input fields
          dispatch({ type: 'SET_TASK_NAME', payload: '' });
          dispatch({ type: 'SET_TASK_PRIORITY', payload: 'low' });
          dispatch({ type: 'SET_TASK_STATUS', payload: 'pending' });
          dispatch({ type: 'SET_TASK_DUE_DATE', payload: '' });
        };

        const handleRemoveTask = (folder: Folder, task: Task) => {
            dispatch({ type: 'REMOVE_TASK', payload: { folder, task } });
          };
          
          const handleEditTask = (folder: Folder, original: Task, updated: Task) => {
            dispatch({ type: 'EDIT_TASK', payload: { folder, original, updated } });
          };
    
          const handleTaskChange = (taskName: string) => {
            if (state.selectedTask && state.selectedFolder) {
              const updatedTask = { ...state.selectedTask, name: taskName };
              handleEditTask(state.selectedFolder, state.selectedTask, updatedTask);
            }
          };
        
    return {
        state,
        dispatch,
        handleSelectTask,
        deleteTask,
        handleAddTask,
        handleTaskNameChange,
        handleTaskPriorityChange,
        handleTaskStatusChange,
        handleTaskDueDateChange,
        handleSubmit,
        handleRemoveTask,
        handleEditTask,
        handleTaskChange,
        setNewTask,
        newTask,
      }
    }
  export default TasksActions;