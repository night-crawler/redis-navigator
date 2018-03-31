import PropTypes from 'prop-types';
import React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';
import styled from 'styled-components';

import { FormattedMessage as Tr } from 'react-intl';


const FullPage = styled.div`
    height: 100vh;
`;


FullPageDimmer.propTypes = {
    message: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
};

export default function FullPageDimmer({ message = <Tr defaultMessage='Loading' /> }) {
    return (
        <FullPage>
            <Dimmer active={ true }>
                <Loader size='massive'>{ message }</Loader>
            </Dimmer>
        </FullPage>
    );
}
