//--------------------EXERCICE 2----------------------
import { useCallback, useEffect, useState } from 'react';

interface IGeo {
  lat: string;
  lng: string;
}

interface IAddress {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo?: IGeo;
}
interface ICompany {
  name: string;
  catchPhrase: string;
  bs: string;
}

interface IUser {
  id: number;
  name: string;
  username: string;
  email: string;
  address: IAddress;
  phone: string;
  website: string;
  company: ICompany;
}

type UType = Record<number, IUser>;

const apiSettings = {
  url: 'https://jsonplaceholder.typicode.com/users',
  method: 'GET',
  contentType: { 'Content-Type': 'application/json' },
};

const toRecord = (users: IUser[]): UType => {
  return Object.fromEntries(Object.entries(users).map((o) => [o[1].id, o[1]]));
};

export const UserList = () => {
  const [loadingState, setLoadingState] = useState<string>('');
  const [errors, setErrors] = useState<string>('');
  const [users, setUsers] = useState<UType>({});

  const controller = new AbortController();
  const { signal } = controller;
  const fetchUsers = useCallback(async () => {
    const response = await fetch(apiSettings.url, {
      signal: signal,
      method: apiSettings.method,
      headers: apiSettings.contentType,
    });
    if (!response.ok) {
      setErrors('unable to reach api');
      setLoadingState('');
      return;
    }
    const data: IUser[] = await response.json();
    const convertedUsers = toRecord(data);
    setUsers(convertedUsers);
    setLoadingState('');
  }, []);

  useEffect(() => {
    console.log('test');
    setLoadingState('Loading...');
    fetchUsers();

    return () => {
      controller.abort();
    };
  }, [fetchUsers]);

  const errorOnApiCallFailed = errors && <>{errors}</>;
  const loadingStatus = loadingState && <>{loadingState}</>;
  return (
    <div>
      <h1>User List</h1>
      <div>{errorOnApiCallFailed || loadingStatus}</div>
      <div>
        {Object.values(users).map((user: IUser) => {
          return <div key={user.id}>{user.name}</div>;
        })}
      </div>
    </div>
  );
};
