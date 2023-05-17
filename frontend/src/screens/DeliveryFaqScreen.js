import Accordion from 'react-bootstrap/Accordion'

function AllCollapseExample() {
  return (
    <Accordion>
      <h2>Delivery FAQ</h2>
      <Accordion.Item eventKey='0'>
        <Accordion.Header>In which areas do you deliver?</Accordion.Header>
        <Accordion.Body>
          We deliver to any area/building that is within the serviced area in
          Dubai, Abu Dhabi, Sharjah, Ajman, and Umm Al Quwain, Ras Al Khaimah
          and Fujairah. We are expanding our delivery area in order to provide
          the best service and we will keep you updated!
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey='1'>
        <Accordion.Header>
          Is it possible to set a specific delivery time?
        </Accordion.Header>
        <Accordion.Body>
          We offer same day delivery to Dubai. For other Emirates you can expect
          your orders to arrive next day.
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey='2'>
        <Accordion.Header>
          What types of delivery does BigBasketUAE have ?
        </Accordion.Header>
        <Accordion.Body>
          BigBasketUAE offers one type of delivery at the moment - courier
          delivery through our personal delivery (UAE)
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey='3'>
        <Accordion.Header>
          Can I refuse the order upon delivery?
        </Accordion.Header>
        <Accordion.Body>
          Yes. If you do not want to accept the order, you can contact our
          Customer Service at +971 5545710897 and tell them your reasons for
          refusing the order. If you want to refuse your order, we request that
          you do not open the items.
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey='4'>
        <Accordion.Header>
          Can I place the order from another city or country?
        </Accordion.Header>
        <Accordion.Body>
          Yes, you can order our products from another city as long as your
          delivery address is within our serviced area.
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey='5'>
        <Accordion.Header>
          I can not find my delivery area, What should I do?
        </Accordion.Header>
        <Accordion.Body>
          In case you didn't find your location in the form/Google map, please
          send us a location request at customercare@bigbasketuae.com through
          the website from the area selection screen. We will update you once
          the service is available in the requested area.
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey='6'>
        <Accordion.Header>What is your delivery time?</Accordion.Header>
        <Accordion.Body>
          <p>Dubai</p>
          <p>
            Same-day delivery is available. Any orders placed before 2:30 PM
            will be delivered on the same day.
          </p>
          <p> Other Emirates Next day delivery is available</p>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey='7'>
        <Accordion.Header>
          What if I do not receive my order within Estimated Arrival Time (ETA)?
        </Accordion.Header>
        <Accordion.Body>
          This should not happen, however, a delay may occur due to a high
          influx of orders or other unforeseen circumstances. In such cases
          BigBasketUAE will notify you via message or a phone call from our
          customer support executive who will inform you about the status of
          your order. or You can contact to our friendly customer service team
          who'll definitely sort this out for you.
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey='8'>
        <Accordion.Header>
          Is there any charges for using the cash-on-delivery payment option?
        </Accordion.Header>
        <Accordion.Body>
          If you use the cash-on-delivery payment method to pay for your order,
          there will be no additional charges for delivery.
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  )
}

export default AllCollapseExample
