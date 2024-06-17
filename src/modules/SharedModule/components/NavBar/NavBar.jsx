import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import logo from "../../../../assets/images/avatar.png";
import { useAuth } from "../../../../context/AuthContext";

export default function NavBar() {
  const { loginUser } = useAuth();

  return (
    <div>
      <Navbar expand="lg" className="bg-body-tertiary mb-2">
        <Container>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <div className="d-flex align-items-center ">
                <div className="d-flex align-items-center gap-2">
                  <img src={logo} alt="" />
                  <span>{loginUser?.userName}</span>
                </div>
                <i className="fa-solid fa-chevron-down mx-4 arrow-icon"></i>
                <span className="position-relative note-container">
                  <i className="fa-solid fa-bell note-icon"></i>
                  <span></span>
                </span>
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}
