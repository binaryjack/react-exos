import { ReactNode } from 'react';

/**
 * CHALLENGE INSTRUCTIONS:
 * 1. Implement the TabsContext to share activeTab and setActiveTab.
 * 2. Implement the Tabs, List, Trigger, and Content components.
 * 3. Ensure the Trigger component updates the active tab on click.
 * 4. Ensure the Content component only renders its children if its value matches the active tab.
 */

// TODO: Define Context and Provider

export const Tabs = ({
  children,
  defaultValue,
}: {
  children: ReactNode;
  defaultValue: string;
}) => {
  // TODO: Manage state and provide context
  return <div className="tabs-root">{children}</div>;
};

Tabs.List = ({ children }: { children: ReactNode }) => {
  return (
    <div
      className="tabs-list"
      role="tablist"
      style={{ borderBottom: '1px solid #ccc' }}
    >
      {children}
    </div>
  );
};

Tabs.Trigger = ({
  value,
  children,
}: {
  value: string;
  children: ReactNode;
}) => {
  // TODO: Consume context and handle click
  const isActive = false;
  return (
    <button
      role="tab"
      aria-selected={isActive}
      style={{
        padding: '10px 20px',
        border: 'none',
        background: isActive ? '#eee' : 'transparent',
        borderBottom: isActive ? '2px solid blue' : 'none',
      }}
    >
      {children}
    </button>
  );
};

Tabs.Content = ({
  value,
  children,
}: {
  value: string;
  children: ReactNode;
}) => {
  // TODO: Consume context and render conditionally
  return (
    <div role="tabpanel" style={{ padding: '20px' }}>
      {children}
    </div>
  );
};

// DEMO
export default function TabsDemo() {
  return (
    <div style={{ padding: '40px' }}>
      <h1>Compound Tabs</h1>
      <Tabs defaultValue="account">
        <Tabs.List>
          <Tabs.Trigger value="account">Account</Tabs.Trigger>
          <Tabs.Trigger value="password">Password</Tabs.Trigger>
          <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="account">
          <h3>Account Details</h3>
          <p>Update your account information here.</p>
        </Tabs.Content>

        <Tabs.Content value="password">
          <h3>Password Management</h3>
          <p>Change your password or set up 2FA.</p>
        </Tabs.Content>

        <Tabs.Content value="settings">
          <h3>System Settings</h3>
          <p>Configure notifications and theme.</p>
        </Tabs.Content>
      </Tabs>
    </div>
  );
}
