# Preorder Manager

A Next.js frontend application using Redux Toolkit Query for preorder management.

## Prerequisites

- Node.js 20+ installed
- npm available
- A backend API running and reachable at `http://localhost:5000/api/v1`

> This repository is the frontend app only. The backend and database must be started separately.

## Install and run locally

```bash
cd e:/assign/preorder-manager
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Build for production

```bash
npm run build
npm run start
```

## Backend / Database setup

The frontend calls the API base URL defined in `app/components/config/index.ts`:

```ts
const config = {
  baseUrl: "http://localhost:5000/api/v1",
};

export default config;
```

If your backend runs on a different port or URL, update that file.

### Sample backend API requirements

The app expects these endpoints:

- `GET /preorder` - list preorders
- `GET /preorder/:id` - get single preorder
- `POST /preorder/create` - create a preorder
- `PUT /preorder/:id` - update a preorder
- `DELETE /preorder/:id` - delete a preorder

### Sample data payload

Use this sample JSON to seed a preorder if your backend supports seeding:

```json
{
  "name": "Sample preorder",
  "products": 2,
  "preorderWhen": "regardless-of-stock",
  "startsAt": "2026-07-01T00:00:00.000Z",
  "endsAt": "2026-12-31T23:59:59.000Z",
  "status": true
}
```

## Redux and data flow

This app uses Redux Toolkit Query for remote data fetching, not local reducers.

- `app/redux/baseApi.ts` defines the shared RTK Query API base.
- `app/redux/features/preorder/preorder.api.ts` defines the preorder endpoints.
- `app/redux/store.ts` configures the Redux store with `baseApi.reducer` and middleware.
- `app/providers.tsx` wraps the app with `react-redux` provider.

### Main hooks

- `useGetAllPreordersQuery` - fetch list of preorders
- `useGetSinglePreorderQuery` - fetch one preorder by ID
- `useCreatePreorderMutation` - create a preorder
- `useUpdatePreorderMutation` - update a preorder
- `useDeletePreorderMutation` - delete a preorder

## CRUD workflow

### Read

- `app/page.tsx` loads the list of preorders using `useGetAllPreordersQuery`.
- The table shows each record and exposes edit/delete actions.

### Create

- Click the Create button to open the preorder form.
- Submit the form to call `useCreatePreorderMutation`.

### Update

- Click the edit button for a row to navigate to `/preorder/[id]`.
- The form fetches the preorder with `useGetSinglePreorderQuery`.
- Submit the form to call `useUpdatePreorderMutation`.

### Delete

- Use the delete action in the list page.
- The app calls `useDeletePreorderMutation`.

## Notes

- If the backend is not available, the frontend will fail to fetch data.
- Update `app/components/config/index.ts` if your backend API URL changes.
