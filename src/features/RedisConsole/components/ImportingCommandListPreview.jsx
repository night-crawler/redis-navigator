import PropTypes from 'prop-types';
import React from 'react';
import { List } from 'semantic-ui-react';


ImportingCommandListPreview.propTypes = {
  commands: PropTypes.arrayOf(PropTypes.shape({
    methodName: PropTypes.string.isRequired,
    methodParams: PropTypes.object,
  })).isRequired,
};

export default function ImportingCommandListPreview(props) {
  const { commands } = props;

  return (
    <List className='ImportingCommandListPreview' selection={ true } verticalAlign='middle'>
      { commands.map(({ methodName, methodParams }, i) =>
        <List.Item key={ i }>
          <List.Header>{ methodName }</List.Header>
          <List.Description>
            { JSON.stringify(methodParams) }
          </List.Description>
        </List.Item>
      ) }
    </List>
  );
}
