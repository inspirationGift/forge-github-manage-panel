export const getTicketKeyFromBranchName = branchName => {
  if (!branchName || branchName.trim().length === 0) return null;

  const match = branchName.match(
    /^(?:\[([A-Za-z]+-\d+)\]|\(([A-Za-z]+-\d+)\)|([A-Za-z]+-\d+))/
  );
  return match ? match[1] || match[2] || match[3] : null;
};
