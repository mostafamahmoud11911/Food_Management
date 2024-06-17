
import { Col, Container, Row } from "react-bootstrap";


export default function Header({ title, word, desc,imgUrl }) {
  return (
    <Container fluid>
      <div className="header text-white py-2">
        <Row className="align-items-center p-2">
          <Col md={6}>
            <div className="item px-5">
              <div>
                <span className="fw-bold fs-2 mb-2">{title} </span>
                <span className="fw-light fs-2 mb-2">{word}</span>
              </div>
              <p className="desc">{desc}</p>
            </div>
          </Col>

          <Col md={6} className="header-img pe-5">
            <img src={imgUrl} className="w-50 object-fit-cover" alt="" />
          </Col>
        </Row>
      </div>
    </Container>
  );
}
