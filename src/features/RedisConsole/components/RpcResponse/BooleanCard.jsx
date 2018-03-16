import React from 'react';
import { Card } from 'semantic-ui-react';
import PropTypes from 'prop-types';


BooleanCard.propTypes = {
    result: PropTypes.bool.isRequired,
};
export default function BooleanCard(props) {
    const { result } = props;
    return <Card header='Boolean' description={ `${result}` } />;
}
