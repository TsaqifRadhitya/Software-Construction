import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

export const useGetTransactions = (page = 1, limit = 10) => {
    return useQuery({
        queryKey: ['transactions', page, limit],
        queryFn: async () => {
            const res = await api.get(`/transactions?page=${page}&limit=${limit}`);
            return {
                transactions: res.data.data.rows || [],
                total: res.data.data.count || 0,
                currentPage: page,
                totalPages: Math.ceil((res.data.data.count || 0) / limit)
            };
        },
    });
};
