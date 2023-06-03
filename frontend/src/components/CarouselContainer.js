import Carousel from 'react-bootstrap/Carousel'
import carousel1 from '../images/carousel1.avif'
import carousel2 from '../images/carousel2.avif'


function CarouselContainer() {
  return (
    <Carousel fade>
      <Carousel.Item>
        <img className='d-block w-100' src={carousel1} alt='First slide' />
      </Carousel.Item>
      <Carousel.Item>
        <img className='d-block w-100' src={carousel2} alt='Second slide' />
      </Carousel.Item>

    </Carousel>
  )
}

export default CarouselContainer
