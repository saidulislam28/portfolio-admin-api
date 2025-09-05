import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, message } from 'antd';
import React from 'react'

import { post } from '~/services/api/api';

export default function AdvisorAssignButton({ advisor_id }) {

    const AssignAdvisor = useMutation(async () => await post(`admin/advisor/assign?advisor_id=${advisor_id}`, {}), {//TODO refactor
        onSuccess: (response) => {
            message.success('Assign Successfully');
        },
        onError: (err) => {
            const err_message = err?.response?.data
            message.error(err_message?.message);
        }
    });

    const handleAssign = () => {
        // console.log("from assing button =>>", advisor_id)
        AssignAdvisor.mutate()
    }

    return (
        <Button type="primary" shape="round" size="middle" onClick={handleAssign}>
            Assign
        </Button>
    )
}
