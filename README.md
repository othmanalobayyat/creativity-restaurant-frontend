# Creativity Restaurant — Frontend

A full-stack mobile restaurant ordering system with real-time stock management and admin control, built as a university project and extended as a portfolio piece.

## Tech Stack

- **React Native** (Expo)
- **React Navigation** — native stack + bottom tabs
- **Context API** — cart state, auth state
- **AsyncStorage** — token, user, and favorites persistence

---

## Features

### Browsing & Menu

- Browse menu items by category with live stock status
- Search items by name
- Product detail view with out-of-stock enforcement (button disabled)

### Cart & Checkout

- Add/remove items, adjust quantities, view running total
- Address entry screen
- Checkout flow with order confirmation and cart auto-clear

### Auth & Profile

- JWT-based login and registration
- Profile management (name, phone, email)
- Saved favorites

### Admin Panel

- Add, edit, and delete products
- Upload product images via backend (no credentials in the app)
- Manage categories

---

## Project Structure

```
src/
  api/           # API calls (apiFetch, adminApi)
  components/    # Reusable UI (ProductCard, CartItem, etc.)
  context/       # CartContext, AuthContext
  navigation/    # Stack and tab navigators
  screens/       # App screens (Home, Cart, Profile, Admin)
  theme/         # Colors, spacing, typography
```

---

## Getting Started

```bash
npm install
npx expo start
```

Create `.env` or edit `src/config/api.js` to set `API_BASE_URL` to your running backend URL.

---

## Notes

- All image uploads go through the backend — no Cloudinary credentials are stored in the app
- Stock is validated both on the UI and server side to prevent invalid orders

---

## Future Improvements

- Improve user feedback with better error messages
- Add order status notifications
- Enhance filtering and search capabilities
- Improve UI consistency and animations
