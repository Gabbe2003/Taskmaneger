import React, { useState, useEffect, useRef } from 'react';
import { EnvelopeSimple , ShareNetwork } from '@phosphor-icons/react';
// import { BrowserRouter, Route,Link, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
// import About from './About';
// import FolderActions from '../FolderActions/folderActions.tsx';

const Menu = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [showShareIcon, setShowShareIcon] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);


  const openChat = () => {
    setIsChatOpen(true);
  }

  const closeChat = () => {
    setIsChatOpen(false);
  }

  const toggleNav = () => {
    setIsOpen(!isOpen);
  }

  const shareRef = useRef();

  const handleShare = () => {
    // Here you can implement your email sharing logic
    console.log(`Sharing with ${email}`);
    setShowShareIcon(true);
    setEmail(''); // Reset email input after sharing
  }

  useEffect(() => {
    const handleMouseDown = (event) => {
      if (shareRef.current && !shareRef.current.contains(event.target)) {
        setIsShareOpen(false);
      }
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, []);

  
// const [isDarkMode, setIsDarkMode] = useState(false);  // State to keep track of current theme

// useEffect(() => {
//   document.body.classList.toggle('dark-theme', isDarkMode);
//   document.body.classList.toggle('light-theme', !isDarkMode);
// }, [isDarkMode]);

return (
  <>
    <div className="d-flex position-fixed top-0 end-0 m-3">
      <button className="btn btn-primary mt-2 position-fixed bottom-0 end-0 m-3 rounded" onClick={openChat}>Chat</button>
      <button className="btn btn-primary mt-2 position-fixed top-0 end-0 m-3 rounded" onClick={() => setIsShareOpen(!isShareOpen)}>{isShareOpen ? 'Close' : 'Share'}</button><br></br>
    </div>

    {isShareOpen && (
      <div ref={shareRef} className="position-fixed top-0 end-0 p-3 border bg-white rounded shadow-lg" style={{ maxWidth: '300px', zIndex: '9' }} onMouseDown={(e) => e.stopPropagation()}>
        <form onSubmit={(e) => e.preventDefault()}>
          <h1>Share</h1>

          <label htmlFor="email"><b>Email</b></label>
          <input type="email" className="form-control my-3 bg-light rounded" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required />

          <button type="button" className="btn btn-secondary w-100 rounded mt-2" onClick={handleShare}>
            {showShareIcon ? <ShareNetwork weight="fill" /> : <EnvelopeSimple weight="fill" />}
          </button>
        </form>
      </div>
    )}

    {isChatOpen && (
      <div className="position-fixed bottom-0 end-0 p-3 border bg-white rounded shadow-lg" style={{ maxWidth: '300px', zIndex: '9' }}>
        <form action="/action_page.php">
          <h1>Chat</h1>

          <label htmlFor="msg"><b>Message</b></label>
          <textarea className="form-control my-4 bg-light rounded" placeholder="Type message.." name="msg" required />

          <button type="submit" className="btn btn-success w-100 mb-2 rounded" onMouseOver={e => e.target.style.backgroundColor = 'darkgreen'} onMouseOut={e => e.target.style.backgroundColor = ''}>Send</button>
          <button type="button" className="btn btn-danger w-100 rounded" onClick={closeChat} onMouseOver={e => e.target.style.backgroundColor = 'darkred'} onMouseOut={e => e.target.style.backgroundColor = ''}>Close</button>
        </form>
      </div>
    )}
  </>
);
}

export default Menu;

  //  <div className={`menu-container ${isOpen ? 'expanded' : ''}`}>
  //     <button className="btn btn-primary position-relative top-0 end-1 right-5" onClick={toggleNav}>Toggle Menu</button>
  //     {isOpen && (
  //       <div className="sidebar bg-dark text-white p-3">
  //         <Link to="/">Home</Link><br></br>
  //         <Link to="/About">About</Link>
  //       </div>
  //     )}
  //   </div>

  //   <Routes>
  //     <Route path="/" element={<FolderActions />} />
  //     <Route path="/About" element={<About />} />
  //   </Routes>
  // </BrowserRouter>
// );
