import React, { } from 'react';
import { FolderFunctions } from './folderFunctions.tsx';
import PencilSimple from 'phosphor-react';

type FolderActionsProps = ReturnType<typeof FolderFunctions>;

const FolderActions: React.FC<FolderActionsProps> = (props) => {

  const {
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
    setSelectedFolder
  } = props;


  const { selectedFolder } = state;
  
  return (
    <div className='container'>
      <div className="d-flex justify-content-between align-items-center">
        <h1 className="my-4">Task Organizer</h1>
        <div className="position-relative ms-auto w-25">
          <input type="text"
            placeholder="Search"
            value={state.search}
            className="form-control"
            onChange={handleSearch}
          />
        </div>
      </div>
      <form onSubmit={handleCreateFolder}>
        <div className="mb-4">
          <input
          
            type="text"
            placeholder="Create a folder"
            value={state.folderName}
            className="form-control"
            onChange={handleFolderNameChange}
          />
          <button className="btn btn-primary mt-2" type="submit">Create Folder</button>
        </div>
      </form>
  
      <div className="row row-cols-1 row-cols-md-4 g-4">
        {state.folders
          .filter(
            (folder) =>
              folder.name.toLowerCase().includes(state.search.toLowerCase()) ||
              folder.tasks.some((task) =>
                task.name.toLowerCase().includes(state.search.toLowerCase())
              )
          )
          .map((folder) => (
            <div className="col position-relative" key={folder.id}>
              <div className="card h-100">
                <div className="dropdown position-absolute top-0 end-0">
                  <button onClick={() => toggleMenu(folder.id)} className="btn btn-lg" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                    ...
                  </button>
                  {openedMenu === folder.id && (
                    <ul className="dropdown-menu show" style={{ position: 'absolute', left: 30 }}>
                      <li><button className="dropdown-item" onClick={() => handleRemoveFolder(folder)}>Delete Folder</button></li>
                      <li><button className="dropdown-item" onClick={() => handleEditFolder(folder)}>Edit Folder</button></li>
                      <li><button className="dropdown-item" onClick={() => handleViewFolder(folder.id)}>Open Folder</button></li>
                    </ul>
                  )}
                </div>
                <div className="card-body">
                  <form onSubmit={(e) => e.preventDefault()}>
                    {folder === state.editingFolder ? (
                      <input
                        type="text"
                        defaultValue={folder && folder.name ? folder.name : ''}
                        onBlur={(e) => handleFolderChange(e.target.value)}
                        autoFocus
                        className="form-control"
                      />
                    ) : (
                      <h2 className="card-title"
                      onClick={() => { handleEditFolder(folder);setOpenedMenu(null)}} 
                      onBlur={() => setOpenedFolder(null)}>
                        {folder && folder.name ? folder.name : 'No Folder Name'}
                      </h2>
                    )}
                     {/* Task display section */}
                     {folder.tasks.map((task) => (
                        openedFolder === folder.id && (
                      <div key={task.id}>
                        <h4>{task.name || 'No Task Name Provided'}</h4>
                        <p>Description: {task.subTask}</p>
                        <p>Status: {task.status}</p>
                        <p>Priority: {task.priority}</p>
                        <p>Due Date: {task.dueDate || 'No Due Date Provided'}</p>
                    <button onClick={() => {
                      handleEditTask(task);
                      setIsediting(true);
                      console.log('folder: ', folder.tasks, 'task',task);}}
                      >View task</button>
                      </div>
                      )
                    ))}
                  </form >
                </div>
                <div className="card-footer">
                  <button className="btn btn-primary w-100"
                  onClick={() => { 
                  console.log('folder: ', folder);
                  setOverlayVisible(true); 
                  setSelectedFolder(folder); }}
                  >+</button>
                </div>
              </div>
              </div>
))}
</div> 
{overlayVisible && selectedFolder !== null && (
  <div className="position-fixed top-0 start-0 end-0 bottom-0 d-flex align-items-center justify-content-center" style={{backgroundColor: 'rgba(0, 0, 0, 0.8)', zIndex: 9999}}>
    <div className="p-5 bg-white rounded d-flex flex-column" style={{color: 'black', width: '60%', height: '80%'}}>
      <div className="d-flex w-100 h-100">
  <div className="me-3" style={{flex: 3}}>
    <label className="w-100">
      Task Name:
      <input 
        type="text"
        className="form-control my-2 form-control-lg"
        value={selectedTask ? selectedTask.name : ""}
        onChange={handleTaskNameChange} 
        /*Don't touch the onchange event, otherwise the onchange won't work*/
      />
    </label>

    <label className="w-100 h-100">
      Task Description:
      <textarea
        className="form-control my-2 form-control-lg h-50"
        value={selectedTask ? selectedTask.subTask : ""}
        onChange={handlesubTaskChange}
        /*Don't touch the onchange event, otherwise the onchange won't work*/
      />
    </label>
  </div>
        <div style={{flex: 1}}>
          <div className="mb-3">
            <label className="d-block">
              Task Due Date:
              <input
                type="date"
                onChange={handleTaskDueDateChange}
                className="form-control my-3"
                value={selectedTask && selectedTask.dueDate ? selectedTask.dueDate : ""}
              />
            </label>
          </div>

          <div>
            <label className="d-block">
              Task Priority:
              <select
                onChange={handleTaskPriorityChange}
                className="form-control my-3"
                value={selectedTask ? selectedTask.priority : ""}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>

            <label className="d-block">
              Task Status:
              <select
                onChange={handleTaskStatusChange}
                className="form-control my-3"
                value={selectedTask ? selectedTask.status : ""}
              >
                <option value="completed">Completed</option>
                <option value="in progress">In progress</option>
                <option value="pending">Pending</option>
              </select>
            </label>

            <div className="d-flex justify-content-between">
    {isediting ? (
        <button type="button" className="btn btn-primary" onClick={updateTaskInCurrentFolder}>Update
        </button>
    ) : (
        <button type="button" className="btn btn-primary" onClick={addTaskToCurrentFolder}>Add</button>
    )}
    <button className="btn btn-secondary ms-2" onClick={() => { setOverlayVisible(false); setIsediting(false); }}>Close</button>
</div>

          </div>
        </div>
      </div>
    </div>
  </div>
)}
</div>
)}
export default FolderActions;
