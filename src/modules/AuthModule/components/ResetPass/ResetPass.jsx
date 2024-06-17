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
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useAuth } from "../../../../context/AuthContext";
import { useToast } from "../../../../context/ToastContext";

export default function ResetPass() {
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showPassConfirm, setShowPassConfirm] = useState(false);
  const navigate = useNavigate();
  const { BASE_URL } = useAuth();
  const { toastValue } = useToast();
  const timeoutRef = useRef();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  const onSubmit = async (resetData) => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${BASE_URL}/Users/Reset`, resetData);
      toastValue("success", data.message);
      setLoading(false);
      timeoutRef.current = setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setLoading(false);
      toastValue(error.response.data.message);
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

                <h5 className="fw-bold">Forgot Your Password?</h5>
                <p>
                  No worries! Please enter your email and we will send a
                  password reset link
                </p>

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
                      <i className="fa-solid fa-mobile-screen-button"></i>
                    </InputGroup.Text>
                    <Form.Control
                      placeholder="OPT"
                      {...register("seed", {
                        required: "OPT is required",
                      })}
                    />
                  </InputGroup>
                  {errors.seed && (
                    <Alert className="alert-danger p-2">
                      {errors.seed.message}
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
                    <Alert className="alert-danger p-2">
                      {errors.password.message}
                    </Alert>
                  )}

                  <InputGroup className="mb-3">
                    <InputGroup.Text>
                    <i className="fa-solid fa-lock"></i>
                    </InputGroup.Text>
                    <Form.Control
                      placeholder="Confirm Password"
                      type={showPassConfirm ? "text" : "password"}
                      {...register("confirmPassword", {
                        required: "Confirm Password is required",
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

                  <Button
                    disabled={loading}
                    className="w-100 my-3 main-btn"
                    type="submit"
                  >
                    {loading ? "Submit..." : "Submit"}
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
