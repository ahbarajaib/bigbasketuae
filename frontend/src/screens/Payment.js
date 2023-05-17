import { useEffect, useState } from 'react'

import { Elements } from '@stripe/react-stripe-js'
import CheckoutForm from '../components/CheckoutForm'
import { loadStripe } from '@stripe/stripe-js'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'


function Payment() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const orderDetails = useSelector((state) => state.orderDetails)
  const { order } = orderDetails
  const { totalPrice } = orderDetails.order

  const orderPay = useSelector((state) => state.orderPay)
  const { success } = orderPay

  const orderDeliver = useSelector((state) => state.orderDeliver)
  const {  success: successDeliver } = orderDeliver

  console.log(orderDetails.order.totalPrice)
  const [stripePromise, setStripePromise] = useState(null)
  const [clientSecret, setClientSecret] = useState('')

  useEffect(() => {
    fetch('/api/config/stripe').then(async (r) => {
      const { publishableKey } = await r.json()
      setStripePromise(loadStripe(publishableKey))
      console.log(publishableKey)
    })
  }, [dispatch, id, success, successDeliver, order])

  useEffect(() => {
    fetch('/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify({ totalPrice: totalPrice }),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(async (result) => {
      var { clientSecret } = await result.json()
      setClientSecret(clientSecret)
    })
  }, [id, totalPrice])

  return (
    <>
      <h1>Secure Payment</h1>
      {clientSecret && stripePromise && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm id={id} />
        </Elements>
      )}
    </>
  )
}

export default Payment
