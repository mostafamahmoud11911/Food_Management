import "./App.css";
import { createBrowserRouter, createHashRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MasterLayout from "./modules/SharedModule/components/MasterLayout/MasterLayout";
import AuthLayout from "./modules/SharedModule/components/AuthLayout/AuthLayout";
import NotFound from "./modules/SharedModule/components/NotFound/NotFound";
import Dashboard from "./modules/HomeModule/components/Dashboard/Dashboard";
import CategoryList from "./modules/CategoryModule/components/CategoryList/CategoryList";
import FavList from "./modules/FavModule/components/FavList/FavList";
import RecipeList from "./modules/RecipesModule/components/RecipeList/RecipeList";
import RecipeData from "./modules/RecipesModule/components/RecipeList/RecipeData";
import UserList from "./modules/UserModule/components/UserList/UserList";
import Login from "./modules/AuthModule/components/Login/Login";
import Register from "./modules/AuthModule/components/Register/Register";
import ForgetPass from "./modules/AuthModule/components/ForgetPass/ForgetPass";
import VerifyAcc from "./modules/AuthModule/components/VerifyAcc/VerifyAcc";
import ResetPass from "./modules/AuthModule/components/ResetPass/ResetPass";
import ProductedRoute from "./modules/SharedModule/components/ProductedRoute/ProductedRoute";

function App() {
  const router = createHashRouter([
    {
      path: "dashboard",
      element: (
        <ProductedRoute>
          <MasterLayout />
        </ProductedRoute>
      ),
      errorElement: <NotFound />,
      children: [
        {
          index: true,
          element: <Dashboard />,
        },
        {
          path: "",
          element: <Dashboard />,
        },
        {
          path: "categories",
          element: (

              <CategoryList />

          ),
        },
        {
          path: "favorites",
          element: <FavList />,
        },
        {
          path: "recipes",
          element: <RecipeList />,
        },
        {
          path: "recipedata",
          element: <RecipeData />,
        },
        {
          path: "recipeedit",
          element: <RecipeData />,
        },
        {
          path: "users",
          element: <UserList />,
        },
      ],
    },
    {
      path: "/",
      element: <AuthLayout />,
      errorElement: <NotFound />,
      children: [
        {
          index: true,
          element: <Login />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/forgetpass",
          element: <ForgetPass />,
        },
        {
          path: "/verifyacc",
          element: <VerifyAcc />,
        },
        {
          path: "/resetpass",
          element: <ResetPass />,
        },
      ],
    },
  ]);

  return (
    <div className="App">
      <ToastContainer />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
