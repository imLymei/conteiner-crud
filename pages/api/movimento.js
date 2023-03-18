import { query } from '@/lib/db';

export default async function handler(req, res) {
	let message;

	if (req.method === 'GET') {
		const movimento = await query({ query: 'SELECT * FROM movimento', values: [] });

		res.status(200).json({ moviento: movimento });
	}

	if (req.method === 'POST') {
		const cliente = req.body.cliente;
		const numero = req.body.numero;
		const tipo = req.body.tipo;
		const status = req.body.status;
		const categoria = req.body.categoria;

		const addConteiner = await query({
			query: 'INSERT INTO conteiner (CLIENTE, NUMERO, TIPO, STATUS, CATEGORIA) VALUES (?,?,?,?,?)',
			values: [cliente, numero, tipo, status, categoria],
		});

		if (addConteiner.insertId) {
			message = 'success';
		} else {
			message = 'error';
		}

		let conteiner = {
			ID: addConteiner.insertId,
			CLIENTE: cliente,
			NUMERO: numero,
			TIPO: tipo,
			STATUS: status,
			CATEGORIA: categoria,
		};

		res.status(200).json({ response: { message: message, conteiner: conteiner } });
	}

	if (req.method == 'PUT') {
		const id = req.body.id;
		const cliente = req.body.cliente;
		const numero = req.body.numero;
		const tipo = req.body.tipo;
		const status = req.body.status;
		const categoria = req.body.categoria;

		const updateConteiner = await query({
			query: 'UPDATE conteiner SET CLIENTE = ?, NUMERO = ?, TIPO = ?, STATUS = ?, CATEGORIA = ? WHERE ID = ?',
			values: [cliente, numero, tipo, status, categoria, id],
		});

		const result = updateConteiner.affectedRows;

		if (result) {
			message = 'success';
		} else {
			message = 'error';
		}

		let conteiner = {
			ID: id,
			CLIENTE: cliente,
			NUMERO: numero,
			TIPO: tipo,
			STATUS: status,
			CATEGORIA: categoria,
		};

		res.status(200).json({ response: { message: message, conteiner: conteiner } });
	}

	if ((req.method = 'DELETE')) {
		const id = req.body.id;

		const deleteConteiner = await query({
			query: 'DELETE FROM conteiner WHERE ID = ?',
			values: [id],
		});

		const result = deleteConteiner.affectedRows;

		if (result) {
			message = 'success';
		} else {
			message = 'error';
		}

		res.status(200).json({ response: { message: message, id: id } });
	}
}
