declare global {
	namespace NodeJS {
		interface ProcessEnv extends CloudflareEnv {
			CLOUDFLARE_ACCOUNT_ID: string;
			CLOUDFLARE_DATABASE_ID: string;
			CLOUDFLARE_D1_TOKEN: string;
		}
	}
}

export {};
