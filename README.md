# DevOS Desktop

DevOS Desktop is an Electron shell for the DevOS Web application. It does not
execute terminal commands, access project files, or implement Runtime features.
Those privileged capabilities stay in the standalone `devos-runtime` service.

## Prerequisites

- Node.js 20+
- DevOS Web at `DEVOS_WEB_URL` (default: `http://localhost:3000`)
- Optional DevOS Runtime at `DEVOS_RUNTIME_URL` (default: `http://127.0.0.1:3180`)

## Setup

```bash
copy .env.example .env
npm install
npm run build
npm start
```

`npm run package` creates a Windows installer after the native build toolchain
is available. This repository intentionally has no Runtime token: the Web app
authenticates privileged Runtime requests.
