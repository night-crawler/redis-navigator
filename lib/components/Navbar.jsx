import PropTypes from 'prop-types';
import React from 'react';
import { Container, Dropdown, Image, Menu, Icon, Label } from 'semantic-ui-react';
import _ from 'lodash';


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
    onLoadRedisInstances: PropTypes.func.isRequired,
    activeInstance: PropTypes.string,
    instances: PropTypes.object.isRequired,
};
export default function Navbar(props) {
    const { instances = {}, activeInstance } = props;

    return (
        <Menu fixed='top'>
            <Container>
                <Menu.Item as='a' header={ true }>
                    <Image
                        size='mini'
                        src='/logo.png'
                        style={ { marginRight: '1.5em' } }
                    />
                    Redis Navigator
                </Menu.Item>

                <Dropdown item={ true } text={ !activeInstance ? 'Instances' : `Instance: [${activeInstance}]` }>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={ props.onLoadRedisInstances }>
                            <Icon name='refresh' />
                            Refresh
                        </Dropdown.Item>

                        { !_.isEmpty(instances) && <Dropdown.Divider /> }
                        {
                            Object.entries(instances).map(([, redisOptions], i ) => {
                                return <NavbarRedisItem
                                    { ...redisOptions }
                                    key={ i }
                                    active={ activeInstance === redisOptions.name }
                                />;
                            })
                        }
                    </Dropdown.Menu>
                </Dropdown>

                <Menu.Item as='a' onClick={ props.onLoadRedisInfo }>
                    <Icon name='refresh' />
                </Menu.Item>

            </Container>
        </Menu>
    );
}
