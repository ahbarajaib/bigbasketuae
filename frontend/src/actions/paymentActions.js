import { loadStripe } from '@stripe/stripe-js'
import { PAYMENT_FAIL, PAYMENT_SUCCESS } from '../constants/paymentContants'

export const createPaymentIntent = (data) => {
  return async (dispatch, getState) => {
    const stripe = await loadStripe(
      'pk_test_51Mw0KtHIytjx0YNoRT1T9atjDc6zW0lDgtL7q761rAKX9EfHVWa6JCrkbYLfZD6w8b3SteXfjQzuEn2PEN8MWjIv00wb65hjfe'
    )
    const response = await fetch('/payments/intents', { method: 'POST' })
    const session = await response.json()
    const result = await stripe.redirectToCheckout({ sessionId: session.id })
    if (result.error) {
      dispatch(paymentFailure(result.error.message))
    }
  }
}

export const paymentSuccess = () => {
  return {
    type: PAYMENT_SUCCESS,
  }
}

export const paymentFailure = (error) => {
  return {
    type: PAYMENT_FAIL,
    payload: error,
  }
}
