| { type: 'ADD_TASK', payload: { folder: Folder, task: Task }}
| { type: 'UPDATED_TASK', payload: { original: Task, updated: Task} }



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

          </form >
        </div>
        <div className="card-footer">
          <button className="btn btn-primary w-100"
            onClick={(e) => { 
            console.log('folder: ', folder);
            setOverlayVisible(true); 
            setSelectedFolder(folder); }}
          >+</button>
        </div>
      </div>
    </div>
}}


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
  const [openedMenu, setOpenedMenu] = useState<string | null>(null);
  const [openedFolder, setOpenedFolder] = useState<string | null>(null);
  const { taskName, taskDueDate, selectedFolder } = state;  
  const [updatedTask] = useState<null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [showOverlay, setShowOverlay] = useState<boolean>(false);
  const [deleteOverlay, setDeleteOverlay] = useState<boolean>(false);
  const [selectedDeleter, setselectedDeleter] = useState<string>('');
  const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);
  

  const updateTaskInCurrentFolder = (e) => {
    e.preventDefault();
    if (selectedFolder && selectedTask && DOMPurify.sanitize(taskName.trim()) !== '') {
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
      console.log('selectedTask:', selectedTask);
      console.log('updatedTask:', updatedTask);
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

  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isediting) {
      updateTaskInCurrentFolder(e);
    } else {
      addTaskToCurrentFolder(e);
    }
    // Reset the form fields to their initial state
    dispatch({ type: 'SET_TASK_NAME', payload: '' });
    dispatch({ type: 'SET_SUBTASK', payload: '' });
    dispatch({ type: 'SET_TASK_DUE_DATE', payload: '' });
    dispatch({ type: 'SET_TASK_STATUS', payload: 'pending' });
    dispatch({ type: 'SET_TASK_PRIORITY', payload: 'low' });
  };