import React, { useEffect, useRef, useState } from "react";
import Header from "../../../SharedModule/components/Header/Header";
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
import axios from "axios";
import NoData from "../../../SharedModule/components/NoData/NoData";
import noImg from "../../../../assets/images/noData.svg";
import Loading from "../../../SharedModule/components/Loading/Loading";
import { useAuth } from "../../../../context/AuthContext";
import DeleteItem from "../../../SharedModule/components/DeleteItem/DeleteItem";
import logo from "../../../../assets/images/logo-header2.png";
import { useNavigate } from "react-router-dom";

export default function UserList() {
  const [usersList, setUsersList] = useState([]);
  const [nameValue, setNameValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [countryValue, setCountryValue] = useState("");
  const [roleValue, setRoleValue] = useState("");
  const [arrayOfPages, setArrayOfPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(null);
  const [show, setShow] = useState(false);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const timeoutRef = useRef();
  const navigate = useNavigate();
  const handleClose = () => setShow(false);
  const handleShow = (id) => {
    setUserId(id);
    setShow(true);
  };

  const { toastValue } = useToast();
  const { BASE_URL, setLoginUser, loginUser } = useAuth();


  const getAllUsers = async (
    userName,
    email,
    country,
    groups,
    pageSize,
    pageNumber
  ) => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${BASE_URL}/Users/?pageSize=${pageSize}&pageNumber=${pageNumber}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(`token`)}`,
          },
          params: {
            userName,
            email,
            country,
            groups,
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
      setUsersList(data.data);
    } catch (error) {
      setLoading(false);
      toastValue("error", error.response.data.message);
    }
  };

  const getNameValue = (e) => {
    setNameValue(e.target.value);
    getAllUsers(e.target.value, emailValue, countryValue, roleValue, 20, 1);
  };

  const getEmailValue = (e) => {
    setEmailValue(e.target.value);
    getAllUsers(nameValue, e.target.value, countryValue, roleValue, 20, 1);
  };

  const getCountryValue = (e) => {
    setCountryValue(e.target.value);
    getAllUsers(nameValue, emailValue, e.target.value, roleValue, 20, 1);
  };

  const getUserRole = (e) => {
    setRoleValue(e.target.value);
    getAllUsers(nameValue, emailValue, countryValue, e.target.value, 20, 1);
  };

  // delete user
  async function deleteUser() {
    setSpinner(true);
    try {
      await axios.delete(`${BASE_URL}/Users/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(`token`)}`,
        },
      });
      setSpinner(false);
      timeoutRef.current = setTimeout(() => {
        handleClose();
        getAllUsers("", "", "", "", 20, 1);
      });
    } catch (error) {
      setSpinner(false);
      toastValue("error", error.response.data.message);
    }
  }

  // log out if user trying to go to category will tran user in login and logout
  const logout = () => {
    localStorage.removeItem("token");
    setLoginUser(null);
    navigate("/login");
  };

  useEffect(() => {
    if (loginUser?.userGroup === "SuperAdmin") {
      getAllUsers("", "", "", "", 20, 1);
    } else {
      logout();
    }

    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);
  return (
    <>
      <Header
        title="Users"
        word="Items"
        desc="You can now search users and you can delete it from the Application"
        imgUrl={logo}
      />

      {/* Delete user */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title className="d-flex align-content-center justify-content-end w-100">
            <div className="close" onClick={handleClose}>
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
            onClick={deleteUser}
          >
            {spinner ? "Delete this Item..." : "Delete this Item"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Container fluid>
        <Row className="align-items-center">
          <Col md={12}>
            <div className="content">
              <h5 className="m-0">Users Table Details</h5>
              <p className="text-muted m-0">You can check all details</p>
            </div>
          </Col>
          <Row>
            <Col md={3} className="my-2">
              <InputGroup>
                <InputGroup.Text id="basic-addon1">
                  <i className="fa-solid fa-magnifying-glass"></i>
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search by name..."
                  onChange={getNameValue}
                />
              </InputGroup>
            </Col>
            <Col md={3} className="my-2">
              <InputGroup>
                <InputGroup.Text id="basic-addon1">
                  <i className="fa-solid fa-magnifying-glass"></i>
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search by email..."
                  onChange={getEmailValue}
                />
              </InputGroup>
            </Col>
            <Col md={3} className="my-2">
              <InputGroup>
                <InputGroup.Text id="basic-addon1">
                  <i className="fa-solid fa-magnifying-glass"></i>
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search by country..."
                  onChange={getCountryValue}
                />
              </InputGroup>
            </Col>
            <Col md={3} className="my-2">
              <Form.Select
                aria-label="Default select example"
                onChange={getUserRole}
              >
                <option value="">user role..</option>
                <option value="1">Admin</option>
                <option value="2">User</option>
              </Form.Select>
            </Col>
          </Row>
        </Row>

        {!loading ? (
          <>
            {usersList.length > 0 ? (
              <>
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Image</th>
                      <th>email</th>
                      <th>Group</th>
                      <th>Phone Number</th>
                      <th>Country</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {usersList.map((user, index) => (
                      <tr key={user.id}>
                        <td>{index + 1}</td>
                        <td>{user.userName}</td>
                        <td>
                          <img
                            src={
                              user.imagePath
                                ? `https://upskilling-egypt.com:3006/${user.imagePath}`
                                : noImg
                            }
                            className="img"
                            alt=""
                          />
                        </td>
                        <td>{user.email}</td>
                        <td>{user.group?.name}</td>
                        <td>{user.phoneNumber}</td>
                        <td>{user.country}</td>
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
                                onClick={() => handleShow(user.id)}
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
                          ? getAllUsers(
                              nameValue,
                              emailValue,
                              countryValue,
                              roleValue,
                              20,
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
                          getAllUsers(
                            nameValue,
                            emailValue,
                            countryValue,
                            roleValue,
                            20,
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
                          ? getAllUsers(
                              nameValue,
                              emailValue,
                              countryValue,
                              roleValue,
                              20,
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
                  <th>Name</th>
                  <th>Image</th>
                  <th>email</th>
                  <th>Group</th>
                  <th>Phone Number</th>
                  <th>Country</th>
                  <th>Actions</th>
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
