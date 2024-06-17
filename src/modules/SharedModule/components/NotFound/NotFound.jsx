import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import logo from "../../../../assets/images/4.png";
import error from "../../../../assets/images/bg-notfound.png";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div>
    <Container fluid className="notfound">
      <Row >
        <Col md={4} className="h-100">
          <img src={logo} className="w-50" alt="" />
          <div className="d-flex flex-column justify-content-center align-items-start mt-5 h-100">
            <h3>Oops.</h3>
            <p className="prag">Page not found</p>
            <p>
              This Page doesn’t exist or was removed! We suggest you back to
              home.
            </p>
            <Link to="/dashboard" className="text-decoration-none">
              <Button className="btn-notfound">
                <i className="fa-solid fa-arrow-left"></i>
                <div>
                  Back To <br /> Home
                </div>
              </Button>
            </Link>
          </div>
        </Col>

        <Col md={8} className="img-notfound">
          <div className="d-flex justify-content-center align-items-end h-100">
            <img src={error} className="w-50" alt="" />
          </div>
        </Col>
      </Row>
    </Container>
  </div>
  )
}
