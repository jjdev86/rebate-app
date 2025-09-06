const { addMeasure, updateMeasureQty, removeMeasure, getApplicationWithMeasures } = require('../services/measures');

function toApiTotal(cents) {
  // If you prefer dollars in responses, convert here; keeping cents is safest.
  return { totalRebateCents: cents };
}

exports.postAddMeasure = async (req, res) => {
  try {
    const { id: applicationId } = req.params;
    const { productId, qty } = req.body;
    const { measure, totalRebateCents } = await addMeasure({ applicationId, productId, qty });

    res.status(201).json({
      message: 'Measure added',
      measure,
      ...toApiTotal(totalRebateCents),
    });
  } catch (err) {
    res.status(400).json({ message: err.message || 'Failed to add measure' });
  }
};

exports.putUpdateMeasureQty = async (req, res) => {
  try {
    const { id: applicationId, measureId } = req.params;
    const { qty } = req.body;
    const { measure, totalRebateCents } = await updateMeasureQty({ applicationId, measureId, qty });

    res.json({
      message: 'Measure updated',
      measure,
      ...toApiTotal(totalRebateCents),
    });
  } catch (err) {
    res.status(400).json({ message: err.message || 'Failed to update measure' });
  }
};

exports.deleteMeasure = async (req, res) => {
  try {
    const { id: applicationId, measureId } = req.params;
    const { totalRebateCents } = await removeMeasure({ applicationId, measureId });

    res.json({
      message: 'Measure removed',
      ...toApiTotal(totalRebateCents),
    });
  } catch (err) {
    res.status(400).json({ message: err.message || 'Failed to remove measure' });
  }
};

exports.getApplication = async (req, res) => {
  try {
    const { id: applicationId } = req.params;
    const app = await getApplicationWithMeasures(applicationId);
    res.json(app);
  } catch (err) {
    res.status(404).json({ message: err.message || 'Application not found' });
  }
};
