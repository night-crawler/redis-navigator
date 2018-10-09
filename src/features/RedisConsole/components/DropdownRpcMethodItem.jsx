import PropTypes from 'prop-types';
import React from 'react';

import { cleanMethodDoc } from '../utils';

import MethodParametersList from './MethodParametersList';


DropdownRpcMethodItem.propTypes = {
  // return_type: PropTypes.oneOfType([PropTypes.string, null]),
  name: PropTypes.string.isRequired,
  return_type: PropTypes.any,
  doc: PropTypes.any,
  parameters: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    kind: PropTypes.string.isRequired,
    default: PropTypes.any,
    type: PropTypes.any,
  })),
};
export default function DropdownRpcMethodItem(props) {
  const { name, return_type, doc, parameters } = props;
  return (
    <div className='ui mini buttons DropdownRpcMethodItem'>
      <div className='ui blue button'>{ name }</div>
      { parameters.length &&
      <div className='ui blue basic button' style={ { padding: 2 } }>
        { <MethodParametersList parameters={ parameters } /> }
      </div>
      }

      { return_type && <div className='ui red basic button'>{ return_type }</div> }
      { doc && <div className='ui blue basic button'>{ cleanMethodDoc(doc) }</div> }
    </div>
  );
}
