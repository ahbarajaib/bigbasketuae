import React from 'react'
import { Link } from 'react-router-dom'
import { Card } from 'react-bootstrap'

const Product = ({ product }) => {
  return (
    <Card className='my-3 rounded'>
      <Link to={`/product/${product._id}`} style={{ display: 'block' }}>
        <Card.Img
          src={process.env.REACT_APP_API_URL + product.image}
          variant='top'
          style={{
            objectFit: 'cover',
            height: '200px', // Adjust the image height as needed
            borderRadius: '10px',
          }}
        />
      </Link>
      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title as='div'>
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>
        <Card.Subtitle as='div' className='text-muted'>
          {product.brand}
        </Card.Subtitle>
        <Card.Subtitle as='div'>
          {product.prices[0].qty} {product.prices[0].qty < 50 ? 'kg' : 'gm'}
        </Card.Subtitle>
        <Card.Text as='h2' style={{ marginBottom: '0' }}>
          AED {product.prices[0].price}
        </Card.Text>
      </Card.Body>
    </Card>
  )
}

export default Product
