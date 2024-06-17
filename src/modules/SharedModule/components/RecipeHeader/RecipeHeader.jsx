import React from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';

export default function RecipeHeader() {
  const navigate = useNavigate();
  const goToRecipe = () => {
    navigate("/dashboard/recipes");
  };
  return (
    <div className="recipeheaderContainer py-3 px-5 mb-4">
      <Row>
        <Col md={6}>
          <h5>
            Fill the <span>Recipes</span>!
          </h5>
          <p>
            you can now fill the meals easily using the table and form , click
            here and sill it with the table !
          </p>
        </Col>
        <Col md={6} className="d-flex align-items-center justify-content-end">
          <Button
            className="d-flex align-items-center main-btn px-4"
            onClick={goToRecipe}
          >
            All Recipes
            <i className="fa-solid fa-arrow-right ms-2"></i>
          </Button>
        </Col>
      </Row>
    </div>
  )
}
