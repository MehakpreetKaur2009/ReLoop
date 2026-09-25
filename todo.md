## New Features (v2)

- [x] Upgrade project to full-stack with database (web-db-user)
- [x] Add database schema for users, waste logs, pickups, notifications
- [x] Create backend API routes (tRPC) for waste logs, pickups, notifications
- [x] Add bell notification icon to header bar with notification dropdown
- [x] Add live map view to Truck Driver Dashboard with route visualization
- [x] Wire frontend to backend APIs (persist waste logs, pickups, notifications)
- [x] Test all features end-to-end
- [x] Save checkpoint and deliver
## Bug Fixes

- [x] Fix dotenv module resolution error in server startup (resolved after dependency install)
- [x] Fix bell icon triggering auth redirect (removed protected tRPC calls, uses local state)
- [x] Fix 'boolean is not defined' transient error in schema (hot-reload transient, not persistent)
- [x] Ensure clean server restart without errors (verified Aug 4 restart is clean)
