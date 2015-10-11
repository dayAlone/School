import { LOGIN_SUCCESS, LOGIN_FAILURE } from '../constants/Login';

export function authCheck() {
    return dispatch => {
        $.get('/auth/check', data => {
            if (data.user) {
                dispatch(authSuccess(data.user));
            }
        });
    };
}

export function authLogin(request) {
    return dispatch => {
        $.post('/auth/local/login', request, data => {
            if (data.error) {
                dispatch(authError(data.error));
            }
            else dispatch(authSuccess(data));
        });
    };
}

export function authSocial(href) {
    return dispatch => {
        let popup = window.open('//' + window.location.host + href, 'popup', 'width=420, height=230, menubar=no, location=no, resizable=no, scrollbars=yes, status=no');
        window.addEventListener('message', event => {
            if (event.data.error) {
                dispatch(authError(event.data.error));
            }
            else dispatch(authSuccess(event.data.user));
            popup.close();
        }, false);

    };
}

export function authError(error) {
    return {
        type: LOGIN_FAILURE,
        error: error
    };
}

export function authSuccess(user) {
    return {
        type: LOGIN_SUCCESS,
        data: user
    };
}
