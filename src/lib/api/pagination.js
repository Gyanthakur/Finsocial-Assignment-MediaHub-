// export const getPaginationParams = (searchParams) => {
//   const page = Math.max(1, parseInt(searchParams.get('page')) || 1);
//   const limit = Math.min(100, parseInt(searchParams.get('limit')) || 20);
  
//   return {
//     page,
//     limit,
//     skip: (page - 1) * limit
//   };
// };

// export const formatPaginatedResponse = (data, totalCount, page, limit) => {
//   const totalPages = Math.ceil(totalCount / limit);
  
//   return {
//     data,
//     pagination: {
//       page,
//       limit,
//       totalCount,
//       totalPages,
//       hasNextPage: page < totalPages,
//       hasPreviousPage: page > 1
//     }
//   };
// };

export const getPaginationParams = (searchParams) => {
  const page = Math.max(1, parseInt(searchParams?.get?.('page') || '1'));
  const limit = Math.min(100, parseInt(searchParams?.get?.('limit') || '20'));
  
  if (isNaN(page) || isNaN(limit)) {
    return { page: 1, limit: 20, skip: 0 };
  }

  return {
    page,
    limit,
    skip: (page - 1) * limit
  };
};

export const formatPaginatedResponse = (data, totalCount, page, limit) => {
  const totalPages = Math.ceil(totalCount / limit);
  
  return {
    data,
    pagination: {
      page,
      limit,
      totalCount,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null
    }
  };
};

export const calculateSkip = (page, limit) => {
  return Math.max(0, (Math.max(1, page) - 1) * limit);
};