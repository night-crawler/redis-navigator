import React from 'react';
import { Container, Dropdown, Image, Menu, Icon, Label, Progress } from 'semantic-ui-react';
import _ from 'lodash';


function NavbarRedisItem(props) {
    const circleColor = props.closed == false ? 'green' : 'red';
    const isSelected = props.selected == props.name;

    return (
        <Dropdown.Item className={ isSelected ? 'selected' : '' }>
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


export default function Navbar(props) {
    const { instances = {}, activeInstance } = props;

    return (
        <Menu fixed='top' inverted={ true }>
            <Container>
                <Menu.Item as='a' header={ true }>
                    <Image
                        size='mini'
                        src='/logo.png'
                        style={ { marginRight: '1.5em' } }
                    />
                    Redis Navigator
                </Menu.Item>
                <Menu.Item as='a'>Home</Menu.Item>

                <Dropdown item={ true } text='Instances'>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={ props.handleLoadRedisInstances }>
                            <Icon name='refresh' />
                            Refresh
                        </Dropdown.Item>

                        { !_.isEmpty(instances) && <Dropdown.Divider /> }
                        {
                            Object.entries(instances).map(([, redisOptions], i ) => {
                                console.log(activeInstance === redisOptions.name, activeInstance, redisOptions.name);
                                return <NavbarRedisItem
                                    { ...redisOptions }
                                    key={ i }
                                    selected={ activeInstance === redisOptions.name }
                                />;
                            })
                        }

                    </Dropdown.Menu>
                </Dropdown>

            </Container>
        </Menu>
    );
}
