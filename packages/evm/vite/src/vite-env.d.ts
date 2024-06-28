interface ImportMetaEnv {
    readonly VITE_CONTRACT_ADDRESS: string
    readonly VITE_WALLETCONNECT_PROJECT_ID: string
    readonly VITE_UNIQUENESS: "true" | "false"
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}