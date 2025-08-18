const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const Application = require('./Application');

class ApplicationFile extends Model {}

ApplicationFile.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    applicationId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'applications', key: 'id' },
    },
    // S3 object key (bucket/path/filename.ext)
    s3Key:     { type: DataTypes.STRING, allowNull: false },
    // Public or signed URL you store after upload
    url:       { type: DataTypes.TEXT,   allowNull: false },
    filename:  { type: DataTypes.STRING, allowNull: false },
    mimeType:  { type: DataTypes.STRING, allowNull: true  },
    sizeBytes: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
  },
  {
    sequelize,
    modelName: 'ApplicationFile',
    tableName: 'application_files',
    timestamps: true,
    indexes: [{ fields: ['applicationId'] }],
  }
);

// Associations
ApplicationFile.belongsTo(Application, { foreignKey: 'applicationId' });
Application.hasMany(ApplicationFile,   { foreignKey: 'applicationId', as: 'files' });

module.exports = ApplicationFile;
