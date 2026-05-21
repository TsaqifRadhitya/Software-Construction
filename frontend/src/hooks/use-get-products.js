import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

export const useGetProducts = (page = 1, limit = 6) => {
    return useQuery({
        queryKey: ['products', page, limit],
        queryFn: async () => {
            const res = await api.get(`/products?page=${page}&limit=${limit}`);
            return {
                products: res.data.data.data || [],
                total: res.data.data.total || 0,
                currentPage: res.data.data.current_page || page,
                totalPages: res.data.data.last_page || Math.ceil((res.data.data.total || 0) / limit)
            };
        },
    });
};
