import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Internationalization } from './components';
import { activeLocale, activeLocaleData } from './selectors';


export default connect(
    createStructuredSelector({
        activeLocaleData,
        activeLocale,
    }),
    null,
    null,
    { pure: false }
)(Internationalization);


export {
    updateIntl,
    switchLocale,
    UPDATE_INTL_DATA,
    SWITCH_INTL_LOCALE,
} from './actions';
