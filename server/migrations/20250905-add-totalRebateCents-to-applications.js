// migrations/2025XXXXXX-add-totalRebateCents-to-applications.js
module.exports = {
  up: (q, S) => q.addColumn('applications', 'totalRebateCents', {
    type: S.INTEGER, allowNull: false, defaultValue: 0
  }),
  down: (q) => q.removeColumn('applications', 'totalRebateCents')
};
