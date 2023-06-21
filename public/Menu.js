import React from 'react'
import './Menu.css'
import { CaretRight, CaretLeft } from "@phosphor-icons/react";



const Menu = () => {
    /* Set the width of the side navigation to 250px */
function openNav() {
    document.getElementById("mySidenav").style.width = "25vh";
  }
  
  /* Set the width of the side navigation to 0 */
  function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }
  return (
    <div>
      <div id="mySidenav" className="sidenav">
  <CaretLeft size={30} a href="#s" className="closebtn" onClick={closeNav} />
  <a href="#s">About</a>
  <a href="#a">Services</a>
  <a href="#df">Contact</a>
</div>

<CaretRight size={30} span onClick={openNav} />
    </div>
  )
}

export default Menu
