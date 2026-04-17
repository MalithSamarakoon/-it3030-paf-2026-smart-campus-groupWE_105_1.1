export const saveUser = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    window.dispatchEvent(new Event('authChange'));
};

export const getUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

export const logout = () => {
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('authChange'));
};
