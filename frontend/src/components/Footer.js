import React from 'react';
import { Navbar, Container } from 'reactstrap';

const Footer = () => {
  return(
    <div className="fixed-bottom">  
      <Navbar color="dark" dark>
        <Container className="d-flex align-items-center justify-content-center">
          <h3 className="color-light h6 pt-2 text-white">
            Medical App 2021 &copy; All Rights Reserved
          </h3>
        </Container>
      </Navbar>
    </div>
  );
};

export default Footer;
