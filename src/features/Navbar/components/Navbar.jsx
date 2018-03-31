import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Dropdown, Icon, Label, Menu, Progress } from 'semantic-ui-react';
import DropdownRedisItem from './DropdownRedisItem';
import TopNailedFullWidthContainer from './TopNailedFullWidthContainer';
import { Timeouts } from '../../../timers';
import { FormattedMessage } from 'react-intl';
import messages from '../messages';


const MsgRefresh = <FormattedMessage { ...messages.refresh } />;


Navbar.propTypes = {
    actions: PropTypes.shape({
        fetchInstances: PropTypes.func.isRequired,
        setActiveInstance: PropTypes.func.isRequired,
        toggleProgressBarVisible: PropTypes.func.isRequired,
    }).isRequired,
    urls: PropTypes.shape({
        status: PropTypes.string,
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
    } = props;

    const ddInstanceText = activeInstanceName
        ? <span>Instance: <Label size='mini'>{ activeInstanceName }</Label></span>
        : <span>Instances</span>;

    progressIsVisible && progressPercent >= 99.0 && Timeouts.add({
        name: 'Navbar.toggleProgressBarVisible:false',
        callback: () => actions.toggleProgressBarVisible(false),
        timeout: 500,
    });

    return (
        <Menu fixed='top'>
            {
                progressIsVisible &&
                <TopNailedFullWidthContainer>
                    <Progress indicating={ true } percent={ progressPercent } attached='top' color='green' />
                </TopNailedFullWidthContainer>
            }

            <Container>
                <Menu.Item as={ Link } header={ true } to={ `/${activeInstanceName}` }>
                    <Icon name='map' />
                    Redis Navigator
                </Menu.Item>

                <Menu.Item as={ Link } header={ true } to={ `/${activeInstanceName}/dashboard` }>
                    <Icon name='dashboard' />
                </Menu.Item>

                <Menu.Item as={ Link } header={ true } to={ `/${activeInstanceName}/console` }>
                    <Icon name='terminal' />
                </Menu.Item>

                <Dropdown item={ true } trigger={ ddInstanceText }>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={ () => actions.fetchInstances(urls.status) }>
                            <Icon name='refresh' />
                            { MsgRefresh }
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
            </Container>
        </Menu>
    );
}
