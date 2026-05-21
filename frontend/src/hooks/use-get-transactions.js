import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

export const useGetTransactions = () => {
    return useQuery({
        queryKey: ['transactions'],
        queryFn: async () => {
            const res = await api.get('/transactions');
            return res.data.data.rows || [];
        },
    });
};
