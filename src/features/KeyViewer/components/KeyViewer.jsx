import React from 'react';
import PropTypes from 'prop-types';
import { Segment } from 'semantic-ui-react';


export default class KeyViewer extends React.Component {
    static propTypes = {
        actions: PropTypes.shape({
            fetchInfo: PropTypes.func.isRequired,
        }),
    };

    componentDidMount() {
        const { actions } = this.props;
        actions.fetchInfo();
    }

    render() {
        return (
            <Segment>
                sample
            </Segment>
        );
    }
}
