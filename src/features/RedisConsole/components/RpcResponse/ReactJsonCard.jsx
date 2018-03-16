import React from 'react';
import ReactJson from 'react-json-view';
import { Card } from 'semantic-ui-react';
import PropTypes from 'prop-types';


ReactJsonCard.propTypes = {
    result: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    groupArraysAfterLength: PropTypes.number,
};
export default function ReactJsonCard(props) {
    const { result, groupArraysAfterLength = 20 } = props;
    return (
        <Card fluid={ true }>
            <Card.Content header='Object' />
            <Card.Description>
                <ReactJson
                    src={ result }
                    groupArraysAfterLength={ groupArraysAfterLength }
                    name={ false }
                />
            </Card.Description>
        </Card>
    );
}
