import React, { useRef, useState } from "react";
import logo from "../../../../assets/images/logo.png";
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../../../../context/ToastContext";
import axios from "axios";
import { useAuth } from "../../../../context/AuthContext";

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showPassConfirm, setShowPassConfirm] = useState(false);
  const timeoutRef = useRef();
  const { BASE_URL } = useAuth();
  const navigate = useNavigate();
  const { toastValue } = useToast();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  const appendToFormData = (data) => {
    const formData = new FormData();
    formData.append("userName", data.userName);
    formData.append("email", data.email);
    formData.append("country", data.country);
    formData.append("phoneNumber", data.phoneNumber);
    formData.append("profileImage", data.profileImage[0]);
    formData.append("password", data.password);
    formData.append("confirmPassword", data.confirmPassword);
    return formData;
  };

  const onSubmit = async (data) => {

    const registerFormData = appendToFormData(data);
    setLoading(true);
    try {
      await axios.post(
        `${BASE_URL}/Users/Register`,
        registerFormData
      );
      setLoading(false);
      toastValue("success", "success register");
      setTimeout(() => {
        navigate("/verify");
      }, 2000);
    } catch (error) {
      console.log(error)
      setLoading(false);
      toastValue("error", error?.response?.data?.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="bg-overlay">
        <Container>
          <Row>
            <Col md={6} className="mx-auto">
              <div className="bg-white rounded p-4">
                <div className="text-center mb-3">
                  <img src={logo} alt="" />
                </div>

                <h5 className="fw-bold">Register</h5>
                <p>Welcome Back! Please enter your details</p>

                <Form onSubmit={handleSubmit(onSubmit)}>
                  <Row>
                    <Col md={6}>
                      <InputGroup className="mb-3">
                        <InputGroup.Text>
                          <i className="fa-solid fa-user"></i>
                        </InputGroup.Text>
                        <Form.Control
                          placeholder="Enter your Username"
                          {...register("userName", {
                            required: "userName is required",
                            pattern: {
                              value: /^[A-Za-z]{4,8}[0-9]{1}$/,
                              message:"The userName must not be greater than 8 characters and contain number"
                            }
                          })}
                        />
                      </InputGroup>
                      {errors.userName && (
                        <Alert className="alert-danger p-2">
                          {errors.userName.message}
                        </Alert>
                      )}
                      <InputGroup className="mb-3">
                        <InputGroup.Text>
                          <i className="fa-solid fa-globe"></i>
                        </InputGroup.Text>
                        <Form.Control
                          placeholder="Enter your Country"
                          {...register("country", {
                            required: "country is required",
                          })}
                        />
                      </InputGroup>
                      {errors.country && (
                        <Alert className="alert-danger p-2">
                          {errors.country.message}
                        </Alert>
                      )}
                      <InputGroup className="mb-3">
                        <InputGroup.Text>
                          <i className="fa-solid fa-lock"></i>
                        </InputGroup.Text>
                        <Form.Control
                          type={showPass ? "text" : "password"}
                          placeholder="Enter your Password"
                          {...register("password", {
                            required: "Password is required",
                            pattern: {
                              value:
                                /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/,
                              message:
                                "The password must include at least one lowercase letter, one uppercase letter, one digit, one special character, and be at least 6 characters long.",
                            },
                          })}
                        />
                        <InputGroup.Text onClick={() => setShowPass(!showPass)}>
                          <i className="fa-solid fa-eye"></i>
                        </InputGroup.Text>
                      </InputGroup>
                      {errors.password && (
                        <Alert className="alert-danger p-2">
                          {errors.password.message}
                        </Alert>
                      )}
                    </Col>
                    <Col md={6}>
                      <InputGroup className="mb-3">
                        <InputGroup.Text>
                          <i className="fa-solid fa-envelope"></i>
                        </InputGroup.Text>
                        <Form.Control
                          placeholder="Enter your E-mail"
                          {...register("email", {
                            required: "Email is required",
                            pattern: {
                              value: /^[^@]+@[^@]+\.[^@.]{2,}$/,
                              message: "Invaild mail",
                            },
                          })}
                        />
                      </InputGroup>
                      {errors.email && (
                        <Alert className="alert-danger p-2">
                          {errors.email.message}
                        </Alert>
                      )}
                      <InputGroup className="mb-3">
                        <InputGroup.Text>
                          <i className="fa-solid fa-mobile-screen-button"></i>
                        </InputGroup.Text>
                        <Form.Control
                          placeholder="Enter your phoneNumber"
                          {...register("phoneNumber", {
                            required: "phoneNumber is required",
                          })}
                        />
                      </InputGroup>
                      {errors.phoneNumber && (
                        <Alert className="alert-danger p-2">
                          {errors.phoneNumber.message}
                        </Alert>
                      )}
                      <InputGroup className="mb-3">
                        <InputGroup.Text>
                          <i className="fa-solid fa-lock"></i>
                        </InputGroup.Text>
                        <Form.Control
                          placeholder="confirmPassword"
                          type={showPassConfirm ? "text" : "password"}
                          {...register("confirmPassword", {
                            required: "confirmPassword is required",
                            validate: (value) => {
                              const { password } = getValues();

                              return (
                                password === value || "Passwords should match!"
                              );
                            },
                          })}
                        />
                        <InputGroup.Text
                          onClick={() => setShowPassConfirm(!showPassConfirm)}
                        >
                          <i className="fa-solid fa-eye"></i>
                        </InputGroup.Text>
                      </InputGroup>
                      {errors.confirmPassword && (
                        <Alert className="alert-danger p-2">
                          {errors.confirmPassword.message}
                        </Alert>
                      )}
                    </Col>

                    <Form.Control type="file" {...register("profileImage")} />
                  </Row>
                  <div className="text-end">
                    <Link to="/login" className="forget-pass text-end">
                      Login Now?
                    </Link>
                  </div>

                  <Button
                    disabled={loading}
                    className="w-100 my-3 main-btn"
                    type="submit"
                  >
                    {loading ? "Register..." : "Register"}
                  </Button>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}
