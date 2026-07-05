# Frontend Restructure Summary

## What changed

- Reorganized route screens into `frontend/src/pages/*` by feature:
  - `pages/home`
  - `pages/auth`
  - `pages/inventory`
  - `pages/users`
  - `pages/shop`
  - `pages/admin/AdminDashboard`
- Added `frontend/src/app/AppRoutes.js` so route definitions are separated from `App.js`.
- Added a backend API layer under `frontend/src/api`:
  - `httpClient.js` configures the shared Axios client.
  - `inventoryApi.js` maps to the Spring inventory endpoints.
  - `usersApi.js` maps to the Spring user endpoints.
  - `authApi.js` maps to the Spring login endpoint.
- Added shared configuration and utilities:
  - `shared/constants/apiConfig.js` stores the API base URL and endpoint paths.
  - `shared/utils/formatters.js` stores reusable formatting helpers.
- Updated frontend pages to call the new API services instead of repeating `http://localhost:8080` in each component.
- Moved page-owned CSS files beside their pages:
  - `pages/inventory/UpdateItem.css`
  - `pages/shop/Shop.css`
  - `pages/admin/AdminDashboard/AdminDashboard.css`
- Removed duplicate `frontend/src/components/*` wrapper files after routes were updated to import directly from `pages`.
- Removed unused Create React App starter files: `App.css`, `logo.svg`, and `reportWebVitals.js`.
- Replaced the default starter test with a router smoke test for the real home route.
- Added clean primary routes and kept legacy redirects for older URLs.

## Backend alignment

The frontend API layer now matches the current Spring Boot controllers:

- `GET /inventory`
- `POST /inventory`
- `GET /inventory/{id}`
- `PUT /inventory/{id}`
- `DELETE /inventory/{id}`
- `POST /inventory/itemImg`
- `GET /uploads/{filename}`
- `POST /user`
- `GET /users`
- `GET /user/{id}`
- `PUT /user/{id}`
- `DELETE /user/{id}`
- `POST /login`

Login sends Spring Security compatible form data:

```text
Content-Type: application/x-www-form-urlencoded
username=<email>&password=<password>
```

This matches `SecurityConfig.loginProcessingUrl("/login")`.

## Routes

Primary routes:

- `/`
- `/shop`
- `/signin`
- `/signup`
- `/profile`
- `/profile/edit/:id`
- `/inventory`
- `/inventory/new`
- `/inventory/:id/edit`
- `/admin`
- `/admin/dashboard`
- `/admin/profile`
- `/admin/users`

Legacy redirects kept for compatibility:

- `/login` -> `/signin`
- `/register` -> `/signup`
- `/userProfile` -> `/profile`
- `/updateUser/:id` -> `/profile/edit/:id`
- `/displayUsers` -> `/admin/users`
- `/additem` -> `/inventory/new`
- `/allItems` -> `/inventory`
- `/updateItem/:id` -> `/inventory/:id/edit`

## New structure

```text
frontend/src
  api/
  app/
  pages/
    admin/
    auth/
    home/
    inventory/
    shop/
    users/
  shared/
    constants/
    utils/
```

## Configuration

The frontend uses `REACT_APP_API_BASE_URL` when available. If it is not set, it falls back to:

```text
http://localhost:8080
```

To point the frontend at another backend later, create a frontend `.env` file:

```text
REACT_APP_API_BASE_URL=http://your-backend-host:8080
```

## Maintenance notes

- Put new route-level screens in `pages/<feature>`.
- Put reusable backend requests in `api/`.
- Put reusable constants and pure helpers in `shared/`.
- Create `components/` again only when there are genuinely reusable UI components used across multiple pages.
- Prefer changing endpoint paths in `shared/constants/apiConfig.js` instead of editing individual pages.
