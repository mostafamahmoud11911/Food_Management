import React from "react";
import Header from "../../../SharedModule/components/Header/Header";
import RecipeHeader from "../../../SharedModule/components/RecipeHeader/RecipeHeader";
import { useAuth } from "../../../../context/AuthContext";
import logo from "../../../../assets/images/logo-header.png";

export default function Dashboard() {
  const { loginUser } = useAuth();


  return (
    <div>
      <Header
        title="Welcome"
        word={loginUser?.userName}
        desc="This is a welcoming screen for the entry of the application , you can now see the options"
        imgUrl={logo}
      />
      <RecipeHeader />
    </div>
  );
}
