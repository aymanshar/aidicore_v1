# Local Preview Fix

If the app opens as a blank page on `localhost`, the most common reason is missing Firebase environment variables.

V1.0.1 includes a demo-safe mode:

- The UI no longer crashes without Firebase config.
- You can login with any email/password locally.
- Any email containing `admin` becomes a demo admin account, e.g. `admin@aidicore.local`.
- Demo impact records are stored in browser localStorage.

For production, create `.env.local` from `.env.example` and add your Firebase Web App config.
