import React from 'react';
import { Image } from 'semantic-ui-react';
import PropTypes from 'prop-types';


ImageCard.propTypes = {
    dataUri: PropTypes.string,
};
export default function ImageCard(props) {
    const { dataUri } = props;
    return <Image src={ dataUri } size='medium' />;
}
