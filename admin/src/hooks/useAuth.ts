import { useNavigate } from 'react-router-dom'

import type { SignInCredential, SignUpCredential } from '~/@types/auth'
import appConfig from '~/configs/app.config'
import { REDIRECT_URL_KEY } from '~/constants/app.constant'
import { apiSignIn, apiSignOut, apiSignUp } from '~/services/AuthService'
import {
    setUser,
    signInSuccess,
    signOutSuccess,
    useAppDispatch,
    useAppSelector,
} from '~/store'

import useQuery from './useQuery'

type Status = 'success' | 'failed'

function useAuth() {
    const dispatch = useAppDispatch()

    const navigate = useNavigate()

    const query = useQuery()

    const { token, signedIn } = useAppSelector((state) => {
        return state.auth.session
    })

    const signIn = async (
        values: SignInCredential
    ): Promise<
        | {
            status: Status
            message: string
        }
        | undefined
    > => {
        try {
            const resp = await apiSignIn(values)
            if (resp.data && resp.data.data) {
                const data = resp.data.data;
                const { access_token } = data;
                dispatch(signInSuccess(access_token))
                dispatch(
                    setUser(
                        {
                            avatar: '',
                            userName: `${data.first_name} ${data.last_name}`,
                            // authority: [ADMIN, USER],
                            email: data.email,
                        }
                    )
                )
                const redirectUrl = query.get(REDIRECT_URL_KEY)
                navigate(
                    redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath
                )
                return {
                    status: 'success',
                    message: '',
                }
            }
            // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        } catch (errors: any) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            }
        }
    }

    const signUp = async (values: SignUpCredential) => {
        try {
            const resp = await apiSignUp(values)
            if (resp.data) {
                const { token } = resp.data
                dispatch(signInSuccess(token))
                if (resp.data.user) {
                    dispatch(
                        setUser(
                            resp.data.user || {
                                avatar: '',
                                userName: 'Anonymous',
                                // authority: [ADMIN, USER],
                                email: '',
                            }
                        )
                    )
                }
                const redirectUrl = query.get(REDIRECT_URL_KEY)
                navigate(
                    redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath
                )
                return {
                    status: 'success',
                    message: '',
                }
            }
            // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        } catch (errors: any) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            }
        }
    }

    const handleSignOut = () => {
        dispatch(signOutSuccess())
        dispatch(
            setUser({
                avatar: '',
                userName: '',
                email: '',
                authority: [],
            })
        )
        navigate(appConfig.unAuthenticatedEntryPath)
    }

    const signOut = async () => {
        /*await apiSignOut()*/
        handleSignOut()
    }

    return {
        authenticated: token && signedIn,
        signIn,
        signUp,
        signOut,
    }
}

export default useAuth
