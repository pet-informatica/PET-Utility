/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Activity', {
		Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
    // Nome do evento
		Name: {
			type: DataTypes.STRING,
			allowNull: false
		},
    // Data de inicio do evento
    Start: {
			type: DataTypes.STRING,
			allowNull: false
		},
    // Data de termino do evento
    End: {
			type: DataTypes.STRING,
			allowNull: false
		},
    // Quantidade de participantes do evento
		Participants: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
    // Feedback positivo
		Positive: {
			type: DataTypes.STRING,
			allowNull: true
		},
    // Feedback negativo
		Negative: {
			type: DataTypes.STRING,
			allowNull: true
		},
    // Comentarios no geral
		Comments: {
			type: DataTypes.STRING,
			allowNull: true
		}
	}, {
		tableName: 'Activity',
		timestamps: false
	});
};
