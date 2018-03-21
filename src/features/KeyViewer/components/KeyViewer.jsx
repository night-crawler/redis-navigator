import React from 'react';
import PropTypes from 'prop-types';


export default class KeyViewer extends React.Component {
    static propTypes = {
        actions: PropTypes.shape({
            loadInfo: PropTypes.func.isRequired,
        }),
    };

    componentDidMount() {
        const { actions } = this.props;
        actions.loadInfo();
    }

    render() {
        return (
            <div>
                sample
            </div>
        );
    }
}
