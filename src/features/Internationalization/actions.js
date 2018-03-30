export const UPDATE_INTL_DATA = '@@Internationalization/locale/update';
export const SWITCH_INTL_LOCALE = '@@Internationalization/locale/switch';

export const updateIntl = ({ locale, formats, messages }) => ({
    type: UPDATE_INTL_DATA,
    payload: { locale, formats, messages },
});

export const switchLocale = locale => ({
    type: SWITCH_INTL_LOCALE,
    payload: locale,
});
