import React,{ useState, useReducer, } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Folder, State, Task } from '../App.tsx';

export type Action = 
| { type: 'ADD_TASK', payload: { folder: Folder, task: Task }}
| { type: 'ADD_FOLDER', payload: Folder }
| { type: 'EDIT_FOLDER', payload: { original: Folder, updated: Folder } }
| { type: 'SET_FOLDERS', payload: Folder[] }
| { type: 'SET_SELECTED_FOLDER', payload: Folder | null }
| { type: 'SET_EDITING_FOLDER', payload: Folder }
| { type: 'EDIT_TASK', payload: { original: Task, updated: Task }}
| { type: 'SET_SELECTED_TASK', payload: Task | null }
| { type: 'REMOVE_TASK', payload: { folder: Folder, task: Task } }
| { type: 'SET_FOLDER_NAME', payload: string }
| { type: 'SET_TASK_PRIORITY', payload: 'low' | 'medium' | 'high' }
| { type: 'SET_TASK_NAME', payload: string }
| { type: 'SET_TASK_DUE_DATE', payload: string }
| { type: 'REMOVE_FOLDER', payload: Folder }
| { type: 'SET_TASK_STATUS', payload: 'completed' | 'in progress' | 'pending' }
| { type: 'SET_SEARCH', payload: string }
| { type: 'UPDATED_TASK', payload: { original: Task, updated: Task} }
| { type: 'SET_SUBTASK', payload: string };


export const reducer = ( state: State, action: Action ) => {
  switch(action.type) {
      case 'ADD_TASK':
        return {...state,folders: state.folders.map(folder => folder.id === action.payload.folder.id ? { ...folder, tasks: [...folder.tasks, action.payload.task] } : folder)};
      case 'SET_TASK_NAME':
        return { ...state, taskName: action.payload };
      case 'SET_SUBTASK':
        return { ...state, subTask: action.payload };
      case 'SET_TASK_DUE_DATE':
        return { ...state, taskDueDate: action.payload };
      case 'SET_TASK_STATUS':
        return { ...state, taskStatus: action.payload };
      case 'SET_TASK_PRIORITY':
        return { ...state, taskPriority: action.payload };
      case 'ADD_FOLDER':
        return { ...state, folders: [...state.folders, action.payload] };
      case 'SET_FOLDERS':
        return { ...state, folders: action.payload };
      case 'SET_SELECTED_FOLDER':
        return { ...state, selectedFolder: action.payload };
      case 'SET_SELECTED_TASK':
        return { ...state, selectedTask: action.payload };
      case 'SET_EDITING_FOLDER':
        return { ...state, editingFolder: action.payload };
      case 'SET_FOLDER_NAME':
        return { ...state, folderName: action.payload };
      case 'SET_SEARCH':
        return { ...state, search: action.payload };
      case 'REMOVE_FOLDER':
        return {
          ...state,
          folders: state.folders.filter(folder => folder.id !== action.payload.id),
            };
      case 'REMOVE_TASK':
        return {...state,folders: state.folders.map(folder =>folder.id === action.payload.folder.id ? { ...folder, tasks: folder.tasks.filter(task => task.id !== action.payload.task.id) }
                : folder
            ),
              } 
      case 'EDIT_FOLDER':
        return { ...state, folders: state.folders.map(folder => folder.id === action.payload.original.id ? action.payload.updated : folder )};
      case 'EDIT_TASK':
        return {
          ...state,
          folders: state.folders.map((folder) =>
            folder.id === action.payload.original.folderId
              ? {
                  ...folder,
                  tasks: folder.tasks.map((task) =>
                    task.id === action.payload.original.id ? action.payload.updated : task
                  ),
                }
              : folder
          ),
        };
        case 'UPDATED_TASK':
        return {...state, payload: action.payload}
        default:
        return state;
    }
}

export const initialState: State = {
  name: '',
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
  subTask: '',
  editTask: [],
}

