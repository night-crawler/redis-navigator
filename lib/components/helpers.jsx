import PropTypes from 'prop-types';
import React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';
import styled from 'styled-components';


const Fullpage = styled.div`
    height: 100vh;
`;


FullpageDimmer.propTypes = {
    message: PropTypes.string,
};

export function FullpageDimmer({ message = 'Loading' }) {
    return (
        <Fullpage>
            <Dimmer active={ true }>
                <Loader size='massive'>{ message }</Loader>
            </Dimmer>
        </Fullpage>
    );
}
