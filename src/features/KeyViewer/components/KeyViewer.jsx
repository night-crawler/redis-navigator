import React from 'react';
import PropTypes from 'prop-types';
import { Segment } from 'semantic-ui-react';
import isEmpty from 'lodash/isEmpty';
import isNumber from 'lodash/isNumber';


export default class KeyViewer extends React.Component {
    static propTypes = {
        actions: PropTypes.shape({
            searchKeys: PropTypes.func,
        }),
        routeInstanceSearchUrl: PropTypes.string,
        routeKeys: PropTypes.object,
    };

    componentDidMount() {
        this.props.actions.searchKeys({ pattern: 'bla' });
    }

    render() {
        return (
            <Segment>
                { this.props.routeInstanceSearchUrl }
            </Segment>
        );
    }

}
