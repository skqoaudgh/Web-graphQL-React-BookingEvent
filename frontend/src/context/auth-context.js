import React from 'react';

export default React.createContext({
    // Initial Setting
    token: null,
    userId: null,
    login: (token, userId, tokenExpiration) => {},
    logout: () => {}
});