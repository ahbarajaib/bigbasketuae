import { Container, Row, Col, Image } from 'react-bootstrap'

const AboutUs = () => {
  return (
    <Container className='my-5'>
      <Row className='justify-content-center'>
        <Col md={8} className='text-center'>
          <h2 className='mb-4'>About Us</h2>
          <Image
            src='https://images.pexels.com/photos/1152276/pexels-photo-1152276.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
            style={{ width: '350px' }}
            rounded
            className='mb-4'
          />
          <p className='text-muted'>
            At our online grocery store, we are passionate about providing our
            customers with the highest quality products available. We believe
            that everyone deserves access to fresh, delicious food, and we're
            committed to making that a reality.
          </p>
        </Col>
      </Row>
      <Row className='justify-content-center'>
        <Col md={8}>
          <h3 className='mb-3'>Our Story</h3>
          <p>
            Our journey began in a small kitchen where our founder, Sarah, began
            experimenting with different ingredients and flavors. She was
            frustrated by the lack of high-quality, fresh produce available in
            her local grocery stores, and she decided to take matters into her
            own hands.
          </p>
          <p>
            After years of trial and error, Sarah developed a network of farmers
            and producers who shared her passion for quality and sustainability.
            Together, they created our online grocery store, a place where
            customers can find the freshest, most delicious ingredients
            available.
          </p>
          <p>
            Today, we are proud to offer a wide range of products, from organic
            fruits and vegetables to grass-fed meats and artisanal cheeses. We
            are committed to supporting local farmers and producers whenever
            possible, so you can feel good about supporting your community as
            well as your health.
          </p>
        </Col>
      </Row>
      <Row className='justify-content-center mt-5'>
        <Col md={8}>
          <h3 className='mb-3'>Our Mission</h3>
          <p>
            Our mission is simple: to provide our customers with the best
            possible grocery shopping experience. We believe that everyone
            deserves access to fresh, healthy food, and we're committed to
            making that a reality.
          </p>
          <p>
            We are constantly working to improve our selection and service, and
            we welcome your feedback and suggestions. Thank you for choosing our
            online grocery store. We look forward to serving you and your family
            for years to come.
          </p>
        </Col>
      </Row>
    </Container>
  )
}

export default AboutUs
