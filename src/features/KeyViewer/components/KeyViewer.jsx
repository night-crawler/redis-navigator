import React from 'react';
import PropTypes from 'prop-types';
import { Segment } from 'semantic-ui-react';
import isEmpty from 'lodash/isEmpty';
import isNumber from 'lodash/isNumber';


export default class KeyViewer extends React.Component {
    static propTypes = {
        actions: PropTypes.shape({

        }),
        routeKeys: PropTypes.object,
    };

    render() {
        return (
            <Segment>
                sample
            </Segment>
        );
    }

}
