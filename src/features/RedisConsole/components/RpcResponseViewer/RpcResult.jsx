import { isArray, isBoolean, isPlainObject, isString } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Card, Header, Segment } from 'semantic-ui-react';

import { TextareaSpoiler } from '~/features/Common/components';

import { isJson, MimeDetector, isBase64, isValidNumber, isYaml } from '~/utils';

import { BooleanCard } from './BooleanCard';
import { ImageCard } from './ImageCard';
import { ObjectCard } from './ObjectCard';
import { ObjectTreeViewWidget } from './ObjectTreeViewWidget';


StringCard.propTypes = {
  result: PropTypes.string.isRequired,
};
export function StringCard(props) {
  let innerResult = false, type = '';

  if (isBase64(props.result, 4)) {
    innerResult = atob(props.result);
    type = 'base64';
  } else if (isValidNumber(props.result)) {
    // just deny json conversion
  }

  if (innerResult) {
    return (
      <Segment basic={ true }>
        <Header as='h5'>String[{ props.result.length }], { type }</Header>
        <TextareaSpoiler className='left floated' result={ props.result } />
        { <RpcResult result={ innerResult } /> }
      </Segment>
    );
  }

  return (
    <Card fluid={ true }>
      <Card.Content>
        <Card.Header>String[{ props.result.length }]{ type ? ', ' : '' }{ type }</Card.Header>
        <Card.Description>
          <pre>{ props.result }</pre>
        </Card.Description>
      </Card.Content>
    </Card>
  );
}


RpcResult.propTypes = {
  result: PropTypes.any,
};

export function RpcResult(props) {
  const detector = new MimeDetector(props.result);

  if (detector.isImage)
    return <ImageCard dataUri={ detector.imageDataURI } />;

  if (isArray(props.result))
    return <ObjectTreeViewWidget result={ props.result } />;

  if (isPlainObject(props.result))
    return <ObjectTreeViewWidget result={ props.result } />;

  if (isBoolean(props.result))
    return <BooleanCard result={ props.result } />;

  if (isJson(props.result))
    return <ObjectCard result={ props.result } mode='json' />;

  if (isYaml(props.result))
    return <ObjectCard result={ props.result } mode='yaml' />;

  if (isString(props.result))
    return <StringCard result={ props.result } />;

  if (props.result === null)
    return <div>null</div>;

  return <div>{ props.result }</div>;
}
