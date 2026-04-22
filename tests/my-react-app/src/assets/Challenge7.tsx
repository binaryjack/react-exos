import React, { useRef, useState } from 'react';

interface IContact {
  id: number;
  name: string;
  hasEmail: boolean;
  email: string;
}

const newContact = (id: number): IContact => {
  return {
    id,
    name: '',
    hasEmail: false,
    email: '',
  };
};

interface IContactDetailProps {
  contact: IContact;
  update: <T extends keyof IContact>(
    id: number,
    fieldName: T,
    value: IContact[T]
  ) => void;
  remove: (id: number) => void;
}

const ContactDetail = ({ contact, remove, update }: IContactDetailProps) => {
  const handleUpdateName = (e: React.ChangeEvent<HTMLInputElement>) =>
    update(contact.id, 'name', e.currentTarget.value);
  const handleUpdateEmail = (e: React.ChangeEvent<HTMLInputElement>) =>
    update(contact.id, 'email', e.currentTarget.value);
  const handleUpdateHasEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.currentTarget.checked;
    update(contact.id, 'hasEmail', isChecked);
    if (!isChecked) update(contact.id, 'email', '');
  };
  const handleDelete = () => remove(contact.id);
  return (
    <div style={{ display: 'flex', flexDirection: 'row', padding: '0.1em' }}>
      <div>{contact.id}</div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          margin: '0.1em',
          paddingLeft: '0.2em',
        }}
      >
        <label htmlFor={`${contact.id}-contact-name`}>Name</label>
        <input
          id={`${contact.id}-contact-name`}
          type="text"
          value={contact.name}
          onChange={handleUpdateName}
        />
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          margin: '0.1em',
          paddingLeft: '0.2em',
        }}
      >
        <label htmlFor={`${contact.id}-contact-has-email`}>Has Email</label>
        <input
          id={`${contact.id}-contact-has-email`}
          type="checkbox"
          checked={contact.hasEmail}
          onChange={handleUpdateHasEmail}
        />
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          margin: '0.1em',
          paddingLeft: '0.2em',
        }}
      >
        {contact.hasEmail && (
          <>
            <label htmlFor={`${contact.id}-contact-email`}>Email</label>
            <input
              id={`${contact.id}-contact-email`}
              type="text"
              value={contact.email}
              onChange={handleUpdateEmail}
            />
          </>
        )}
      </div>
      <div>
        <button onClick={handleDelete}>-</button>
      </div>
    </div>
  );
};

interface IContactStatsProps {
  contacts: IContact[];
}

const ContactStats = ({ contacts }: IContactStatsProps) => {
  const contactsCount = contacts.length;
  const contactsWithEmails = contacts.filter((o) => o.hasEmail).length;
  return (
    <div>
      <div>Total Contacts: {contactsCount}</div>
      <div>Contacts with email: {contactsWithEmails}</div>
    </div>
  );
};

export const ContactsManager = () => {
  const [contacts, setContacts] = useState<IContact[]>([]);
  const ids = useRef<number>(0);
  const handleNewContact = () => {
    ids.current += 1;
    setContacts((prev) => [...prev, newContact(ids.current)]);
  };
  const handleUpdateContact = <T extends keyof IContact>(
    id: number,
    fieldName: T,
    value: IContact[T]
  ) =>
    setContacts((prev) =>
      prev.map((contact) => {
        return contact.id === id
          ? {
              ...contact,
              [fieldName]: value,
            }
          : contact;
      })
    );

  const handleRemoveContact = (id: number) =>
    setContacts((prev) => prev.filter((o) => o.id !== id));

  return (
    <div>
      <h1>Contacts Manager</h1>
      <div>
        <button onClick={handleNewContact}>+</button>
      </div>
      <div>
        {contacts.map((contact) => {
          return (
            <ContactDetail
              key={contact.id}
              contact={contact}
              remove={handleRemoveContact}
              update={handleUpdateContact}
            />
          );
        })}
      </div>
      <ContactStats contacts={contacts} />
    </div>
  );
};
