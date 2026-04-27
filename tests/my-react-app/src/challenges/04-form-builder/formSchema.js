export const registrationSchema = [
  {
    name: 'username',
    label: 'Username',
    type: 'text',
    placeholder: 'Enter username',
    validation: (val) => val.length >= 3 || 'Username must be at least 3 characters'
  },
  {
    name: 'email',
    label: 'Email Address',
    type: 'email',
    placeholder: 'Enter email',
    validation: (val) => val.includes('@') || 'Invalid email address'
  },
  {
    name: 'role',
    label: 'Preferred Role',
    type: 'select',
    options: ['Developer', 'Designer', 'Manager'],
    validation: (val) => !!val || 'Please select a role'
  },
  {
    name: 'newsletter',
    label: 'Subscribe to newsletter',
    type: 'checkbox',
    defaultValue: true
  }
];
