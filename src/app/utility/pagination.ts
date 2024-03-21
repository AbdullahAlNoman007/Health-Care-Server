type Tpagination = {
    page: string;
    limit: string;
    skip: number;
    orderBy: string;
    orderSort: string;
}

const calculatePagination = (option: Partial<Tpagination>) => {

    const page = Number(option.page) || 1;
    const limit = Number(option.limit) || 10;
    const skip = (page - 1) * limit;

    const orderBy = option.orderBy || "createdAt";
    const orderSort = option.orderSort || 'desc';

    return {
        page,
        limit,
        skip,
        orderBy,
        orderSort
    }

}

export default calculatePagination