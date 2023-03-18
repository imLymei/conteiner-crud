import mysql from 'mysql2/promise';

export async function query({ query, values = [] }) {
	const dbConnection = await mysql.createConnection({
		host: 'localhost',
		port: 8889,
		database: 'porto',
		password: 'root',
		user: 'root',
	});

	try {
		const [results] = await dbConnection.execute(query, values);
		dbConnection.end();
		return results;
	} catch (error) {
		return { error };
	}
}
