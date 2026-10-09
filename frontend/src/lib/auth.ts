export const saveToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
};

export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const getUserFromToken = () => {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

export const logout = () => {
  removeToken();
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
};
