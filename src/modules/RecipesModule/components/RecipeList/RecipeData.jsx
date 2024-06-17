import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Button,
  Col,
  Container,
  FloatingLabel,
  Form,
  Row,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import RecipeHeader from "../../../SharedModule/components/RecipeHeader/RecipeHeader";
import { useAuth } from "../../../../context/AuthContext";
import { useToast } from "../../../../context/ToastContext";

export default function RecipeData() {
  const [categoriesList, setCategoriesList] = useState([]);
  const [tagsList, setTagsList] = useState([]);
  const [categoryId, setCategoryId] = useState(null);
  const [tagId, setTagId] = useState(null);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef();
  const location = useLocation();

  const { toastValue } = useToast();

  const status = location.state?.type;
  const recipeData = location.state?.recipeData;

  const { BASE_URL, requestHeaders, loginUser, setLoginUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // get all gategory
  const getCategory = async () => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/Category/?pageSize=10&pageNumber=1`,
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

  // get tags
  const getTgsList = async () => {
    try {
      const { data } = await axios.get(
        `https://upskilling-egypt.com:3006/api/v1/tag`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(`token`)}`,
          }
        }
      );

      setTagsList(data);
    } catch (error) {
      toastValue("error", error.response.data.message);
    }
  };

  const appendToFormData = (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("tagId", data.tagId);
    formData.append("recipeImage", data.recipeImage[0]);
    formData.append("categoriesIds", data.categoriesIds);
    return formData;
  };
  console.log();
  const onSubmit = async (data) => {
    setLoading(true);

    const recipesFormData = appendToFormData(data);

    try {
      await axios({
        method: status === "edit" ? "put" : "post",
        url:
          status === "edit"
            ? `${BASE_URL}/Recipe/${recipeData.id}`
            : `${BASE_URL}/Recipe`,
        data: recipesFormData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem(`token`)}`,
        }
      });
      setLoading(false);
      toastValue(
        "success",
        status === "edit" ? "Recipe has been updated" : "Recipe has been added"
      );
      timeoutRef.current = setTimeout(() => {
        navigate("/dashboard/recipes");
      }, 1500);
    } catch (error) {
      setLoading(false);
      toastValue("error", error?.response?.data?.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setLoginUser(null);
    navigate("/login");
  };

  useEffect(() => {
    getCategory();
    getTgsList();
    if (status && recipeData) {
      setCategoryId(recipeData.category[0].id);
      setTagId(recipeData.tag.id);
    }
    if (loginUser?.userGroup === "SystemUser") {
      logout();
    }
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <Container fluid>
      <RecipeHeader />
      <Row>
        <Col md={10} className="mx-auto">
          <Form
            onSubmit={handleSubmit(onSubmit)}
            className="d-flex flex-column gap-2"
          >
            <Form.Control
              placeholder="Recipe Name"
              defaultValue={recipeData?.name}
              {...register("name", {
                required: "name is required",
              })}
            />
            {errors.name && (
              <Alert className="alert-danger p-2">{errors.name.message}</Alert>
            )}

            <Form.Select
              {...register("tagId", {
                required: "tag is required",
              })}
              value={tagId && null}
              onChange={(e) => setTagId(e.target.value)}
            >
              <option value="">
                Tag
              </option>
              {tagsList.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </Form.Select>

            {errors.tagId && (
              <Alert className="alert-danger p-2">{errors.tagId.message}</Alert>
            )}

            <Form.Control
              placeholder="Price"
              type="number"
              defaultValue={recipeData?.price}
              {...register("price", {
                required: "Price is required",
              })}
            />
            {errors.price && (
              <Alert className="alert-danger p-2">{errors.price.message}</Alert>
            )}

            <Form.Select
              {...register("categoriesIds", {
                required: "category is required",
              })}
              onChange={(e) => setCategoryId(e.target.value)}
              value={categoryId && null}
            >
              <option value="">Categ</option>
              {categoriesList.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </Form.Select>

            {errors.categoriesIds && (
              <Alert className="alert-danger p-2">
                {errors.categoriesIds.message}
              </Alert>
            )}

            <FloatingLabel label="Description">
              <Form.Control
                as="textarea"
                defaultValue={recipeData?.description}
                placeholder="Leave a comment here"
                style={{ height: "100px" }}
                {...register("description", {
                  required: "description is required",
                })}
              />
            </FloatingLabel>

            {errors.description && (
              <Alert className="alert-danger p-2">
                {errors.description.message}
              </Alert>
            )}

            <Form.Control type="file" {...register("recipeImage")} />

            <div className="text-end">
              <Link to="/dashboard/recipes">
                <Button variant="outline-success px-5 me-5" className="my-3">
                  Cencle
                </Button>
              </Link>

              <Button
                disabled={loading}
                className="my-3 main-btn"
                type="submit"
              >
                {loading ? "Submit..." : "Submit"}
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
