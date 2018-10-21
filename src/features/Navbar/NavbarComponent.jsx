import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage as Tr } from 'react-intl';
import { Link } from 'react-router-dom';
import { Container, Dropdown, Label, Menu, Progress } from 'semantic-ui-react';

import { Timeouts } from 'utils/timers';

import messages from './messages';
import { DropdownRedisItem } from './DropdownRedisItem';
import { TopNailedFullWidthContainer } from './TopNailedFullWidthContainer';
import './NavbarComponent.css';

const i18nInstance = <Tr { ...messages.instance } />;
const i18nInstances = <Tr { ...messages.instances } />;
const i18nRefresh = <Tr { ...messages.refresh } />;

NavbarRedisDropdown.propTypes = {
  activeInstanceName: PropTypes.string,
  instances: PropTypes.array.isRequired,
  onRefreshButtonClick: PropTypes.func,
  onSetActiveInstance: PropTypes.func,
};
export function NavbarRedisDropdown(props) {
  const ddInstanceText = props.activeInstanceName
    ? <span>{ i18nInstance }: <Label size='mini'>{ props.activeInstanceName }</Label></span>
    : <span>{ i18nInstances }</span>;

  return (
    <Dropdown item={ true } trigger={ ddInstanceText }>
      <Dropdown.Menu>
        <Dropdown.Item 
          onClick={ props.onRefreshButtonClick }
          icon='refresh'
          content={ i18nRefresh }
        />
        { !_.isEmpty(props.instances) && <Dropdown.Divider /> }
        { props.instances.map((redisOptions, i) =>
          <DropdownRedisItem
            { ...redisOptions }
            key={ i }
            active={ props.activeInstanceName === redisOptions.name }
            handleClick={ () => props.onSetActiveInstance(redisOptions.name) }
          /> 
        ) }
      </Dropdown.Menu>
    </Dropdown>
  );
}


NavbarComponent.propTypes = {
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
export function NavbarComponent(props) {
  props.progressIsVisible && props.progressPercent >= 99.0 && Timeouts.add({
    name: 'Navbar.toggleProgressBarVisible:false',
    callback: () => props.actions.toggleProgressBarVisible(false),
    timeout: 500,
  });

  return (
    <Menu className='NavbarComponent' fixed='top'>
      { props.progressIsVisible &&
        <TopNailedFullWidthContainer>
          <Progress indicating={ true } percent={ props.progressPercent } attached='top' color='green' />
        </TopNailedFullWidthContainer>
      }

      <Container>
        <Menu.Item
          header={ true } active={ location.pathname === `/${props.activeInstanceName}` }
          as={ Link } to={ `/${props.activeInstanceName}` }
          content='Redis Navigator'
          icon='map'
        />

        <Menu.Item
          header={ true } active={ location.pathname === `/${props.activeInstanceName}/dashboard` }
          as={ Link } to={ `/${props.activeInstanceName}/dashboard` }
          icon='dashboard'
        />

        <Menu.Item
          header={ true } active={ location.pathname === `/${props.activeInstanceName}/console` }
          as={ Link } to={ `/${props.activeInstanceName}/console` }
          icon='terminal'
        />

        <NavbarRedisDropdown
          activeInstanceName={ props.activeInstanceName }
          instances={ props.instances }
          onRefreshButtonClick={ () => props.actions.fetchInstances(props.urls.status) }
          onSetActiveInstance={ name => props.actions.setActiveInstance(name) }
        />
      </Container>
    </Menu>
  );
}
