import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage as Tr } from 'react-intl';
import { Link } from 'react-router-dom';
import { Container, Dropdown, Icon, Label, Menu, Progress } from 'semantic-ui-react';

import { Timeouts } from 'utils/timers';

import messages from '../messages';

import DropdownRedisItem from './DropdownRedisItem';
import TopNailedFullWidthContainer from './TopNailedFullWidthContainer';
import './Navbar.css';


Navbar.propTypes = {
    actions: PropTypes.shape({
        fetchInstances: PropTypes.func.isRequired,
        setActiveInstance: PropTypes.func.isRequired,
        toggleProgressBarVisible: PropTypes.func.isRequired,
    }).isRequired,
    urls: PropTypes.shape({
        status: PropTypes.string,
    }),
    location: PropTypes.shape({
        pathname: PropTypes.string,
        search: PropTypes.string,
        hash: PropTypes.string,
        key: PropTypes.string,
    }),
    activeInstanceName: PropTypes.string,
    instances: PropTypes.array.isRequired,
    progressPercent: PropTypes.number,
    progressIsVisible: PropTypes.bool,
};
export default function Navbar(props) {
    const {
        instances = {},
        activeInstanceName,
        urls,
        actions,
        progressPercent,
        progressIsVisible,
        location,
    } = props;

    const ddInstanceText = activeInstanceName
        ? <span><Tr { ...messages.instance } />: <Label size='mini'>{ activeInstanceName }</Label></span>
        : <span><Tr { ...messages.instances } /></span>;

    progressIsVisible && progressPercent >= 99.0 && Timeouts.add({
        name: 'Navbar.toggleProgressBarVisible:false',
        callback: () => actions.toggleProgressBarVisible(false),
        timeout: 500,
    });

    return (
        <Menu className='Navbar' fixed='top'>
            { progressIsVisible &&
                <TopNailedFullWidthContainer>
                    <Progress indicating={ true } percent={ progressPercent } attached='top' color='green' />
                </TopNailedFullWidthContainer>
            }

            <Container>
                <Menu.Item
                    header={ true } active={ location.pathname === `/${activeInstanceName}` }
                    as={ Link } to={ `/${activeInstanceName}` }
                >
                    <Icon name='map' />
                    Redis Navigator
                </Menu.Item>

                <Menu.Item
                    header={ true } active={ location.pathname === `/${activeInstanceName}/dashboard` }
                    as={ Link } to={ `/${activeInstanceName}/dashboard` }
                >
                    <Icon name='dashboard' />
                </Menu.Item>

                <Menu.Item
                    header={ true } active={ location.pathname === `/${activeInstanceName}/console` }
                    as={ Link } to={ `/${activeInstanceName}/console` }
                >
                    <Icon name='terminal' />
                </Menu.Item>

                <Dropdown item={ true } trigger={ ddInstanceText }>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={ () => actions.fetchInstances(urls.status) }>
                            <Icon name='refresh' />
                            <Tr { ...messages.refresh } />
                        </Dropdown.Item>

                        { !_.isEmpty(instances) && <Dropdown.Divider /> }
                        { instances.map((redisOptions, i) =>
                            <DropdownRedisItem
                                { ...redisOptions }
                                key={ i }
                                active={ activeInstanceName === redisOptions.name }
                                handleClick={ () => actions.setActiveInstance(redisOptions.name) }
                            /> 
                        ) }
                    </Dropdown.Menu>
                </Dropdown>
            </Container>
        </Menu>
    );
}
