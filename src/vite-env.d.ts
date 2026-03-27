/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Optional: e.g. http://localhost:3001 — call API directly when Vite proxy is not used */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
