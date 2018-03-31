import PropTypes from 'prop-types';
import React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';
import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from '../messages';

const MsgLoading = <FormattedMessage { ...messages.loading } />;


const FullPage = styled.div`
    height: 100vh;
`;


FullPageDimmer.propTypes = {
    message: PropTypes.string,
};

export default function FullPageDimmer({ message = MsgLoading }) {
    return (
        <FullPage>
            <Dimmer active={ true }>
                <Loader size='massive'>{ message }</Loader>
            </Dimmer>
        </FullPage>
    );
}
