import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

const ProductNav = () => {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  return (
    <Navbar
      expanded={expanded}
      expand='lg'
      className='justify-content-center'
      style={{ backgroundColor: '#fff' }}
    >
      <Navbar.Toggle
        aria-controls='responsive-navbar-nav'
        onClick={handleToggle}
        className='ml-auto'
      />
      <Navbar.Collapse id='responsive-navbar-nav'>
        <Nav className='justify-content-center'>
          <Link to='/category/spices' className='nav-link'>
            Spices
          </Link>
          <Link to='/category/legumes' className='nav-link'>
            Legumes
          </Link>
          <Link to='/category/grains' className='nav-link'>
            Grains
          </Link>
          <Link to='/category/cereals-and-pasta' className='nav-link'>
            Cereal & Pasta
          </Link>
          <Link to='/category/sweeteners' className='nav-link'>
            Sweeteners
          </Link>
          <Link to='/category/nuts-and-seeds' className='nav-link'>
            Nuts & Seeds
          </Link>
          <Link to='/category/sauces' className='nav-link'>
            Sauces
          </Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default ProductNav;
