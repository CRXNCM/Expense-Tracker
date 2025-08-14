# Alert System Usage Guide

## Overview
This alert system provides a reusable, customizable notification component that can be used throughout your React application.

## Components Created
1. **Alert.jsx** - Single alert component with customizable type, title, message
2. **AlertContainer.jsx** - Container for displaying multiple alerts
3. **useAlert.js** - Custom hook for managing alerts globally

## How to Use

### 1. Import the hook and container
```javascript
import { useAlert } from '../hooks/useAlert';
import AlertContainer from '../components/AlertContainer';
```

### 2. Use in your component
```javascript
const MyComponent = () => {
  const { alerts, showAlert, hideAlert } = useAlert();

  const handleSave = async () => {
    try {
      await saveData();
      showAlert('success', 'Success!', 'Data saved successfully.');
    } catch (error) {
      showAlert('error', 'Error!', 'Failed to save data.');
    }
  };

  return (
    <div>
      {/* Your component content */}
      <AlertContainer alerts={alerts} onClose={hideAlert} />
    </div>
  );
};
```

### 3. Alert Types
- **success** - Green checkmark icon
- **error** - Red error icon
- **warning** - Yellow warning icon
- **info** - Blue info icon

### 4. showAlert Parameters
```javascript
showAlert(type, title, message, autoClose, duration)
```
- `type`: 'success' | 'error' | 'warning' | 'info'
- `title`: Alert title text
- `message`: Alert message text
- `autoClose`: boolean (optional, default: false)
- `duration`: number in milliseconds (optional, default: 3000)

### 5. Examples

#### Basic usage
```javascript
showAlert('success', 'Changes saved', 'Your product changes have been saved.');
```

#### Auto-close alert
```javascript
showAlert('info', 'Processing', 'Please wait...', true, 2000);
```

#### Error handling
```javascript
showAlert('error', 'Network Error', 'Unable to connect to server.');
```

## Integration Steps

### Step 1: Add AlertContainer to your main App component
```javascript
// In App.jsx or your main layout component
import { useAlert } from './hooks/useAlert';
import AlertContainer from './components/AlertContainer';

function App() {
  const { alerts, hideAlert } = useAlert();
  
  return (
    <div className="App">
      {/* Your existing routes/components */}
      <AlertContainer alerts={alerts} onClose={hideAlert} />
    </div>
  );
}
```

### Step 2: Use in any child component
```javascript
// In any component
import { useAlert } from '../hooks/useAlert';

const MyForm = () => {
  const { showAlert } = useAlert();
  
  const handleSubmit = () => {
    // Your form logic
    showAlert('success', 'Form submitted', 'Your form has been submitted successfully.');
  };
  
  return <form>{/* form content */}</form>;
};
```

## Styling
The alert uses Tailwind CSS classes and supports dark mode automatically. You can customize the styling by modifying the classes in Alert.jsx.

## Positioning
Alerts appear in the top-right corner of the screen by default. You can adjust the positioning by modifying the AlertContainer.jsx file.
