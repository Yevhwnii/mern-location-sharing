import React from 'react';

import UsersList from '../components/UsersList';

const Users = (props) => {
  const USERS = [
    {
      id: 'u1',
      name: 'Breiter',
      image: 'imageUrl',
      places: 3,
    },
  ];
  return <UsersList items={USERS} />;
};

export default Users;
