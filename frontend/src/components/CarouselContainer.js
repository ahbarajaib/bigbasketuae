import Carousel from 'react-bootstrap/Carousel'
import carousel1 from '../images/carousel1.png'
import carousel2 from '../images/carousel2.png'
import carousel3 from '../images/carousel3.png'

function CarouselContainer() {
  return (
    <Carousel fade>
      <Carousel.Item>
        <img className='d-block w-100' src={carousel1} alt='First slide' />
      </Carousel.Item>
      <Carousel.Item>
        <img className='d-block w-100' src={carousel2} alt='Second slide' />
      </Carousel.Item>
      <Carousel.Item>
        <img className='d-block w-100' src={carousel3} alt='Third slide' />
      </Carousel.Item>
    </Carousel>
  )
}

export default CarouselContainer
