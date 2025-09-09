async function recalcTotal(applicationId) {
  const total = await ApplicationMeasure.sum('lineRebateCents', { where: { applicationId } }) || 0;
  await Application.update({ totalRebateCents: total }, { where: { id: applicationId } });
}