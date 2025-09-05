export interface SmPackageConfig {
    baseUrl: string;
    tokenProvider?: () => Promise<string | null | undefined>;
}
export declare function initApiClients(initconfig: SmPackageConfig): void;
export declare function getApiClient(): any;
