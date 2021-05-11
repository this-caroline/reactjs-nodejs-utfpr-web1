import React from 'react';

import './help.css';

const Help = () => {
  return (
    <div id="help-container">
      <div id="help-content-header">
        <h1>We're here to help!</h1>
        <p>
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
          doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
          veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim
          ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
          consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
        </p>
      </div>

      <div id="help-content-body">
        <h4>Frequently Asked Questions</h4>
        <div className="faq-container">
          <h6>At vero eos et accusamus et iusto odio?</h6>
          <p>
            Dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque
            corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate
            non provident, similique sunt in culpa qui officia deserunt mollitia animi,
            id est laborum et dolorum fuga.
          </p>
        </div>

        <div className="faq-container">
          <h6>Nulla ac eleifend est, eu blandit libero?</h6>
          <p>
            Dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque
            corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate
            non provident, similique sunt in culpa qui officia deserunt mollitia animi,
            id est laborum et dolorum fuga. Ut enim ad minima veniam, quis nostrum
            exercitationem ullam corporis suscipit laboriosam! Nisi ut aliquid ex ea
            commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate.
          </p>
        </div>

        <div className="faq-container">
          <h6>Abeatae vitae dicta sunt explicabo?</h6>
          <p>
            Dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque
            corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate
            non provident, similique sunt in culpa qui officia deserunt mollitia animi,
            id est laborum et dolorum fuga. Adipisci velit. Sed quia consequuntur magni
            dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est,
            qui dolorem ipsum quia dolor sit amet, consectetur! Integer eget egestas velit,
            ac ornare mauris. Morbi convallis sapien eget nulla lacinia convallis.
            Etiam sodales mauris ultricies ligula pulvinar!
          </p>
        </div>

        <div className="faq-container">
          <h6>Quis autem vel eum iure reprehenderit?</h6>
          <p>
            Dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque
            corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate
            non provident, similique sunt in culpa qui officia deserunt mollitia animi,
            id est laborum et dolorum fuga. Dolores eos qui ratione voluptatem sequi
            nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet,
            consectetur, adipisci velit.sed quia consequuntur magni dolores eos qui
            ratione voluptatem sequi nesciunt. Neque porro quisquam est,
            qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed
            quia non numquam eius modi tempora incidunt ut labore et dolore magnam
            aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem
            ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?
          </p>
        </div>

        <div className="faq-container">
          <h6>Dolorem eum fugiat?</h6>
          <p>
            Dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque
            corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate
            non provident, similique sunt in culpa qui officia deserunt mollitia animi,
            id est laborum et dolorum fuga.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Help;
