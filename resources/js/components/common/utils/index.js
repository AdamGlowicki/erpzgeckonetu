export const userPermissions = (permissionsUsers, users, loggedUser = '') => {
    const admins = ['admin', 'mateusz brzeski', 'adam głowicki', 'radosław sułkowski', 'adam janikowski']
    const userIdsWitchPermissions = permissionsUsers.filter(item => item.permission).map(item => item.user_id);
    const usersWithPermissions = users.filter(item => {
        return userIdsWitchPermissions.includes(item.id)
    }).map(item => item.name);

    const adminsAndUsers = [...admins, ...usersWithPermissions]

    return adminsAndUsers.includes(loggedUser.toLowerCase());
}

export const adminPermission = (loggedUser) => {
    const admins = ['admin', 'mateusz brzeski', 'adam głowicki', 'radosław sułkowski', 'adam janikowski']

    return admins.includes(loggedUser.toLowerCase())
}
