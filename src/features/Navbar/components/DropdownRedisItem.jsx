import PropTypes from 'prop-types';
import React from 'react';
import { Dropdown, Label } from 'semantic-ui-react';


NavbarDropdownRedisItem.propTypes = {
    // is pool closed
    closed: PropTypes.bool,
    active: PropTypes.bool,
    freesize: PropTypes.number,
    maxsize: PropTypes.number,
    name: PropTypes.string,
    display_name: PropTypes.string,
    handleClick: PropTypes.func.isRequired,
};
export default function NavbarDropdownRedisItem(props) {
    const circleColor = props.closed === false ? 'green' : 'red';

    return (
        <Dropdown.Item active={ props.active } onClick={ props.handleClick }>
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