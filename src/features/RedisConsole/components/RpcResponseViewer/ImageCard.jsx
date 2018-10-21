import PropTypes from 'prop-types';
import React from 'react';
import { Image } from 'semantic-ui-react';


ImageCard.propTypes = {
  dataUri: PropTypes.string.isRequired,
};
export function ImageCard(props) {
  return <Image 
    className='ImageCard' 
    src={ props.dataUri } 
    size='medium' 
  />;
}
