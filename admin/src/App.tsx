import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { message } from "antd";
import React from "react";
import { Provider } from "react-redux";
import {
HashRouter as Router,
    Route,     Routes,
} from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";

import Layout from '~/layouts/Layouts'
import store, { persistor } from "~/store";

import DefaultLayout from "./layouts/DefaultLayout";
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * (60 * 1000), // 5 mins
            cacheTime: 10 * (60 * 1000),
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
})
function App() {
    const [msg, contextHolder] = message.useMessage();

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Router>
                    <QueryClientProvider client={queryClient} contextSharing={true}>
                        <Layout />
                    </QueryClientProvider>
                </Router >
            </PersistGate>
        </Provider>
    )
    /*return (
        <div >
            {contextHolder}
            <Routes>
                <Route path='*' element={<DefaultLayout/>}/>

                {/!*<Route path="/" element={<Home />} />*!/}
            </Routes>
        </div>
    );*/
}

export default App;
