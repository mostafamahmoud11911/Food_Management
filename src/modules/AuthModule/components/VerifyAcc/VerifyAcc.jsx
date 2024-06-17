import React, { useRef, useState } from "react";
import { useToast } from "../../../../context/ToastContext";
import axios from "axios";
import { useAuth } from "../../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function VerifyAcc() {
  const [loading, setLoading] = useState(false);
  const { toastValue } = useToast();
  const { BASE_URL } = useAuth();
  const timeoutRef = useRef();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await axios.put(`${BASE_URL}/Users/verify`, data);
      setLoading(false);
      toastValue("success", res.data.message);
      timeoutRef.current = setTimeout(() => {
        navigate("/login");
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

                <h5 className="fw-bold">Verify Account</h5>
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
                      placeholder="Code"
                      type="text"
                      {...register("code", {
                        required: "Code is required",
                      })}
                    />
                  </InputGroup>
                  {errors.code && (
                    <div className="alert alert-danger p-2">
                      {errors.code.message}
                    </div>
                  )}

                  <Button
                    disabled={loading}
                    className="w-100 my-3 main-btn"
                    type="submit"
                  >
                    {loading ? "Verify..." : "Verify"}
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
