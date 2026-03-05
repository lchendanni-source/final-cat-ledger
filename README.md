# kitty-ledger

A minimal Create React App (CRA) project configured for deployment on Vercel.

## Local dev
```bash
npm install
npm start
```

## Build
```bash
npm run build
```

## Deploy to Vercel
1. Push this repo to GitHub (root contains package.json + vercel.json).
2. In Vercel, import the GitHub repo.
3. Framework: Create React App (auto-detect)
4. Build Command: `npm run build`
5. Output Directory: `build`
