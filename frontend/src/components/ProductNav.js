
import Nav from 'react-bootstrap/Nav'

import { Link } from 'react-router-dom'

const navStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const linkStyle = {
  color: '#010101',
  fontWeight: 'bold',
  margin: '0 10px',
}

function ProductNav() {
  return (
    <Nav
      className='justify-content-center'
      style={{ ...navStyle, maxHeight: '100px' }}
      navbarScroll
    >
      <Link to='/category/spices' className='nav-link' style={linkStyle}>
        Spices
      </Link>
      <Link to='/category/legumes' className='nav-link' style={linkStyle}>
        Legumes
      </Link>
      <Link to='/category/grains' className='nav-link' style={linkStyle}>
        Grains
      </Link>
      <Link
        to='/category/cereals-and-pasta'
        className='nav-link'
        style={linkStyle}
      >
        Cereal & Pasta
      </Link>
      <Link to='/category/sweeteners' className='nav-link' style={linkStyle}>
        Sweeteners
      </Link>
      <Link
        to='/category/nuts-and-seeds'
        className='nav-link'
        style={linkStyle}
      >
        Nuts & Seeds
      </Link>
      <Link to='/category/sauces' className='nav-link' style={linkStyle}>
        Sauces
      </Link>
    </Nav>
  )
}

export default ProductNav
