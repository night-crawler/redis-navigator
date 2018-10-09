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
  const { result } = props;

  let innerResult = false, type = '';

  if (isBase64(result, 4)) {
    innerResult = atob(result);
    type = 'base64';
  } else if (isValidNumber(result)) {
    // just deny json conversion
  }

  if (innerResult) {
    return (
      <Segment basic={ true }>
        <Header as='h5'>String[{ result.length }], { type }</Header>
        <TextareaSpoiler className='left floated' result={ result } />
        { <Result result={ innerResult } /> }
      </Segment>
    );
  }

  return (
    <Card fluid={ true }>
      <Card.Content>
        <Card.Header>String[{ result.length }]{ type ? ', ' : '' }{ type }</Card.Header>
        <Card.Description>
          <pre>{ result }</pre>
        </Card.Description>
      </Card.Content>
    </Card>
  );
}


Result.propTypes = {
  result: PropTypes.any,
};

export function Result(props) {
  const
    { result } = props,
    detector = new MimeDetector(result);

  if (detector.isImage)
    return <ImageCard dataUri={ detector.imageDataURI } />;

  if (isArray(result))
    return <ObjectTreeViewWidget result={ result } />;

  if (isPlainObject(result))
    return <ObjectTreeViewWidget result={ result } />;

  if (isBoolean(result))
    return <BooleanCard result={ result } />;

  if (isJson(result))
    return <ObjectCard result={ result } mode='json' />;

  if (isYaml(result))
    return <ObjectCard result={ result } mode='yaml' />;

  if (isString(result))
    return <StringCard result={ result } />;

  if (result === null)
    return <div>null</div>;

  return <div>{ result }</div>;
}

