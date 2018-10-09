import PropTypes from 'prop-types';
import React from 'react';
import { IntlProvider } from 'react-intl';


export default class Internationalization extends React.PureComponent {
    static propTypes = {
      activeLocale: PropTypes.string,
      activeLocaleData: PropTypes.shape({
        messages: PropTypes.object,
      }),
      children: PropTypes.element.isRequired,
    };

    render() {
      const { activeLocale, activeLocaleData, children } = this.props;
      const { messages } = activeLocaleData;

      return (
        <IntlProvider
          locale={ activeLocale } key={ activeLocale }
          messages={ messages }>
          { React.Children.only(children) }
        </IntlProvider>
      );
    }
}
