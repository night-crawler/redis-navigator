import React from 'react';
import PropTypes from 'prop-types';
import { Segment } from 'semantic-ui-react';
import isEmpty from 'lodash/isEmpty';
import isNumber from 'lodash/isNumber';


export default class KeyViewer extends React.Component {
    static propTypes = {
        actions: PropTypes.shape({
            fetchMatchCount: PropTypes.func.isRequired,
            fetchMatchChunk: PropTypes.func.isRequired,
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

    componentDidMount() {
        const { actions } = this.props;
        actions.fetchMatchCount('*');
    }

    componentWillReceiveProps(nextProps) {
        const { routeKeys } = nextProps;
        const currentKeys = routeKeys['*'];
        if (!isEmpty(currentKeys))
            this.handleFetchMatchChunk(currentKeys);
    }

    handleFetchMatchChunk = ({ cursor, prevCursor, completed, count, blockSize }) => {
        const { actions } = this.props;
        if (!isNumber(cursor))
            return;
        if (completed)
            return;

        actions.fetchMatchChunk('*', cursor, blockSize);
    }
}
