import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom'
import { Container, Dropdown, Icon, Image, Label, Menu } from 'semantic-ui-react';


NavbarRedisItem.propTypes = {
    // is pool closed
    closed: PropTypes.bool,
    active: PropTypes.bool,
    freesize: PropTypes.number,
    maxsize: PropTypes.number,
    name: PropTypes.string,
    display_name: PropTypes.string,
};

function NavbarRedisItem(props) {
    const circleColor = props.closed === false ? 'green' : 'red';

    return (
        <Dropdown.Item active={ props.active }>
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

Navbar.propTypes = {
    onLoadInstances: PropTypes.func.isRequired,
    onLoadInfo: PropTypes.func.isRequired,

    activeInstanceName: PropTypes.string,
    instances: PropTypes.array.isRequired,
};
export default function Navbar(props) {
    const { instances = {}, activeInstanceName } = props;

    const ddInstanceText = activeInstanceName
        ? <span>Instance: <Label size='mini'>{ activeInstanceName }</Label></span>
        : <span>Instances</span>;

    return (
        <Menu fixed='top'>
            <Container>
                <Menu.Item as={ Link } header={ true } to={ `${activeInstanceName}/dashboard` }>
                    <Image
                        size='mini'
                        src='/logo.png'
                        style={ { marginRight: '1.5em' } }
                    />
                    Redis Navigator
                </Menu.Item>

                <Dropdown item={ true } trigger={ ddInstanceText }>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={ props.onLoadInstances }>
                            <Icon name='refresh' />
                            Refresh
                        </Dropdown.Item>

                        { !_.isEmpty(instances) && <Dropdown.Divider /> }
                        {
                            instances.map((redisOptions, i) =>
                                <NavbarRedisItem
                                    { ...redisOptions }
                                    key={ i }
                                    active={ activeInstanceName === redisOptions.name }
                                />
                            )
                        }
                    </Dropdown.Menu>
                </Dropdown>

                {
                    activeInstanceName &&
                    <Menu.Item as='a' onClick={ props.onLoadInfo }>
                        <Icon name='refresh' />
                    </Menu.Item>
                }

            </Container>
        </Menu>
    );
}
