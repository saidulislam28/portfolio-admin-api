# E2E Testing with Maestro

This directory contains end-to-end test flows using Maestro.

## Structure

```
e2e/maestro/
├── config.yaml
├── flows/     
│   ├── login.yaml
│   └── registration.yaml
└── README.md
```

## Prerequisites

1. Install Maestro CLI:

   ```bash
   curl -Ls "https://get.maestro.mobile.dev" | bash
   ```
On windows, you need add maestro folder to system PATH   

2. Make sure your app is installed on the device/simulator

## Running Tests

### Local Testing

> [!NOTE]
> You must have your simulator running with the app installed before you can execute these tests

Run a single flow:

```bash
maestro test e2e/maestro/flows/login.yaml
```

Run all flows:

(from the e2e folder)

```
npm run test
```

or,

```bash
maestro test e2e/maestro/flows/
```

Run with config:

```bash
maestro test --config e2e/maestro/config.yaml e2e/maestro/flows/
```

### Environment Variables

Set these before running tests:

- `APP_ID`: Your app's bundle identifier

## Writing Flows

1. Create new `.yaml` files in the `flows/` directory
2. Use accessibility identifiers (testID) from your React Native components
3. Follow the naming convention: `feature-scenario.yaml`

### Common Patterns

```yaml
# Launch app
- launchApp

# Tap by accessibility ID
- tapOn:
    id: 'button-testid'

# Tap by text (it is recommended that you use ID and not Text as we have multi language support)
# If a component doesn't have ID, please add an ID first in the code then target it in the flow
- tapOn:
    text: 'Button Text'

# Input text
- inputText: 'text to type'
- inputText:
    id: 'input-testid'
    text: 'specific text'

# Assertions
- assertVisible:
    text: 'Expected Text'
- assertVisible:
    id: 'element-testid'

# Wait for element
- waitUntilVisible:
    id: 'loading-indicator'
```

## Tips

1. Use testID props in your React Native components for reliable element selection
2. Keep flows focused on specific user journeys
3. Add meaningful assertions to verify expected outcomes
4. Use descriptive names for your flow files
