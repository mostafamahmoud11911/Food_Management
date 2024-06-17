import React, { useEffect, useRef, useState } from "react";

import {
  Button,
  Col,
  Container,
  Dropdown,
  Form,
  Modal,
  Row,
} from "react-bootstrap";
import Header from "../../../SharedModule/components/Header/Header";
import Loading from "../../../SharedModule/components/Loading/Loading";
import NoData from "../../../SharedModule/components/NoData/NoData";
import DeleteItem from "../../../SharedModule/components/DeleteItem/DeleteItem";
import { useForm } from "react-hook-form";
import { useAuth } from "../../../../context/AuthContext";
import { useToast } from "../../../../context/ToastContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../../../../assets/images/logo-header2.png";

export default function CategoryList() {
  const [show, setShow] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [categoriesList, setCategoriesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [arrayOfPages, setArrayOfPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(null);
  const { toastValue } = useToast();
  const { BASE_URL, requestHeaders, loginUser, setLoginUser } = useAuth();
  const [mode, setMode] = useState("add");
  const timeoutRef = useRef();

  const navigate = useNavigate();

  const getAllCategory = async (name, pageSize, pageNumber) => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${BASE_URL}/Category/?pageSize=${pageSize}&pageNumber=${pageNumber}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(`token`)}`,
          },
          params: {
            name,
          },
        }
      );

      setCurrentPage(data.pageNumber);
      setArrayOfPages(
        Array(data.totalNumberOfPages)
          .fill()
          .map((_, i) => i + 1)
      );
      setCategoriesList(data?.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toastValue("error", error.response.data.message);
    }
  };

  const getNameValue = (e) => {
    getAllCategory(e.target.value, 10, 1);
    setName(e.target.value);
  };

  const handleShowDelete = (id) => {
    setCategoryId(id);
    setShowDelete(true);
  };

  const handleClose = () => {
    setShow(false);
    setMode("add");
    setValue("name", null);
  };

  const handleShow = () => {
    setShow(true);
  };

  const handleCloseDelete = () => {
    setShowDelete(false);
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setSpinner(true);
    try {
      await axios({
        method: mode === "add" ? "post" : "put",
        url:
          mode === "add"
            ? `${BASE_URL}/Category`
            : `${BASE_URL}/Category/${categoryId}`,
        data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem(`token`)}`,
        },
      });
      setSpinner(false);
      toastValue(
        "success",
        `category has been ${mode === "add" ? "created" : "updated"}!`
      );
      timeoutRef.current = setTimeout(() => {
        handleClose();
        getAllCategory("", 10, 1);
      }, 1500);
    } catch (error) {
      setSpinner(false);
      toastValue("error", error.response.data.message);
    }
  };

  const updateCategory = async (category) => {
    setMode("update");
    setValue("name", category.name);
    handleShow();
    setCategoryId(category.id);
  };

  // delete

  const deleteCategory = async () => {
    setSpinner(true);
    try {
      await axios.delete(`${BASE_URL}/Category/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(`token`)}`,
        }
      });
      toastValue("success", "item has been deleted!");
      setSpinner(false);
      timeoutRef.current = setTimeout(() => {
        getAllCategory("", 10, 1);
        handleCloseDelete();
      }, 1500);
    } catch (error) {
      setSpinner(false);
      toastValue("error", error.response.data.message);
    }
  };
  // log out if user trying to go to category will tran user in login and logout
  const logout = () => {
    localStorage.removeItem("token");
    setLoginUser(null);
    navigate("/login");
  };

  useEffect(() => {
    // check if user or admin
    if (loginUser?.userGroup === "SystemUser") {
      logout();
    } else {
      getAllCategory("", 10, 1);
    }
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [loginUser]);

  return (
    <>
      <Header
        title="Categories"
        word="Item"
        desc="You can now add your items that any user can order it from the Application and you can edit"
        imgUrl={logo}
      />

      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title className="d-flex align-content-center justify-content-between w-100">
            <h4>{mode === "add" ? "Add Category" : "Update Category"}</h4>
            <div className="close" onClick={handleClose}>
              <i className="fa-solid fa-xmark"></i>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body className="my-5">
            <Form.Control
              type="text"
              {...register("name", {
                required: "Category name is required",
              })}
              placeholder="Category Name"
            />
            {errors.name && (
              <div className="alert alert-danger my-2 p-2">
                {errors.name.message}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button className="main-btn" disabled={spinner} type="submit">
              {spinner ? "Save..." : "Save"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Caregory */}
      <Modal show={showDelete} onHide={handleCloseDelete}>
        <Modal.Header>
          <Modal.Title className="d-flex align-content-center justify-content-end w-100">
            <div className="close" onClick={handleCloseDelete}>
              <i className="fa-solid fa-xmark"></i>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DeleteItem type="Category" />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-danger"
            disabled={spinner}
            onClick={deleteCategory}
          >
            {spinner ? "Delete this Item..." : "Delete this Item"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Container fluid>
        <Row className="align-items-center">
          <Col md={6}>
            <div className="content">
              <h5 className="m-0">Categories Table Details</h5>
              <p className="text-muted m-0">You can check all details</p>
            </div>
          </Col>
          <Col md={6}>
            <div className="add-category">
              <Button className="secondColor" onClick={handleShow}>
                Add New Category
              </Button>
            </div>
          </Col>
          <Col md={12}>
            <input
              type="text"
              className="form-control mb-2 mt-1"
              placeholder="Search by name"
              onChange={getNameValue}
            />
          </Col>
        </Row>

        {!loading ? (
          <>
            {categoriesList.length > 0 ? (
              <>
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">name</th>
                      <th scope="col">created at</th>
                      <th scope="col">action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {categoriesList.map((item, index) => (
                      <tr key={item.id}>
                        <th scope="row">{index + 1}</th>
                        <td>{item.name}</td>
                        <td>
                          {new Date(item.creationDate).toLocaleString("en-US")}
                        </td>
                        <td>
                          <Dropdown>
                            <Dropdown.Toggle
                              variant="default"
                              id="dropdown-basic"
                            >
                              <i className="fa-solid fa-ellipsis"></i>
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                              <Dropdown.Item
                                onClick={() => updateCategory(item)}
                              >
                                <i className="fa-regular fa-pen-to-square action-btn me-1"></i>
                                Edit
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() => handleShowDelete(item.id)}
                              >
                                <i className="fa-solid fa-trash-can me-1 action-btn"></i>
                                Delete
                              </Dropdown.Item>
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
                          ? getAllCategory(name, 10, currentPage - 1)
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
                        onClick={() => getAllCategory(name, 10, num)}
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
                          ? getAllCategory(name, 10, currentPage + 1)
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
                  <th scope="col">#</th>
                  <th scope="col">name</th>
                  <th scope="col">created at</th>
                  <th scope="col">action</th>
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
