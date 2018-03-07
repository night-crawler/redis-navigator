import PropTypes from 'prop-types';
import React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';
import styled from 'styled-components';


const FullPage = styled.div`
    height: 100vh;
`;


FullPageDimmer.propTypes = {
    message: PropTypes.string,
};

export default function FullPageDimmer({ message = 'Loading' }) {
    return (
        <FullPage>
            <Dimmer active={ true }>
                <Loader size='massive'>{ message }</Loader>
            </Dimmer>
        </FullPage>
    );
}
