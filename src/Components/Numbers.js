import React from 'react';

const Numbers = (props) => {

  return (
    <div className="card text-center">
      <div>
        {Numbers.list.map((number, i) =>
          <span key={i}>{number}</span>
        )}
      </div>
    </div>
  );
};

Numbers.list = [1,2,3,4,5,6,7,8,9];

export default Numbers;
