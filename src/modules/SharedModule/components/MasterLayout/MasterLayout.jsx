import React from "react";
import Sidebar from "../../../SharedModule/components/SideBar/SideBar";
import { Outlet } from "react-router-dom";
import NavBar from "../NavBar/NavBar";


export default function MasterLayout() {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="w-100 vh-100 overflow-auto">
        <NavBar />
        <Outlet />
      </div>
    </div>
  );
}
