import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage as Tr } from 'react-intl';
import { Dimmer, Loader } from 'semantic-ui-react';

import messages from '../messages';


FullPageDimmer.propTypes = {
    message: PropTypes.oneOfType([ PropTypes.string, PropTypes.element ]),
    inverted: PropTypes.bool,
};

FullPageDimmer.defaultProps = {
    message: <Tr { ...messages.loading } />,
    inverted: true,
};

export default function FullPageDimmer(props) {
    const { inverted, message, ...rest } = props;
    return (
        <div style={ { height: '100%' } } className='FullPageDimmer'>
            <Dimmer active={ true } inverted={ inverted } { ...rest }>
                <Loader size='massive'>{ message }</Loader>
            </Dimmer>
        </div>
    );
}
