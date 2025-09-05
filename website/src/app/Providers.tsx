"use client";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CartProvider } from "react-use-cart";
import { reduxStore } from "../redux/store";

const Providers = ({ children }: any) => {
    const queryClient = new QueryClient();

    return (
        <Provider store={reduxStore}>
            <QueryClientProvider client={queryClient}>
                <SessionProvider>
                    <CartProvider>
                        <Main> {children}</Main>
                        <ToastContainer
                        hideProgressBar
                        autoClose={1000}
                        />
                    </CartProvider>
                </SessionProvider>
            </QueryClientProvider>
        </Provider>
    );
};

const Main = ({ settingData, children }: any) => {
    // const value = useSelector((state) => state.common);
    // const dispatch = useDispatch();
    //
    // useEffect(() => {
    //     if (!value?.home) {
    //         dispatch(setValue({ key: "home", value: settingData }));
    //     }
    // }, []);

    return <>{children}</>;
};

export default Providers;
