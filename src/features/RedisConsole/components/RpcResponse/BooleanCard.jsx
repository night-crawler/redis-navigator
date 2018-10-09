import PropTypes from 'prop-types';
import React from 'react';
import { Card } from 'semantic-ui-react';


BooleanCard.propTypes = {
  result: PropTypes.bool.isRequired,
};
export default function BooleanCard(props) {
  const { result } = props;
  return <Card
    className='BooleanCard'
    fluid={ true }
    header='Boolean'
    description={ `${result}` }
  />;
}
