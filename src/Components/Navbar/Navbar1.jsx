import React from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { getAuth, reload, signOut  } from "firebase/auth";
import {useNavigate, NavLink} from "react-router-dom"


const Navbar1 = ({setHasAccount}) => {
const auth = getAuth();

const navigate = useNavigate()

const handleLogOut = ()=>{
  signOut(auth).then(() => {
    navigate("/dashboard");
    reload()
    console.log("sucess");
    // Sign-out successful.
    setHasAccount(false)
  }).catch((error) => {
    // An error happened.
  });  
}
  return (
    <Navbar bg="dark" variant="dark">
    <Container>
      <Navbar.Brand>Dashboard</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <NavLink to="/category" className="nav-link">Category</NavLink>
        </Nav>
        <Nav className="ms-auto">
          <Nav.Link href="/" onClick={handleLogOut}>Log Out</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar> 
)}

export default Navbar1