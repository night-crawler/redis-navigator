import PropTypes from 'prop-types';
import React from 'react';
import { Card } from 'semantic-ui-react';


BooleanCard.propTypes = {
  result: PropTypes.bool.isRequired,
};
export function BooleanCard(props) {
  return <Card
    className='BooleanCard'
    fluid={ true }
    header='Boolean'
    description={ `${props.result}` }
  />;
}
