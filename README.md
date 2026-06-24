# Grocery Budget App

Expo + React Native frontend for scanning grocery receipts and planning cart estimates against a backend API.

## Run locally

```bash
npm install
npm run start
```

## Screens

- **Scanner**: uses `expo-camera` and submits receipt photos to `POST /api/receipts/scan`.
- **Planner**: lets users pick a store, adjust item quantities, and request estimates from `POST /api/planner/estimate`.