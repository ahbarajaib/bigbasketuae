import React from 'react'
import { Link } from 'react-router-dom'
import { Card } from 'react-bootstrap'
// product in the bracket comes from HomeScreen.js
const Product = ({ product }) => {
  return (
    // my = margin top and bottom

    <Card
      className='my-3 p-3 rounded'
      style={{
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        borderRadius: '10px',
        padding: '20px',
      }}
    >
      {/* Link to = is from react router dom */}
      <Link to={`/product/${product._id}`}>
        <Card.Img src={product.image} variant='top' />
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

        <Card.Subtitle as='div'>{product.prices[0].qty} {product.prices[0].qty < 50 ? 'kg' : 'gm'}</Card.Subtitle>
        <Card.Text as='h2'>AED {product.prices[0].price}</Card.Text>
      </Card.Body>
    </Card>
  )
}

export default Product
