import React, { useState } from "react";
import logo from "../../../../assets/images/4.png";
import { useForm } from "react-hook-form";
import { Alert, Button, Form, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "../../../../context/ToastContext";
import { useAuth } from "../../../../context/AuthContext";

export default function ChangePass({ handleClose }) {
  const [loading, setLoading] = useState(false);
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showconfirmPass, setShowconfirmPass] = useState(false);

  const naviagte = useNavigate();
  const { BASE_URL, setLoginUser } = useAuth();
  const { toastValue } = useToast();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  const logout = () => {
    localStorage.removeItem("token");
    setLoginUser(null);
    naviagte("/login");
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await axios.put(`${BASE_URL}/Users/ChangePassword`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(`token`)}`,
        }
      });

      toastValue("success", "Password has been updated");
      setLoading(false);
      handleClose();
      setTimeout(() => {
        logout();
      }, 2000);
    } catch (error) {
      setLoading(false);
      toastValue("error", error?.response?.data?.message);
    }
  };
  return (
    <div className="py-3 px-5">
      <div className="text-center">
        <img src={logo} className="w-50" alt="" />
      </div>
      <h5>Change Your Password</h5>
      <p>Enter your details below</p>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <InputGroup className="mb-3">
          <InputGroup.Text>
            <i className="fa-solid fa-mobile-screen-button"></i>
          </InputGroup.Text>
          <Form.Control
            type={showOldPass ? "text" : "password"}
            placeholder="Old Password"
            {...register("oldPassword", {
              required: "Old Password is required",
            })}
          />
          <InputGroup.Text onClick={() => setShowOldPass(!showOldPass)}>
            <i className="fa-solid fa-eye"></i>
          </InputGroup.Text>
        </InputGroup>
        {errors.oldPassword && (
          <Alert className="alert-danger p-2">
            {errors.oldPassword.message}
          </Alert>
        )}

        <InputGroup className="mb-3">
          <InputGroup.Text>
            <i className="fa-solid fa-mobile-screen-button"></i>
          </InputGroup.Text>
          <Form.Control
            type={showNewPass ? "text" : "password"}
            placeholder="New Password"
            {...register("newPassword", {
              required: "New Password is required",
            })}
          />
          <InputGroup.Text onClick={() => setShowNewPass(!showNewPass)}>
            <i className="fa-solid fa-eye"></i>
          </InputGroup.Text>
        </InputGroup>
        {errors.newPassword && (
          <Alert className="alert-danger p-2">
            {errors.newPassword.message}
          </Alert>
        )}

        <InputGroup className="mb-3">
          <InputGroup.Text>
            <i className="fa-solid fa-mobile-screen-button"></i>
          </InputGroup.Text>
          <Form.Control
            placeholder="Confirm New Password"
            type={showconfirmPass ? "text" : "password"}
            {...register("confirmNewPassword", {
              required: "Confirm Password is required",
              validate: (value) => {
                const { newPassword } = getValues();
                return newPassword === value || "Passwords should match!";
              },
            })}
          />
          <InputGroup.Text onClick={() => setShowconfirmPass(!showconfirmPass)}>
            <i className="fa-solid fa-eye"></i>
          </InputGroup.Text>
        </InputGroup>
        {errors.confirmNewPassword && (
          <Alert className="alert-danger p-2">
            {errors.confirmNewPassword.message}
          </Alert>
        )}

        <Button
          disabled={loading}
          className="w-100 my-3 main-btn"
          type="submit"
        >
          {loading ? "Change Password..." : "Change Password"}
        </Button>
      </Form>
    </div>
  );
}
