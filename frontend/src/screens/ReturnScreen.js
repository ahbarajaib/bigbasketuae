import { Container, Row, Col } from 'react-bootstrap'

const ReturnPolicy = () => {
  return (
    <Container className='my-5'>
      <Row className='justify-content-center'>
        <Col md={8}>
          <h2>Return Policy</h2>
          <p className='mt-3'>
            To ensure the best experience with BigBasketUAE, please carefully
            read the following Return Policy.
          </p>
          <p>
            Due to the perishable nature of our products, we do not accept
            returns.
          </p>
          <p>
            In the event you receive a product that is damaged, defective, or
            contaminated in any way, please contact our team directly on/at
            phone/Email and we will do our best to resolve the issue.
          </p>
          <p>
            Please note that you must ask for the return, replacement, or refund
            for such products within 2 days from receiving your order.
          </p>
          <p>
            To ensure a successful return, please note that we do not offer a
            refund or replacement once the actual sealing is opened unless your
            complaint is related to the quality of a product.
          </p>
          <p>
            Please do not return any food product without contacting us first
            for specific information regarding the return process.
          </p>
          <p>
            If you have any queries about online matters, please contact us
            online customercare@bigbasketuae.com or via telephone: +971
            5545710897 Monday - Saturday 8.00 AM to 6.00 PM
          </p>
        </Col>
      </Row>
    </Container>
  )
}

export default ReturnPolicy
