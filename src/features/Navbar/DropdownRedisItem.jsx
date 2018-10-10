import PropTypes from 'prop-types';
import React from 'react';
import { Dropdown, Label } from 'semantic-ui-react';


DropdownRedisItem.propTypes = {
  // is pool closed
  closed: PropTypes.bool,
  active: PropTypes.bool,
  freesize: PropTypes.number,
  maxsize: PropTypes.number,
  name: PropTypes.string,
  display_name: PropTypes.string,
  handleClick: PropTypes.func.isRequired,
};
export function DropdownRedisItem(props) {
  const circleColor = props.closed === false ? 'green' : 'red';

  return (
    <Dropdown.Item active={ props.active } onClick={ props.handleClick } className='DropdownRedisItem'>
      <Label circular={ true } size='mini' color={ circleColor }>
        { props.freesize }/{ props.maxsize }
      </Label>
      <Label size='mini'>
        { props.name }
      </Label>
      { props.display_name }
    </Dropdown.Item>
  );
}