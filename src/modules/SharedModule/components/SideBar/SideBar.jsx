import React, { useState } from "react";
import { Menu, MenuItem, Sidebar } from "react-pro-sidebar";
import { useAuth } from "../../../../context/AuthContext";
import logo from "../../../../assets/images/3.png";
import { Link, useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
import ChangePass from "../../../AuthModule/components/ChangePass/ChangePass";

export default function SideBar() {
  const [collapse, setCollapse] = useState(false);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate();
  const { setLoginUser, loginUser } = useAuth();

  const logout = () => {
    setLoginUser(null);
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <ChangePass handleClose={handleClose} />
      </Modal>

      <div className="sidebar-container">
        <Sidebar collapsed={collapse}>
          <Menu>
            <div className="logo-side">
              <MenuItem
                icon={<img src={logo} className="m-2" alt="" />}
                className=" p-1 d-flex justify-content-start"
                collapsed={collapse}
                onClick={() => setCollapse(!collapse)}
              ></MenuItem>
            </div>

            <MenuItem
              component={<Link to="/dashboard" />}
              icon={<i className="fa fa-home"></i>}
            >
              Home
            </MenuItem>
            {loginUser?.userGroup === "SuperAdmin" ? (
              <MenuItem
                component={<Link to="/dashboard/users" />}
                icon={<i className="fa-solid fa-user-group"></i>}
              >
                Users
              </MenuItem>
            ) : null}

            <MenuItem
              component={<Link to="/dashboard/recipes" />}
              icon={<i className="fa-solid fa-utensils"></i>}
            >
              Recipes
            </MenuItem>
            {loginUser?.userGroup === "SystemUser" ? (
              <MenuItem
                component={<Link to="/dashboard/favorites" />}
                icon={<i className="fa-regular fa-heart"></i>}
              >
                Favorites
              </MenuItem>
            ) : null}

            {loginUser?.userGroup !== "SystemUser" ? (
              <MenuItem
                component={<Link to="/dashboard/categories" />}
                icon={<i className="fa-solid fa-table-cells"></i>}
              >
                Category
              </MenuItem>
            ) : null}

            <MenuItem
              onClick={handleShow}
              icon={<i className="fa-solid fa-unlock"></i>}
            >
              Change Password
            </MenuItem>
            <MenuItem
              icon={<i className="fa-solid fa-arrow-right-from-bracket"></i>}
              onClick={logout}
            >
              Log out
            </MenuItem>
          </Menu>
        </Sidebar>
      </div>
    </>
  );
}
