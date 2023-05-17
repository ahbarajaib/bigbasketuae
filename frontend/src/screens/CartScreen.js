import React, { useEffect } from 'react'
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap'
import Message from '../components/Message'
import { addToCart, removeFromCart } from '../actions/cartActions'

const CartScreen = (history) => {
  const { id } = useParams()

  const navigate = useNavigate()
  //gives the details of the whole link console.log(qty and check)
  const location = useLocation()
  const selectedQty = new URLSearchParams(location.search).get('selectedQty')

  const selectedPrice = new URLSearchParams(location.search).get(
    'selectedPrice'
  )

  //this output the qty
  const noOfProducts = new URLSearchParams(location.search).get('noOfProducts')

  const dispatch = useDispatch()

  //this is for checkoutHandler
  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const cart = useSelector((state) => state.cart)
  const { cartItems } = cart

  useEffect(() => {
    if (id) {
      dispatch(addToCart(id, noOfProducts, selectedQty, selectedPrice))
    }
  }, [dispatch, id, noOfProducts, selectedQty, selectedPrice])

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id))
  }

  const checkoutHandler = () => {
    if (!userInfo) {
      navigate('/login')
    } else {
      navigate('/shipping')
    }

    //instead of history.push
    //navigate('/login?redirect=shipping')
  }

  const getNoOfProducts = (item, newNoOfProducts = null) => {
    if (newNoOfProducts !== null) {
      return newNoOfProducts
    } else {
      return item.noOfProducts
    }
  }

  return (
    <>
      <button className='btn btn-light my-3' onClick={() => navigate(-1)}>
        Go Back
      </button>
      <Row>
        <Col md={8}>
          <h1>Shopping Cart</h1>
          {cartItems.length === 0 ? (
            <Message>
              Your cart is empty <Link to='/'>Go Back</Link>
            </Message>
          ) : (
            <ListGroup variant='flush'>
              {cartItems.map((item) => (
                <ListGroup.Item key={item.product}>
                  <Row>
                    <Col md={2}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>
                    <Col md={3}>
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
                      <Col md={3}>{item.selectedQty}</Col>
                    </Col>

                    <Col md={2}>
                      <strong>AED {item.selectedPrice}</strong>
                    </Col>
                    <Col md={2}>
                      <Form.Select
                        value={getNoOfProducts(item, item.noOfProducts)}
                        onChange={(e) => {
                          const newNoOfProducts = Number(e.target.value)
                          dispatch(
                            addToCart(
                              item.product,
                              newNoOfProducts,
                              item.selectedQty,
                              item.selectedPrice
                            )
                          )
                        }}
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </Form.Select>
                    </Col>

                    <Col md={2}>
                      <Button
                        type='button'
                        variant='light'
                        onClick={() => removeFromCartHandler(item.product)}
                      >
                        <i className='fas fa-trash'></i>
                      </Button>
                    </Col>
                    <Col md={1}>
                      <div>{`AED ${(
                        item.noOfProducts * item.selectedPrice
                      ).toFixed(2)}`}</div>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card className='my-4 p-4'>
            <ListGroup.Item>
              <h2>Subtotal</h2>
              <h3>
                AED{' '}
                {cartItems
                  .reduce(
                    (acc, item) => acc + item.noOfProducts * item.selectedPrice,
                    0
                  )
                  .toFixed(2)}
              </h3>
            </ListGroup.Item>
            <ListGroup.Item>
              <div className='d-grid gap-2'>
                <Button
                  type='button'
                  className='button-primary btn-block'
                  disabled={cartItems.length === 0}
                  onClick={checkoutHandler}
                >
                  Proceed To Checkout
                </Button>
              </div>
            </ListGroup.Item>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default CartScreen
