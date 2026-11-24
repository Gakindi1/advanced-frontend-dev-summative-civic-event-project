# CivicEvents+ Frontend

A responsive civic-events portal built with HTML, Tailwind CSS, custom CSS, and jQuery. It consumes the provided CivicEvents+ Express API and does not modify the backend.

## Features

- Sign up and login with strong-password validation
- Role-aware navigation for normal users and administrators
- Events with search, date/location filters, details, registration, and feedback
- Audio announcements with accessible HTML5 playback
- Video promos with captions/transcript support, plus click-to-play ALU Rwanda YouTube videos
- Notifications inbox, profile management, and administrator user controls
- Admin event, announcement, promo, notification, and user management
- Responsive Figma-style layouts, loading states, empty states, dialogs, and toasts
- Browser-only service requests for the city service UI

## Run locally

1. Configure and start the provided backend according to `backend/README.md`.
2. Serve this folder with any static server, for example:

   ```bash
   cd frontend
   npx serve .
   ```

3. Open the URL printed by the server, such as `http://localhost:3000`.

The page uses Tailwind CSS, jQuery, Google Fonts, and Unsplash assets from CDNs, so internet access is required for those assets. A direct `file://` open is suitable for previewing, but a local server is recommended for API requests.

## Backend connection

The frontend defaults to:

```text
http://localhost:4000
```

Change the address through **Account menu → API connection settings**. The setting is saved in browser `localStorage`.

The backend base URL does not need to be an environment variable; this UI stores it locally. A backend `.env` must still contain the PostgreSQL settings and `JWT_SECRET` documented in `backend/README.md`.

## Authentication storage

Login tokens and user information are stored in `sessionStorage`, so they expire when the browser session ends. They are cleared automatically on logout or an unauthorized/expired API response.

Role-based access guards in [assets/js/app.js](assets/js/app.js) control admin UI visibility. The backend middleware is the authoritative security boundary.

## API behavior

- Live event, announcement, promo, registration, feedback, notification, profile, and dashboard requests are sent to the provided API.
- Published content is filtered in the UI unless the signed-in account is an administrator.
- File uploads use `multipart/form-data` with `image`, `audio`, or `video` field names.
- 401 responses clear the session and open login.
- 403, validation, network, and server errors are shown through readable toast messages.

## Demo preview

The initial screen uses sample Figma reference content. Switch to live content through the account menu after signing in. Preview registrations are stored only in browser `localStorage`.
