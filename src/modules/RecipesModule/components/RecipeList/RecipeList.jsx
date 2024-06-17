import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Col,
  Container,
  Dropdown,
  Form,
  InputGroup,
  Modal,
  Row,
} from "react-bootstrap";
import { useToast } from "../../../../context/ToastContext";
import { useAuth } from "../../../../context/AuthContext";
import axios from "axios";
import Loading from "../../../SharedModule/components/Loading/Loading";
import NoData from "../../../SharedModule/components/NoData/NoData";
import Header from "../../../SharedModule/components/Header/Header";
import { Link, useNavigate } from "react-router-dom";
import noImg from "../../../../assets/images/noData.svg";
import DeleteItem from "../../../SharedModule/components/DeleteItem/DeleteItem";
import logo from "../../../../assets/images/logo-header2.png";

export default function RecipeList() {
  const [loading, setLoading] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [show, setShow] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [recipeDetails, setRecipeDetails] = useState({});
  const [recipesList, setRecipesList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [tagsList, setTagsList] = useState([]);
  const [recipeId, setRecipeId] = useState("");
  const [nameValue, setNameValue] = useState("");
  const [tagValue, setTagValue] = useState("");
  const [categoryValue, setCategoryValue] = useState("");
  const [arrayOfPages, setArrayOfPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(null);
  const [selectedRecipeIds, setSelectedRecipeIds] = useState([]);
  const [favList, setFavList] = useState([]);
  const { toastValue } = useToast();
  const { BASE_URL, loginUser } = useAuth();
  const timeoutRef = useRef();

  const handleClose = () => setShow(false);
  const handleShow = (id) => {
    setShow(true);
    setRecipeId(id);
  };

  const handleShowDetails = (id) => {
    setShowDetails(true);
    getRecipeDetails(id);
  };
  const handleCloseDetails = () => setShowDetails(false);

  const navigate = useNavigate();

  const getAllRecipes = async (
    name,
    tagId,
    categoryId,
    pageSize,
    pageNumber
  ) => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${BASE_URL}/Recipe/?pageSize=${pageSize}&pageNumber=${pageNumber}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(`token`)}`,
          },
          params: {
            name,
            tagId,
            categoryId,
          },
        }
      );

      setCurrentPage(data.pageNumber);
      setArrayOfPages(
        Array(data.totalNumberOfPages)
          .fill()
          .map((_, i) => i + 1)
      );
      setLoading(false);
      setRecipesList(data.data);
    } catch (error) {
      setLoading(false);
      toastValue("error", error.response.data.message);
    }
  };

  const getNameRecipe = (e) => {
    getAllRecipes(e.target.value, tagValue, categoryValue, 10, 1);
    setNameValue(e.target.value);
  };

  const getTagRecipe = (e) => {
    getAllRecipes(nameValue, e.target.value, categoryValue, 10, 1);
    setTagValue(e.target.value);
  };

  const getCategoryRecipe = (e) => {
    getAllRecipes(nameValue, tagValue, e.target.value, 10, 1);
    setCategoryValue(e.target.value);
  };

  const getAllCategory = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${BASE_URL}/Category/?pageSize=100&pageNumber=1`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(`token`)}`,
          }
        }
      );
      setCategoriesList(data.data);
    } catch (error) {
      toastValue("error", error.response.data.message);
    }
  };

  const getAllTags = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/Tag`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(`token`)}`,
        }
      });
      setTagsList(data);
    } catch (error) {
      toastValue("error", error.response.data.message);
    }
  };

  const deleteRecipe = async () => {
    setSpinner(true);
    try {
      await axios.delete(`${BASE_URL}/recipe/${recipeId}`,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem(`token`)}`,
        }
      });

      setSpinner(false);
      toastValue("success", "item has been deleted!");
      timeoutRef.current = setTimeout(() => {
        getAllRecipes("", "", "", 10, 1);
        handleClose();
      });
    } catch (error) {
      setSpinner(false);
      toastValue("error", error?.response?.data?.message);
    }
  };

  const getRecipeDetails = async (recipeId) => {
    setLoadingDetails(true);
    try {
      const { data } = await axios.get(`${BASE_URL}/Recipe/${recipeId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(`token`)}`,
        }
      });
      setLoadingDetails(false);
      setRecipeDetails(data);
    } catch (error) {
      setLoadingDetails(false);
      toastValue("error", error?.response?.data?.message);
    }
  };

  const getUserFavs = async () => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/userRecipe/?pageSize=100000&pageNumber=1`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(`token`)}`,
          }
        }
      );

      setFavList(data.data);
      const recipeIds = data.data.map((recipe) => recipe.recipe.id);
      setSelectedRecipeIds(recipeIds);
    } catch (error) {
      toastValue("error", error.response.data.message);
    }
  };

  const addToFavs = async (recipeId) => {
    setSelectedRecipeIds((prev) => [...prev, recipeId]);
    try {
      const { data } = await axios.post(
        `${BASE_URL}/userRecipe`,
        {
          recipeId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(`token`)}`,
          }
        }
      );

      toastValue("success", "Recipe added to your favorites successfully");

      getUserFavs();
    } catch (error) {
      toastValue("error", error.response.data.message);
    }
  };

  const removeFavourite = async (recipeId) => {
    setSelectedRecipeIds((prev) => prev.filter((id) => id !== recipeId));
    try {
      const { data } = await axios.delete(
        `${BASE_URL}/userRecipe/${recipeId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(`token`)}`,
          }
        }
      );
      toastValue("success", "Recipe deleted successfully");
      getUserFavs();
    } catch (error) {
      toastValue("error", error.response.data.message);
    }
  };

  useEffect(() => {
    if (loginUser?.userGroup === "SystemUser") {
      getAllRecipes("", "", "", 10, 1);
      getAllCategory();
      getAllTags();
      getUserFavs();
    } else {
      getAllRecipes("", "", "", 10, 1);
      getAllCategory();
      getAllTags();
    }

    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  const goToRecipe = () => {
    navigate("/dashboard/recipedata");
  };

  return (
    <>
      <Header
        title="Recipes"
        word="Item"
        desc="You can now add your items that any user can order it from the Application and you can edit"
        imgUrl={logo}
      />

      {/* Delete Caregory */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title className="d-flex align-content-center justify-content-end w-100">
            <div className="close" onClick={handleClose}>
              <i className="fa-solid fa-xmark"></i>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DeleteItem type="Recipe" />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-danger"
            disabled={spinner}
            onClick={deleteRecipe}
          >
            {spinner ? "Delete this Item..." : "Delete this Item"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* view Details */}
      <Modal show={showDetails} onHide={handleCloseDetails}>
        <Modal.Header>
          <Modal.Title className="d-flex align-content-center justify-content-end w-100">
            <div className="close" onClick={handleCloseDetails}>
              <i className="fa-solid fa-xmark"></i>
            </div>
          </Modal.Title>
        </Modal.Header>
        {loadingDetails ? (
          <Loading />
        ) : (
          <Modal.Body>
            <div className="text-center">
              <img
                src={recipeDetails.imagePath ? `https://upskilling-egypt.com:3006/${recipeDetails.imagePath}` : noImg}
                className="w-50 mb-3"
                alt=""
              />
            </div>
            <div>
              <div className="d-flex gap-1">
                <span>Created at: </span>
                <h6>
                  {new Date(recipeDetails.creationDate).toLocaleString("en-US")}
                </h6>
              </div>
              <div className="d-flex gap-1">
                <span>Name: </span>
                <h6>{recipeDetails.name}</h6>
              </div>
              <div className="d-flex gap-1">
                <span>Description: </span>
                <h6>{recipeDetails.description}</h6>
              </div>
              <div className="d-flex gap-1">
                <span>Price: </span>
                <h6>{recipeDetails.price}</h6>
              </div>
              <div className="d-flex gap-1">
                <span>category: </span>
                {recipeDetails?.category?.map((item) => (
                  <h6>{item?.name}</h6>
                ))}
              </div>
            </div>
            <div className="text-end">
              {selectedRecipeIds.includes(recipeDetails.id) ? (
                <>
                  {favList.map((fav) => {
                    if (fav.recipe.id === recipeDetails.id) {
                      return (
                        <Button
                          key={fav.id}
                          variant="outline-dark"
                          onClick={() => removeFavourite(fav.id)}
                        >
                          remove from favorite
                        </Button>
                      );
                    }
                    return;
                  })}
                </>
              ) : (
                <Button
                  variant="outline-dark"
                  onClick={() => addToFavs(recipeDetails.id)}
                >
                  Add to favorite
                </Button>
              )}
            </div>
          </Modal.Body>
        )}
      </Modal>

      <Container fluid>
        <Row className="align-items-center">
          <Col md={6}>
            <div className="content">
              <h5 className="m-0">Recipes Table Details</h5>
              <p className="text-muted m-0">You can check all details</p>
            </div>
          </Col>
          {loginUser?.userGroup === "SuperAdmin" ? (
            <Col md={6}>
              <div className="add-category">
                <Button className="secondColor" onClick={goToRecipe}>
                  Add New Recipe
                </Button>
              </div>
            </Col>
          ) : null}

          <Col md={8} className="my-2">
            <InputGroup>
              <InputGroup.Text id="basic-addon1">
                <i className="fa-solid fa-magnifying-glass"></i>
              </InputGroup.Text>
              <Form.Control placeholder="name" onChange={getNameRecipe} />
            </InputGroup>
          </Col>
          <Col md={2} className="my-2">
            <Form.Select
              aria-label="Default select example"
              onChange={getCategoryRecipe}
            >
              <option>Search by category</option>
              {categoriesList.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={2} className="my-2">
            <Form.Select
              aria-label="Default select example"
              onChange={getTagRecipe}
            >
              <option>Search by tag</option>
              {tagsList.map((tag) => (
                <option key={tag.id} value={tag.id}>
                  {tag.name}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>

        {!loading ? (
          <>
            {recipesList.length > 0 ? (
              <>
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Item Name</th>
                      <th>Image</th>
                      <th>Price</th>
                      <th>Description</th>
                      <th>tag</th>
                      <th>Category</th>
                      <th>action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {recipesList.map((item, index) => (
                      <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td>{item.name}</td>
                        <td>
                          <img
                            src={
                              item.imagePath
                                ? `https://upskilling-egypt.com:3006/${item.imagePath}`
                                : noImg
                            }
                            className="img"
                            alt=""
                          />
                        </td>
                        <td>{item.price}</td>
                        <td>{item.description}</td>
                        <td>{item.tag.name}</td>
                        <td>{item.category[0]?.name}</td>

                        <td>
                          <Dropdown>
                            <Dropdown.Toggle
                              variant="default"
                              id="dropdown-basic"
                            >
                              <i className="fa-solid fa-ellipsis"></i>
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                              {loginUser?.userGroup === "SuperAdmin" ? (
                                <>
                                  <Dropdown.Item>
                                    <Link
                                      className="text-decoration-none"
                                      style={{ color: "inherit" }}
                                      to={"/dashboard/recipeedit"}
                                      state={{
                                        recipeData: item,
                                        type: "edit",
                                      }}
                                    >
                                      <i className="fa-regular fa-pen-to-square action-btn me-1"></i>
                                      Edit
                                    </Link>
                                  </Dropdown.Item>
                                  <Dropdown.Item
                                    onClick={() => handleShow(item.id)}
                                  >
                                    <i className="fa-solid fa-trash-can me-1 action-btn"></i>
                                    Delete
                                  </Dropdown.Item>
                                </>
                              ) : (
                                <Dropdown.Item
                                  onClick={() => handleShowDetails(item.id)}
                                >
                                  <i className="fa-solid fa-eye me-1 action-btn"></i>
                                  View
                                </Dropdown.Item>
                              )}
                            </Dropdown.Menu>
                          </Dropdown>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <nav aria-label="Page navigation example">
                  <ul className="pagination">
                    <li
                      className="page-item"
                      onClick={() => {
                        currentPage > 1
                          ? getAllRecipes(
                              nameValue,
                              tagValue,
                              categoryValue,
                              10,
                              currentPage - 1
                            )
                          : null;
                      }}
                    >
                      <a
                        className={
                          currentPage <= 1
                            ? "page-link notAllowed"
                            : "page-link"
                        }
                        aria-label="Previous"
                      >
                        <span aria-hidden="true">&laquo;</span>
                      </a>
                    </li>
                    {arrayOfPages.map((num) => (
                      <li
                        key={num}
                        className="page-item"
                        onClick={() =>
                          getAllRecipes(
                            nameValue,
                            tagValue,
                            categoryValue,
                            10,
                            num
                          )
                        }
                      >
                        <a
                          className={
                            currentPage === num
                              ? "page-link active-link"
                              : "page-link"
                          }
                        >
                          {num}
                        </a>
                      </li>
                    ))}
                    <li
                      className="page-item"
                      onClick={() => {
                        currentPage < arrayOfPages.length
                          ? getAllRecipes(
                              nameValue,
                              tagValue,
                              categoryValue,
                              10,
                              currentPage + 1
                            )
                          : null;
                      }}
                    >
                      <a
                        className={
                          currentPage >= arrayOfPages.length
                            ? "page-link notAllowed"
                            : "page-link"
                        }
                        aria-label="Next"
                      >
                        <span aria-hidden="true">&raquo;</span>
                      </a>
                    </li>
                  </ul>
                </nav>
              </>
            ) : (
              <NoData />
            )}
          </>
        ) : (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Item Name</th>
                  <th>Image</th>
                  <th>Price</th>
                  <th>Description</th>
                  <th>tag</th>
                  <th>Category</th>
                  <th>action</th>
                </tr>
              </thead>
            </table>

            <Loading />
          </>
        )}
      </Container>
    </>
  );
}
