export const getInsurances = (insurances) => {
  if (!insurances || !insurances?.length) return [];

  const insList = [...insurances].map((ins) => ({
    label: ins.name,
    value: ins.id,
  }));

  insList.unshift({ label: 'None', value: null });

  return insList;
};
