import React, { createContext, useContext } from 'react';

// Создаём контекст пользователя
const UserContext = createContext(null);

// Провайдер для передачи данных пользователя
export const UserProvider = ({ user, children }) => {
    return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

// Кастомный хук для использования контекста
export const useUser = () => {
    return useContext(UserContext);
};
