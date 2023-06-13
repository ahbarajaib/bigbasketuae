import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';

const Product = ({ product }) => {
  return (
    <Card className='my-3 rounded'>
      <Link to={`/product/${product._id}`} style={{ display: 'block' }}>
        <Card.Img
          src={product.image}
          variant='top'
          style={{
            objectFit: 'cover',
            height: '200px',
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
        {product.prices && product.prices.length > 0 && (
          <>
            <Card.Subtitle as='div'>
              {product.prices[0].qty} {product.prices[0].mgml}
            </Card.Subtitle>
            <Card.Text as='h2' style={{ marginBottom: '0' }}>
              AED {product.prices[0].price}
            </Card.Text>
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default Product;
