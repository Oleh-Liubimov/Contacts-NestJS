export const calcPaginationData = (count, page, perPage) => {
  const totalPages = Math.ceil(count / perPage);
  const hasNextPage = Boolean(totalPages - page);
  const hasPrevPage = page !== 1;

  return {
    totalPages,
    count,
    page,
    perPage,
    hasNextPage,
    hasPrevPage,
  };
};
