import {usePage} from "@inertiajs/react";

// Хук для проверки ролей пользователя
export const useUserRoles = () => {
    // const user = useUser();
    const user = usePage().props.auth.user;

    // Функция для проверки наличия одной или нескольких ролей
    const hasRole = (rolesToCheck) => {
        debugger
        if (!user || !user.roles) return false;

        // Поддержка как строки, так и массива ролей
        const rolesArray = Array.isArray(rolesToCheck) ? rolesToCheck : [rolesToCheck];

        return user.roles.some((role) => rolesArray.includes(role.name));
    };

    return { hasRole };
};
