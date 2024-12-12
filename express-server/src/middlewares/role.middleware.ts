import { AccessControl } from 'accesscontrol';

const grantList = [
    {role: 'admin', resource: 'users', action: 'read:any', attributes: '*, !password'},
    {role: 'user', resource: 'users', action: 'read:own', attributes: '* !password !role'},
    {role: 'user', resource: 'users', action: 'update:own', attributes: '* !email'},
];

export default new AccessControl(grantList);