export function FolderFunctions() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isediting, setIsediting] = useState<boolean | null>(null);
  const [overlayVisible, setOverlayVisible] = useState<boolean | null>(false);
  const [openedMenu, setOpenedMenu] = useState<string | null>(null);
  const [openedFolder, setOpenedFolder] = useState<string | null>(null);
  const { taskName, taskDueDate, selectedFolder } = state;  
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [currentFolder, setCurrentFolder] = useState<Folder | null>(null);
  const [selectedTask, setSelectedTask] = useState<state | null>(null);


  //create a new folder
  const handleCreateFolder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (state.folderName.trim() === '') {
      return;
    }

    const newFolder: Folder = {
      id: uuidv4(),
      name: state.folderName,
      tasks: [],
      
    };
    dispatch({ type: 'ADD_FOLDER', payload: newFolder });
    dispatch({ type: 'SET_FOLDER_NAME', payload: '' });
    dispatch({ type: 'SET_SELECTED_FOLDER', payload: newFolder });
  }

  //change folder name
  const handleFolderChange = (name: string) => {
    if (selectedFolder) {
      const updatedFolder = { ...selectedFolder, name: name };
      handleUpdateFolder(selectedFolder, updatedFolder);
    }
  };

  //create a new task inside of the folder
  let newTask: Task | null = null;
  const addTaskToCurrentFolder = () => {
    if (selectedFolder && taskName.trim() !== '') {
       newTask = {
        id: uuidv4(),
        name: taskName,
        subTask: state.subTask,
        dueDate: taskDueDate,
        status: state.taskStatus,
        priority: state.taskPriority,
        folderId: selectedFolder.id,
      };
      handleAddTask(selectedFolder, newTask);
      setOverlayVisible(false);
    } else {
      return newTask
    }
  };

  const updateTaskInCurrentFolder = (Task) => {
    if (selectedFolder && selectedTask && taskName.trim() !== '') {
      const updatedTask = {
        name: taskName,
        subTask: state.subTask,
        dueDate: taskDueDate,
        status: state.taskStatus,
        priority: state.taskPriority,
        folderId: selectedFolder.id,
      };
      console.log(updatedTask)
      dispatch({ type: 'UPDATED_TASK', payload: Task })
      setOverlayVisible(false);
    } else {
      return
    }
  };

  const handleViewFolder = (id: string) => {
    if (openedFolder === id) {
      setOpenedFolder(null); 
  }else {
      setOpenedFolder(id);
      const selectedFolder = state.folders.find((folder) => folder.id === id);
      if (selectedFolder) {
        setSelectedFolder(selectedFolder);
      }
    }
    }
  
  const toggleMenu = (id: string) => {
    if (openedMenu === id) {
      setOpenedMenu(null);
    } else {
      setOpenedMenu(id);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isediting) {
      updateTaskInCurrentFolder();
    } else {
      addTaskToCurrentFolder();
    }
    // Reset the form fields to their initial state
    dispatch({ type: 'SET_TASK_NAME', payload: '' });
    dispatch({ type: 'SET_SUBTASK', payload: '' });
    dispatch({ type: 'SET_TASK_DUE_DATE', payload: '' });
    dispatch({ type: 'SET_TASK_STATUS', payload: 'pending' });
    dispatch({ type: 'SET_TASK_PRIORITY', payload: 'low' });
  
    setIsediting(false); // Exit editing mode
  };
  
  const handleEditFolder = (folder: Folder) => {
    dispatch({ type: 'SET_EDITING_FOLDER', payload: folder });
    dispatch({ type: 'SET_SELECTED_FOLDER', payload: folder });
    setIsediting(true);
  };

  const handleEditTask = (task: Task) => {
    dispatch({ type: 'SET_SELECTED_TASK', payload: task });
    setIsediting(true);
    setOverlayVisible(true);
  };

const handleAddTask = (folder: Folder, task: Task) => {
  dispatch({ type: 'ADD_TASK', payload: { folder, task }});
};
const handleTaskNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setSelectedTask({...selectedTask, name: e.target.value});
  dispatch({type: 'SET_TASK_NAME', payload: e.target.value});
};

const handlesubTaskChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  setSelectedTask({...selectedTask, subTask: e.target.value});
  dispatch({type: 'SET_SUBTASK', payload: e.target.value});
};

const handleTaskDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setSelectedTask({...selectedTask, dueDate: e.target.value});
  dispatch({type: 'SET_TASK_DUE_DATE', payload: e.target.value});
};

const handleTaskPriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  setSelectedTask({...selectedTask, priority: e.target.value as 'low' | 'medium' | 'high'});
  dispatch({type: 'SET_TASK_PRIORITY', payload: e.target.value as 'low' | 'medium' | 'high'});
};

const handleTaskStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  setSelectedTask({...selectedTask, status: e.target.value as 'completed' | 'in progress' | 'pending'});
  dispatch({type: 'SET_TASK_STATUS', payload: e.target.value as 'completed' | 'in progress' | 'pending'});
};

const handleRemoveFolder = (folder: Folder) => {
  dispatch({ type: 'REMOVE_FOLDER', payload: folder });
};

const setSelectedFolder = (folder: Folder | null) => {
  dispatch({ type: 'SET_SELECTED_FOLDER', payload: folder });
}

  const handleUpdateFolder = (original: Folder, updated: Folder) => {
    dispatch({ type: 'EDIT_FOLDER', payload: { original, updated } });
  };

  const handleFolderNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_FOLDER_NAME', payload: e.target.value });
    setIsediting(false);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_SEARCH', payload: e.target.value });
  };

  return {
    isediting,
    setIsediting,
    updateTaskInCurrentFolder,
    handleSubmit,
    selectedTask,
    handleEditTask,
    handlesubTaskChange,
    handleViewFolder,
    setOpenedFolder,
    openedFolder,
    handleTaskNameChange,
    handleTaskDueDateChange,
    handleTaskPriorityChange,
    handleTaskStatusChange,
    addTaskToCurrentFolder,
    state, 
    overlayVisible, 
    openedMenu, 
    handleSearch,
    handleCreateFolder, 
    handleFolderChange,
    handleEditFolder,
    handleFolderNameChange,
    handleRemoveFolder,
    setOverlayVisible,
    setOpenedMenu, 
    toggleMenu,
    setSelectedFolder: (folder: Folder ) => dispatch({ type: 'SET_SELECTED_FOLDER', payload: folder })
  } 
}
export default FolderFunctions