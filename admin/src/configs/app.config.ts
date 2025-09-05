export type AppConfig = {
    apiPrefix: string
    authenticatedEntryPath: string
    unAuthenticatedEntryPath: string
    resetPasswordPath: string
    tourPath: string
    locale: string
    enableMock: boolean
}

const appConfig: AppConfig = {
    apiPrefix: '/api',
    authenticatedEntryPath: '/',
    unAuthenticatedEntryPath: '/sign-in',
    resetPasswordPath: '/reset-password',
    tourPath: '/app/account/kyc-form',
    locale: 'en',
    enableMock: false,
}

export default appConfig
