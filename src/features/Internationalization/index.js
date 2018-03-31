import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Internationalization } from './components/index';
import { activeLocale, activeLocaleData } from './selectors';


export default connect(
    createStructuredSelector({
        activeLocaleData,
        activeLocale,
    }),
)(Internationalization);


export {
    updateIntl,
    switchLocale,
    UPDATE_INTL_DATA,
    SWITCH_INTL_LOCALE,
} from './actions';
