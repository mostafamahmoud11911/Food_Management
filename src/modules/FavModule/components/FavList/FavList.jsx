import React, { useEffect, useState } from "react";
import { useToast } from "../../../../context/ToastContext";
import { useAuth } from "../../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "../../../SharedModule/components/Header/Header";
import { Col, Container, Row } from "react-bootstrap";
import NoData from "../../../SharedModule/components/NoData/NoData";
import axios from "axios";
import Loading from "../../../SharedModule/components/Loading/Loading";
import noImg from "../../../../assets/images/noData.svg";

export default function FavList() {
  const [favsList, setFavsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toastValue } = useToast();
  const navigate = useNavigate();
  const { BASE_URL, requestHeaders, setLoginUser, loginUser } = useAuth();

  const getUserFavs = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${BASE_URL}/userRecipe/?pageSize=1000&pageNumber=1`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(`token`)}`,
          },
        }
      );

      setFavsList(data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toastValue("error", error.response.data.message);
    }
  };

  // log out if user trying to go to category will tran user in login and logout
  const logout = () => {
    localStorage.removeItem("token");
    setLoginUser(null);
    navigate("/login");
  };

  const removeFavourite = async (recipeId) => {
    try {
      await axios.delete(`${BASE_URL}/userRecipe/${recipeId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(`token`)}`,
        },
      });
      toastValue("success", "Recipe deleted successfully");
      getUserFavs();
    } catch (error) {
      toastValue("error", error.response.data.message);
    }
  };

  useEffect(() => {
    if (loginUser?.userGroup === "SuperAdmin") {
      logout();
    } else {
      getUserFavs();
    }
  }, []);

  return (
    <>
      <Header
        title="Favourites"
        word="Items"
        desc="You can now add your items that any user can order it from the Application and you can edit"
      />
      <Container>
        <Row>
          {!loading ? (
            <>
              {favsList.length > 0 ? (
                favsList.map((item) => (
                  <Col md={3}>
                    <div className="mt-3 rounded card">
                      <div className="position-relative">
                        <img
                          src={
                            item.recipe.imagePath
                              ? `https://upskilling-egypt.com:3006/` +
                                item.recipe.imagePath
                              : noImg
                          }
                          className="img-fav object-fit-fill"
                          alt=""
                        />
                        <span
                          className="icon-container"
                          style={{ cursor: "pointer" }}
                          onClick={() => removeFavourite(item.id)}
                        >
                          <i className="fa-solid fa-heart icon-fav"></i>
                        </span>
                      </div>
                      <div className="content">
                        <h5>{item.recipe.name}</h5>
                        <p>{item.recipe.description}</p>
                      </div>
                    </div>
                  </Col>
                ))
              ) : (
                <NoData />
              )}
            </>
          ) : (
            <Loading />
          )}
        </Row>
      </Container>
    </>
  );
}
