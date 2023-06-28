import React, { useEffect, useRef } from 'react';
import { FolderFunctions } from './folderFunctions.tsx';
import { Star } from 'phosphor-react';
// import {MyComponent, menuRef } from './functionalitis.jsx';
import './Style.css';

type FolderActionsProps = ReturnType<typeof FolderFunctions>;

const FolderActions: React.FC<FolderActionsProps> = (props, ) => {

  const {
    setSelectedTask,
    handleSubmit,
    confirmDelete,
    setDeleteOverlay,
    deleteOverlay,
    handleToggleFavorite,
    selectedDate,
    showOverlay,
    setShowOverlay,
    handleRemoveTask,
    isediting,
    setIsediting,
    updateTaskInCurrentFolder,
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

  const menuRef = useRef<HTMLDivElement | null>(null);
  
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setTimeout(() => {
          setOpenedMenu(null);
        }, 0);
      }
    };
      
    document.addEventListener('mousedown', handleClickOutside);
      
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setOpenedMenu]);
  
  const { selectedFolder } = state;

  const isEditingRef = useRef(isediting);

  useEffect(() => {
    isEditingRef.current = isediting;
  }, [isediting]);
  
  return (
    <div className='container'>
     
      <div className="d-flex flex-wrap justify-content-between align-items-center">
        <h1 className="my-4">Task Organizer</h1>
        <div className="position-relative ms-auto w-25">
          <input type="text"
            placeholder="Search"
            value={state.search}
            className="form-control"
            onChange={handleSearch}
          />
          <div>
          <button className="btn btn-primary mt-2"  onClick={()=> setDeleteOverlay(true)}>Remove All</button>
          </div>
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
            required
          />
          <button className="btn btn-primary mt-2" type="submit" >Create Folder</button>
        </div>
      </form>
  
      <div className="row row-cols-1 row-cols-md-3 g-3">
        {state.folders
          .filter(
            (folder) =>
              folder.name.toLowerCase().includes(state.search.toLowerCase()) ||
              folder.tasks.some((task) =>
                task.name.toLowerCase().includes(state.search.toLowerCase())
              )
              ).sort((a, b) => (Number(b.favorite) - Number(a.favorite)))
              .map((folder) => (
            <div className="col-md-4 position-relative " key={folder.id}>
              <div className="card h-100">
                <div 
                ref={menuRef} 
                className="dropdown position-absolute top-0 end-0"
                onMouseDown={e => e.stopPropagation()}
                  >
                <button 
                  onClick={(e) => {
                  e.stopPropagation();
                  toggleMenu(folder.id);
                   }}
                   className="btn btn-lg"
                  type="button" id="dropdownMenuButton" 
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                  >
                    ...
                  </button>
                  {openedMenu === folder.id && (
                    <ul className="dropdown-menu show" style={{ position: 'absolute', left: 30 }}>
                      <li><button className="dropdown-item" onClick={() => handleRemoveFolder(folder)}>Delete Folder</button></li>
                      <li><button className="dropdown-item" onClick={() => handleEditFolder(folder)}>Edit Folder</button></li>
                      <li><button className="dropdown-item" onClick={() => handleViewFolder(folder.id )}>Open Folder</button></li>
                      <li><button className="dropdown-item" onClick={() => handleToggleFavorite(folder.id)}>Favorit</button></li>
                    </ul>
                  )}
                </div>
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
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
                      onClick={() => { handleEditFolder(folder); setOpenedMenu(null)}} 
                      onBlur={() => setOpenedFolder(null)}>
                        {folder && folder.name ? folder.name : 'No Folder Name'}
                      </h2>
                    )}
                  <Star 
                      weight="fill" 
                      size={24} 
                      onClick={() => handleToggleFavorite(folder.id)}
                      className={`star-icon ${folder.favorite ? 'favorite' : ''}`} 
                    />
                     {/* Task display section */}
                     {folder.tasks.map((task) => (
                    <div key={task.id} style={{ display: openedFolder === folder.id ? 'block' : 'none' }}>
                      <h4>{task.name || 'No Task Name Provided'}</h4>
                      <button onClick={() => {
                        handleEditTask(task);
                        setSelectedTask(task);
                        setIsediting(true);
                        // console.log('folder: ', folder.tasks, 'task',task);
                      }}
                        >View task</button>
                        <button onClick={() =>{
                          handleRemoveTask(folder,task);
                          setIsediting(false);
                        }} >Delete</button>
                    </div>
                  ))}
                  </form >
                </div>
                <div className="card-footer">
                  <button className="btn btn-primary w-100"
                    onClick={(e) => { 
                    setOverlayVisible(true); 
                    setSelectedFolder(folder); }}
                  >+</button>
                </div>
              </div>
            </div>
        ))}
      </div>
  
      {overlayVisible && selectedFolder !== null && (
      <form onSubmit={isediting ? updateTaskInCurrentFolder : addTaskToCurrentFolder}>
        <div className="position-fixed top-0 start-0 end-0 bottom-0 d-flex align-items-center justify-content-center" style={{backgroundColor: 'rgba(0, 0, 0, 0.8)', zIndex: 1}}>
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
                  />
                </label>
  
                <label className="w-100 h-100">
                  Task Description:
                  <textarea
                    className="form-control my-2 form-control-lg h-50"
                    value={selectedTask ? selectedTask.subTask : ""}
                    onChange={handlesubTaskChange}
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
                    <button type="submit" className="btn btn-primary">
                      {isediting ? 'Update' : 'Add'}
                    </button>
                    <button type="button" className="btn btn-secondary ms-2" onClick={() => { setOverlayVisible(false); setIsediting(false); }}>Close</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
      )}


{showOverlay && selectedFolder !== null &&(
  <div className="position-fixed top-0 start-0 end-0 bottom-0 d-flex align-items-center justify-content-center bg-dark bg-gradient" style={{zIndex: 2}}>
    <div className="p-5 bg-white rounded shadow d-flex flex-column justify-content-around align-items-center" style={{width: '60%', height: '60%'}}>
      <h2 className="text-center mb-4">Would you like to receive a notification when the date is closing by?</h2>
      <h2 className="text-center mb-4">{selectedDate}</h2>
      <div>
        <button className="btn btn-primary btn-lg me-5" onClick={() => setShowOverlay(false)}>Yes</button>
        <button className="btn btn-secondary btn-lg" onClick={() => setShowOverlay(false)}>No</button>
      </div>
    </div>
  </div>
)}

{deleteOverlay && (
    <div className="position-fixed top-0 start-0 end-0 bottom-0 d-flex align-items-center justify-content-center bg-dark bg-gradient" style={{zIndex: 3}}>
    <div className="p-5 bg-white rounded shadow d-flex flex-column justify-content-around align-items-center" style={{width: '60%', height: '60%'}}>
        <h2 className="text-center mb-4">Are you sure you want to delete all folders?</h2>
        <div>
        <button className="btn btn-primary btn-lg me-5" onClick={confirmDelete}>Yes</button>
        <button className="btn btn-secondary btn-lg" onClick={() => setDeleteOverlay(false)}>No</button>
        </div>
    </div>
    </div>
)}
</div>
)}
  
export default FolderActions;