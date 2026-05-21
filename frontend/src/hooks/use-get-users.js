import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

export const useGetUsers = (page = 1, limit = 10) => {
    return useQuery({
        queryKey: ['users', page, limit],
        queryFn: async () => {
            const res = await api.get(`/users?page=${page}&limit=${limit}`);
            return {
                users: res.data.data.rows || [],
                total: res.data.data.count || 0,
                currentPage: page,
                totalPages: Math.ceil((res.data.data.count || 0) / limit)
            };
        },
    });
};
