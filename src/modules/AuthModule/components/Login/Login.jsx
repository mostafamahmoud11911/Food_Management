import React, { useEffect, useRef, useState } from "react";
import logo from "../../../../assets/images/logo.png";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "../../../../context/ToastContext";
import { useAuth } from "../../../../context/AuthContext";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const timeoutRef = useRef();
  const { BASE_URL, getUserData } = useAuth();

  const navigate = useNavigate();
  const { toastValue } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (user) => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${BASE_URL}/Users/Login`, user);
      localStorage.setItem("token", data.token);
      setLoading(false);
      toastValue("success", "Success Login");
      timeoutRef.current = setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
      getUserData();
    } catch (error) {
      setLoading(false);
      toastValue("error", error.response?.data.message);
    }
  };

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);
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

                <h5 className="fw-bold">Log In</h5>
                <p>Welcome Back! Please enter your details</p>

                <Form onSubmit={handleSubmit(onSubmit)}>
                  <InputGroup className="mb-3">
                    <InputGroup.Text>
                      <i className="fa-solid fa-mobile-screen-button"></i>
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
                      <i className="fa-solid fa-lock"></i>
                    </InputGroup.Text>
                    <Form.Control
                      placeholder="Password"
                      type={showPass ? "text" : "password"}
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
                    <div className="alert alert-danger p-2">
                      {errors.password.message}
                    </div>
                  )}

                  <div className="d-flex justify-content-between align-items-center">
                    <Link
                      to="/register"
                      className="fw-fw-semibold text-decoration-none text-dark"
                    >
                      Register Now?
                    </Link>

                    <Link to="/forgetpass" className="forget-pass">
                      Forget Password?
                    </Link>
                  </div>
                  <Button
                    disabled={loading}
                    className="w-100 my-3 main-btn"
                    type="submit"
                  >
                    {loading ? "Login..." : "Login"}
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
