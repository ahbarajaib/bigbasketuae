import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import { saveShippingAddress } from '../actions/cartActions'

//history props
const ShippingScreen = (history) => {
  const defaultCity = 'Dubai'
  const defaultCountry = 'United Arab Emirates'
  const cart = useSelector((state) => state.cart)
  //stored from localstorage
  const { shippingAddress } = cart

  const [address, setAddress] = useState(shippingAddress.address)
  const [city, setCity] = useState(defaultCity)
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode)
  const [country, setCountry] = useState(defaultCountry)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(saveShippingAddress({ address, city, postalCode, country }))
    navigate('/placeorder')
  }

  return (
    <>
      <button className='btn btn-light my-3' onClick={() => navigate(-1)}>
        Go Back
      </button>
      <FormContainer>
        <h1>Shipping</h1>
        <CheckoutSteps step1 step2 />
        <Form onSubmit={submitHandler}>
          <Form.Group controlId='address'>
            <Form.Label>Address</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter address'
              value={address}
              required
              onChange={(e) => setAddress(e.target.value)}
            ></Form.Control>
          </Form.Group>

	  <Form.Group controlId='city'>
          <Form.Label>City</Form.Label>
          <Form.Control
            type='text'
            value={defaultCity}
            required
            disabled 
            onChange={(e) => setCity(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='postalCode'>
            <Form.Label>Postal Code</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter Postal Code'
              value={postalCode}
              required
              onChange={(e) => setPostalCode(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='country'>
            <Form.Label>Country</Form.Label>
            <Form.Control
              type='text'
              value={defaultCountry}
              required
	      disabled
              onChange={(e) => setCountry(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <div className='d-grid gap-2' style={{ marginTop: '20px' }}>
            <Button
              type='submit'
              variant='primary'
              className='button-primary btn-block'
            >
              Continue
            </Button>
          </div>
        </Form>
      </FormContainer>
    </>
  )
}

export default ShippingScreen
