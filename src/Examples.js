| { type: 'ADD_TASK', payload: { folder: Folder, task: Task }}
| { type: 'UPDATED_TASK', payload: { original: Task, updated: Task} }
| { type: 'SET_SELECTED_TASK', payload: Task | null }



export const reducer = ( state: State, action: Action ) => {
  switch(action.type) {
    case 'EDIT_TASK':
      return {
        ...state,
        folders: state.folders.map((folder) =>
        ({
          ...folder,
          tasks: folder.tasks.map((task) =>
            task.id === action.payload.original.id ? action.payload.updated : task
          ),
        }))
      };
      case 'UPDATE_TASK':
        const updatedFolders = state.folders.map((folder) => {
          if (folder.id === action.payload.folderId) {  // Make sure we're only updating the correct folder
            return {
              ...folder,
              tasks: folder.tasks.map((task) =>
                task.id === action.payload.original.id ? action.payload.updated : task
              ),
            };
          } else {
            return folder;
          }
        });
        return { ...state, folders: updatedFolders };
  case 'ADD_TASK':
      return {
        ...state,
        folders: state.folders.map(folder => folder.id === action.payload.folder.id ? { ...folder, tasks: [...folder.tasks, action.payload.task] } : folder)
      };
      case 'SET_SELECTED_TASK':
        return { ...state, selectedTask: action.payload };
      
 
          {/* Task display section */}
          {folder.tasks.map((task) => (
            <div key={task.id} style={{ display: openedFolder === folder.id ? 'block' : 'none' }}>
              <h4>{task.name || 'No Task Name Provided'}</h4>
              <button onClick={() => {
                handleEditTask(task);
                setIsediting(true);
                // console.log('folder: ', folder.tasks, 'task',task);
              }}
                >View task</button>
                <button onClick={() =>{
                  handleRemoveTask(folder,task);
                  setIsediting(false);
                  console.log('folder: ', folder.tasks, 'task',task);
                }} >Delete</button>
            </div>
          ))}


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
  selectedTask: '',
  subTask: '',
  editTask: [],
}

type TaskType = {
  name?: string,
  subTask?: string;
  dueDate?: string;
  priority?: string;
  status?: string;
  folderId?: string;
  id?: string;
  folderId?: string | number;
};

const [state, dispatch] = useReducer(reducer, initialState);
  const [isediting, setIsediting] = useState<boolean | null>(null);
  const [overlayVisible, setOverlayVisible] = useState<boolean | null>(false);
  const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);
  

  const handleEditTask = (task: Task) => {
    dispatch({ type: 'SET_SELECTED_TASK', payload: task });
    setTimeout(() => {
      setIsediting(true);
      setOverlayVisible(true);
    }, 0);
  };

  const updateTaskInCurrentFolder = (e) => {
    e.preventDefault();
    if (selectedFolder && selectedTask && DOMPurify.sanitize(taskName.trim()) !== '' && isediting) {
      const updatedTask = {
        name: taskName,
        id: selectedTask.id, // use the id of the selectedTask, not the folder
        subTask: state.subTask,
        dueDate: taskDueDate,
        status: state.taskStatus,
        priority: state.taskPriority,
      };
      if(!selectedTask.id) {
        console.error("selectedTask id is undefined!");
        return null;
      }
      dispatch({
        type: 'UPDATE_TASK',
        payload: {
          original: selectedTask, // The task before updates
          updated: updatedTask, // The task after updates
          folderId: selectedFolder.id // Add the folderId to the payload
        }
      });
      
      setIsediting(false);
      setSelectedTask(null);
      setOverlayVisible(false);
      return updatedTask;
    } else {
      return null; 
    }
  };
  //create a new task inside of the folder
  let newTask: Task | null = null;
  const addTaskToCurrentFolder = (e) => {
    e.preventDefault();
    if (selectedFolder && DOMPurify.sanitize(taskName.trim()) !== '') {
      newTask = {
        id: uuidv4(),
        name: taskName,
        subTask: state.subTask,
        dueDate: taskDueDate,
        status: state.taskStatus,
        priority: state.taskPriority,
      };
      handleAddTask(selectedFolder, newTask);
      setOverlayVisible(false);
    } else {
      return newTask
    }
  };