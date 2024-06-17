import React from "react";
import { ThreeDots } from "react-loader-spinner";

export default function Loading() {
  return (
    <div className="text-center d-flex justify-content-center p-5">
      <ThreeDots
        visible={true}
        height="80"
        width="80"
        color="#4fa94d"
        radius="9"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
}
