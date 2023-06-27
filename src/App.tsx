import React, { } from 'react';
import FolderActions from './FolderActions/folderActions.tsx';
import FolderFunctions from './FolderActions/folderFunctions.tsx';

export interface Task {
  id: string;
  name: string;
  subTask: string;
  priority: 'low' | 'medium' | 'high';
  status: "completed" | "in progress" | "pending";
  dueDate: string;
  folderId: string;
}

export interface Folder {
  id: string;
  name: string;
  tasks: Task[];
  favorite?: boolean;
}

export interface State {
  name: string;
  editTask: Task[];
  tasks: Task[];
  folders: Folder[];
  subTask: string;
  selectedFolder: Folder | null;
  editingFolder: Folder | null;
  folderName: string;
  taskName: string;
  taskPriority: 'low' | 'medium' | 'high';
  taskStatus: "completed" | "in progress" | "pending";
  taskDueDate: string;
  search: string;
  selectedTask: Task | string | null;
}

export const initialState: State = {
name:'',
editTask: [],
tasks: [],
folders: [],
subTask: '',
selectedFolder: null,
editingFolder: null,
folderName: '',
taskName: '',
taskPriority: 'low',
taskStatus: "pending",
taskDueDate: '',
search: '',
selectedTask: '',

}
const App: React.FC = () => {
  const folderProps = FolderFunctions();
  return (
    <>
       <FolderActions {...folderProps} 
       />
    </>
  )
}
export default App