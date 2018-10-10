import Cookies from 'js-cookie';

export function csrfSafeMethod(method) {
  // these HTTP methods do not require CSRF protection
  return ( /^(GET|HEAD|OPTIONS|TRACE)$/i.test(method) );
}


export const getApiMiddlewareOptions = ({ headers = {}, options = {}, csrfToken = '', method = 'GET' } = {}) => {
  const _csrfToken = csrfToken || Cookies.get('csrftoken');
  const _csrfHeader = _csrfToken && !csrfSafeMethod(method) ? { 'X-CSRFToken': _csrfToken } : {};
  const _headers = { ...headers, ..._csrfHeader };

  if (process.env.NODE_ENV !== 'production') {
    return {
      options: { ...options, mode: 'cors' },
      credentials: 'include',
      headers: _headers,
    };
  }
  return { headers: _headers, options };
};


export const jsonRequestHeaders = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
};


