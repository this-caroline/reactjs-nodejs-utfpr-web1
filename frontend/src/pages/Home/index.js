import React from 'react';
import { useSelector } from 'react-redux';
import { Container } from 'reactstrap';

const Home = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <Container fluid className="text-muted mt-4">
      <div className="ml-2">
        <h4>
          Welcome,&nbsp;<strong>{ user.username }</strong>!
        </h4>

        <div className="w-75">
          <p>
            Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur!
            Integer eget egestas velit, ac ornare mauris. Morbi convallis sapien eget nulla
            lacinia convallis. Etiam sodales mauris ultricies ligula pulvinar!
          </p>
        </div>
      </div>
    </Container>
  );
};

export default Home;
