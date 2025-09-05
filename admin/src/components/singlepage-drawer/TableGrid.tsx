import {useQuery, useQueryClient} from "@tanstack/react-query";
import {Table} from 'antd';
import React, {useState} from "react";

import {get} from "~/services/api/api";

export default function TableGrid({columns, dataUrl, queryKey, actions, extractData, ...props}) {
    const queryClient = useQueryClient();
    // console.log({dataUrl});
    const KEY = queryKey ? queryKey : dataUrl;
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    const {isLoading, isError, error, data: fetchData} = useQuery([KEY],  () => get(dataUrl));
    const loopData = extractData ? extractData(fetchData) : fetchData;
    // console.log({loopData});



    return (
        <Table
            rowKey="id" /*TODO should be configurable*/
            loading={isLoading}
            columns={columns}
            dataSource={loopData} />
    );
}
