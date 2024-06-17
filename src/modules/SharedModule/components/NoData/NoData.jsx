import React from "react";
import logo from "../../../../assets/images/noData.svg";

export default function NoData() {
  return (
    <div className="text-center p-3">
      <img src={logo} alt="" className="w-25" />
      <div className="my-2">
        <h5>No Data !</h5>
      </div>
    </div>
  );
}
