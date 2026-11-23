# CivicEvents+ Frontend

This is a responsive HTML frontend styled with Tailwind CSS and custom CSS. jQuery powers navigation, filters, menus, dialogs, and requests to the CivicEvents API.

## Run the frontend

Open `index.html` in a browser, or serve the `frontend` folder with any static web server. The page uses Tailwind CSS, jQuery, and Google Fonts from their CDNs, so an internet connection is required for those assets.

The design preview starts with the sample events and community content shown in the Figma reference. Preview registrations are saved in the browser and are not sent to the backend.

## Connect to the backend

The API defaults to `http://localhost:4000`. Start the backend separately, then use **Account menu → API connection settings** to change the URL if needed. Sign in to load live events, announcements, and promos. Registration, account creation, and event publishing use the existing backend endpoints.

The backend protects event, announcement, and promo reads behind authentication. Create an account or sign in before switching from the design preview to live content.
