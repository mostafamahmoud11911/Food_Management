import React, { useRef, useState } from "react";
import logo from "../../../../assets/images/logo.png";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../../context/ToastContext";
import { useAuth } from "../../../../context/AuthContext";
import {
  Alert,
  Button,
  Col,
  Container,
  InputGroup,
  Row,
  Form,
} from "react-bootstrap";
import axios from "axios";


export default function ForgetPass() {
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef();
const {BASE_URL} = useAuth();

  const navigate = useNavigate();
  const { toastValue } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (email) => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${BASE_URL}/Users/Reset/Request`,
        email
      );
      toastValue("success", data.message);
      setLoading(false);
      timeoutRef.current = setTimeout(() => {
        navigate("/resetpass");
      }, 1500);
    } catch (error) {
      setLoading(false);
      toastValue("error", error.response.data.message);
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
                <p style={{fontSize:"15px"}}>
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
