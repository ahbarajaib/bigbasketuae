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
      className="bg-body-tertiary"
      style={{ backgroundColor: '#fff' }}
    >
      <Navbar.Toggle
        aria-controls='navbarScroll'
        onClick={handleToggle}
        className='ml-auto'
      />
      <Navbar.Collapse id='navbarScroll'>
        <Nav className='justify-content-center'>
          <Link to='/category/spices-and-condiments' className='nav-link'>
            Spices & Condiments
          </Link>
          <Link to='/category/legumes' className='nav-link'>
            Legumes
          </Link>
          <Link to='/category/grains' className='nav-link'>
            Grains
          </Link>
          <Link to='/category/oils-and-ghees' className='nav-link'>
            Oils & Ghees
          </Link>
          <Link to='/category/canned-and-jarred-goods' className='nav-link'>
            Canned & Jarred Goods
          </Link>
          <Link to='/category/dryfruits-and-nuts' className='nav-link'>
            Dryfruits & Nuts
          </Link>
          <Link to='/category/beverages' className='nav-link'>
            Beverages
          </Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default ProductNav;
