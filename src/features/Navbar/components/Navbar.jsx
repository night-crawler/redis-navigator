import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Dropdown, Icon, Image, Label, Menu } from 'semantic-ui-react';
import DropdownRedisItem from './DropdownRedisItem';


Navbar.propTypes = {
    actions: PropTypes.shape({
        loadInstances: PropTypes.func.isRequired,
        loadInfo: PropTypes.func.isRequired,
        setActiveInstance: PropTypes.func.isRequired,
    }).isRequired,
    activeInstanceName: PropTypes.string,
    instances: PropTypes.array.isRequired,
};
export function Navbar(props) {
    const { instances = {}, activeInstanceName, actions } = props;

    const ddInstanceText = activeInstanceName
        ? <span>Instance: <Label size='mini'>{ activeInstanceName }</Label></span>
        : <span>Instances</span>;

    return (
        <Menu fixed='top'>
            <Container>
                <Menu.Item as={ Link } header={ true } to={ `/${activeInstanceName}/dashboard` }>
                    {/*<Image*/}
                    {/*size='mini'*/}
                    {/*src='/logo.png'*/}
                    {/*style={ { marginRight: '1.5em' } }*/}
                    {/*/>*/}

                    <Icon name='map' />
                    Redis Navigator
                </Menu.Item>

                <Menu.Item as={ Link } header={ true } to={ `/${activeInstanceName}/console` }>
                    <Icon name='terminal' />
                </Menu.Item>

                <Dropdown item={ true } trigger={ ddInstanceText }>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={ actions.loadInstances }>
                            <Icon name='refresh' />
                            Refresh
                        </Dropdown.Item>

                        { !_.isEmpty(instances) && <Dropdown.Divider /> }
                        {
                            instances.map((redisOptions, i) =>
                                <DropdownRedisItem
                                    { ...redisOptions }
                                    key={ i }
                                    active={ activeInstanceName === redisOptions.name }
                                    handleClick={ () => actions.setActiveInstance(redisOptions.name) }
                                />
                            )
                        }
                    </Dropdown.Menu>
                </Dropdown>

                {
                    activeInstanceName &&
                    <Menu.Item as='a' onClick={ () => actions.loadInfo(activeInstanceName) }>
                        <Icon name='refresh' />
                    </Menu.Item>
                }

            </Container>
        </Menu>
    );
}
