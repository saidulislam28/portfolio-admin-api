import {lazy, Suspense, useMemo} from 'react'

import useAuth from '~/hooks/useAuth'

const LAYOUT_DEFAULT = 'LAYOUT_DEFAULT';
const layouts = {
    [LAYOUT_DEFAULT]: lazy(() => import('./DefaultLayout')),
}

const Layout = () => {
    const { authenticated } = useAuth();

    // useDirection()
    //
    // useLocale()

    const AppLayout = useMemo(() => {
        if (authenticated) {
            return layouts[LAYOUT_DEFAULT]
        }
        return lazy(() => import('./AuthLayout'))
    }, [authenticated])

    return (
        <Suspense
            fallback={
                <div className="flex flex-auto flex-col h-[100vh]">
                    <p>Loading...</p>
                </div>
            }
        >
            <AppLayout />
        </Suspense>
    )
}

export default Layout
