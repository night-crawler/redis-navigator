import PropTypes from 'prop-types';
import React from 'react';
import { IntlProvider } from 'react-intl';


export class Internationalization extends React.PureComponent {
    static propTypes = {
      activeLocale: PropTypes.string,
      activeLocaleData: PropTypes.shape({
        messages: PropTypes.object,
      }),
      children: PropTypes.element.isRequired,
    };

    render() {
      return (
        <IntlProvider
          locale={ this.props.activeLocale } key={ this.props.activeLocale }
          messages={ this.props.activeLocaleData?.messages }>
          { React.Children.only(this.props.children) }
        </IntlProvider>
      );
    }
}
