module.exports = function attachRebateTotalHooks({ Application, ApplicationMeasure }) {
  // Centralized recalc helper (exported for optional manual use/tests)
  async function recalcTotal(applicationId, options = {}) {
    const total =
      (await ApplicationMeasure.sum('lineRebateCents', {
        where: { applicationId },
        transaction: options.transaction,
      })) || 0;

    await Application.update(
      { totalRebateCents: total },
      { where: { id: applicationId }, transaction: options.transaction }
    );

    return total;
  }

  // Single-row hooks cover your normal flows
  const recalcFromInstance = async (instance, options) => {
    if (instance?.applicationId) {
      await recalcTotal(instance.applicationId, options);
    }
  };

  ApplicationMeasure.addHook('afterCreate', recalcFromInstance);
  ApplicationMeasure.addHook('afterUpdate', recalcFromInstance);
  ApplicationMeasure.addHook('afterDestroy', recalcFromInstance);

  return { recalcTotal };
};