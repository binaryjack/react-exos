# Challenge 9: Compound Component Tabs (Senior - TSX)

## Goal
Implement a flexible and accessible Tab system using the Compound Component pattern and Context API.

## Requirements
1. **API Design**: The user should be able to use the tabs like this:
   ```tsx
   <Tabs defaultValue="tab1">
     <Tabs.List>
       <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
       <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
     </Tabs.List>
     <Tabs.Content value="tab1">Content 1</Tabs.Content>
     <Tabs.Content value="tab2">Content 2</Tabs.Content>
   </Tabs>
   ```
2. **State Sharing**: Use `React.createContext` to share the active tab value between the parent `Tabs` and children.
3. **Accessibility**: Implement basic ARIA roles (`tablist`, `tab`, `tabpanel`) and handle the `aria-selected` state.
4. **Active State**: The currently active tab should be visually distinct.

## Constraints
- Use TypeScript for type safety of the context and component props.
- Do not use external UI libraries.
- The `Tabs` component should be a container that exposes its sub-components as static properties.

## Why Compound Components?
This pattern provides a highly declarative and flexible API, allowing developers to customize the layout and structure of the components without passing dozens of props to a single parent.
