import { createSelector } from 'reselect';

export const inter = state => state.internationalization || {};

export const activeLocale = createSelector(inter, inter => inter.activeLocale || 'en');

export const data = createSelector(inter, inter => inter.data || {});

export const activeLocaleData = createSelector(
    [data, activeLocale],
    (data, activeLocale) => data[activeLocale] || {}
);
