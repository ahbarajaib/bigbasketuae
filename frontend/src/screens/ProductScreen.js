//cart vid - qty is a part of component level state so we use useState

import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Row, Col, Image, ListGroup, Card, Button } from 'react-bootstrap'
import Loader from '../components/Loader'
import Message from '../components/Message'
import Meta from '../components/Meta'
import { listProductDetails } from '../actions/productActions'
import { updateSelectedQtyPrice } from '../actions/cartActions'

const ProductScreen = (history) => {
  //useParams is a hook that lets you access the parameter of the current route
  const { id } = useParams()
  const navigate = useNavigate()
  //useState(1) to set state of first item is 1

  const dispatch = useDispatch()

  const productDetails = useSelector((state) => state.productDetails)
  const { loading, error, product } = productDetails

  const [noOfProducts, setNoOfProducts] = useState(1)

  const [selectedQty, setSelectedQty] = useState('')
  const [selectedPrice, setSelectedPrice] = useState('')
  // No arrow function because we can't use async
  useEffect(() => {
    dispatch(listProductDetails(id))
  }, [dispatch, id])

  //Handlers
  const addToCartHandler = () => {
    if (selectedQty === '') {
      alert('Please select a quantity first.')
      return
    }

    dispatch(
      updateSelectedQtyPrice(id, noOfProducts, selectedQty, selectedPrice)
    )
    navigate(
      `/cart/${id}?noOfProducts=${noOfProducts}&selectedQty=${selectedQty}&selectedPrice=${selectedPrice}`
    )
  }

  // all route params will always be string values
  //const product = products.find (p => String(p._id) === id)
  //to='' is used to define where it will go after the click

  return (
    <>
      <button className='btn btn-light my-3' onClick={() => navigate(-1)}>
        Go Back
      </button>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <Meta title={product.name} />
          <Row>
            <Col md={6}>
              <Image src={product.image} alt={product.name} fluid />
            </Col>
            <Col md={3}>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item className='text-muted'>
                  Brand:&nbsp;
                  {product.brand}
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    {product.prices &&
                      product.prices.map((price) => (
                        <Col key={price.qty}>
                          <Button
                            variant={
                              selectedQty === price.qty
                                ? 'primary'
                                : 'outline-primary'
                            }
                            className='btn-product'
                            onClick={() => {
                              setSelectedQty(price.qty)
                              setSelectedPrice(price.price)
                            }}
                          >
                           {price.qty} {price.qty < 100 ? 'kg' : 'gm'}
                            
                          </Button>
                          
                        </Col>
                      ))}
                    
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <h4>
                    <strong>
                      AED{' '}
                      {selectedPrice
                        ? selectedPrice
                        : product.prices && product.prices.length > 0
                        ? product.prices[0].price
                        : 500}
                    </strong>
                  </h4>
                </ListGroup.Item>

                
              </ListGroup>
            </Col>

            <Col md={3}>
              <Card>
                <ListGroup variant='flush'>
                  <ListGroup.Item>
                    <h4>
                      <strong>
                        AED{' '}
                        {selectedPrice
                          ? (selectedPrice * noOfProducts).toFixed(2)
                          : product.prices && product.prices.length > 0
                          ? (product.prices[0].price * noOfProducts).toFixed(2)
                          : (product.price * noOfProducts).toFixed(2)}
                      </strong>
                    </h4>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Status: </Col>
                      <Col>
                        {product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Qty</Col>
                        <Col>
                          <Form.Select
                            value={noOfProducts}
                            onChange={(e) => setNoOfProducts(e.target.value)}
                          >
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
                          </Form.Select>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}

                  <ListGroup.Item className='d-grid gap-2'>
                    <Button
                      onClick={addToCartHandler}
                      className='button-primary btn-block'
                      type='button'
                      disabled={product.countInStock === 0}
                    >
                      Add To Cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row className="my-4">
  <Col md={12}>
    <ListGroup.Item className="description-item">
      <h5><strong>Description:</strong></h5>
      <p>{product.description}</p>
    </ListGroup.Item>
  </Col>
</Row>


        </>
      )}
    </>
  )
}
export default ProductScreen
