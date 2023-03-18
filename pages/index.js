import { useRef, useState, useEffect } from 'react';

export default function Home() {
	const clienteToCreate = useRef();
	const numeroToCreate = useRef();
	const tipoToCreate = useRef();
	const statusToCreate = useRef();
	const categoriaToCreate = useRef();

	const idToUpdate = useRef();
	const clienteToUpdate = useRef();
	const numeroToUpdate = useRef();
	const tipoToUpdate = useRef();
	const statusToUpdate = useRef();
	const categoriaToUpdate = useRef();

	const idToDelete = useRef();

	const [conteiners, setConteiners] = useState([]);

	const [created, setCreated] = useState(false);
	const [updated, setUpdated] = useState(false);
	const [deleted, setDeleted] = useState(false);

	async function getAll() {
		const getData = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		};

		const response = await fetch('http://localhost:3000/api/conteiners', getData);
		const responseJson = await response.json();

		setConteiners(responseJson.conteiners);
	}

	function validation(cliente, numero, tipo, status, categoria) {
		let check = true;
		const letters = [
			'A',
			'B',
			'C',
			'D',
			'E',
			'F',
			'G',
			'H',
			'I',
			'J',
			'K',
			'L',
			'M',
			'N',
			'O',
			'P',
			'Q',
			'R',
			'S',
			'T',
			'U',
			'V',
			'W',
			'X',
			'Y',
			'Z',
		];

		if (cliente.length < 3) {
			check = false;
		}

		if (numero.length != 11) {
			check = false;
		}
		let found = 0;

		//AAAA1234567

		const numeroSplit = numero.split('');
		for (let letterNumero = 0; letterNumero < 4; letterNumero++) {
			for (let letter = 0; letter < letters.length; letter++) {
				if (numeroSplit[letterNumero] == letters[letter]) {
					found++;
				}
			}
		}

		if (found != 4) {
			check = false;
		}

		let numberNumero = '';
		for (let numero = 4; numero < numeroSplit.length; numero++) {
			numberNumero += numero;
		}

		try {
			numberNumero = parseInt(numberNumero);
		} catch (error) {
			check = false;
		}
		if (tipo != 20 && tipo != 40) {
			check = false;
		}
		if (status != 0 && status != 1) {
			check = false;
		}
		if (categoria != 0 && categoria != 1) {
			check = false;
		}

		return check;
	}

	async function addConteiner() {
		const cliente = clienteToCreate.current.value.trim();
		const numero = numeroToCreate.current.value.trim();
		const tipo = tipoToCreate.current.value.trim();
		const status = statusToCreate.current.value.trim();
		const categoria = categoriaToCreate.current.value.trim();

		clienteToCreate.current.value = '';
		numeroToCreate.current.value = '';
		tipoToCreate.current.value = '';
		statusToCreate.current.value = '';
		categoriaToCreate.current.value = '';

		const postData = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				cliente: cliente,
				numero: numero,
				tipo: tipo,
				status: status,
				categoria: categoria,
			}),
		};

		if (!validation(cliente, numero, tipo, status, categoria)) return;

		const response = await fetch('http://localhost:3000/api/conteiners', postData);
		const responseJson = await response.json();

		if (responseJson.response.message != 'success') {
			return;
		}

		setCreated(true);

		const newConteiner = responseJson.response.conteiner;
		setConteiners([
			...conteiners,
			{
				ID: newConteiner.ID,
				CLIENTE: newConteiner.CLIENTE,
				NUMERO: newConteiner.NUMERO,
				TIPO: newConteiner.TIPO,
				STATUS: newConteiner.STATUS,
				CATEGORIA: newConteiner.CATEGORIA,
			},
		]);
	}

	async function updateContainer() {
		const id = idToUpdate.current.value.trim();
		const cliente = clienteToUpdate.current.value.trim();
		const numero = numeroToUpdate.current.value.trim();
		const tipo = tipoToUpdate.current.value.trim();
		const status = statusToUpdate.current.value.trim();
		const categoria = categoriaToUpdate.current.value.trim();

		idToUpdate.current.value = '';
		clienteToUpdate.current.value = '';
		numeroToUpdate.current.value = '';
		tipoToUpdate.current.value = '';
		statusToUpdate.current.value = '';
		categoriaToUpdate.current.value = '';

		if (!validation(cliente, numero, tipo, status, categoria)) return;

		if (id.length == 0) return;

		const updateData = {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				id: id,
				cliente: cliente,
				numero: numero,
				tipo: tipo,
				status: status,
				categoria: categoria,
			}),
		};

		const response = await fetch('http://localhost:3000/api/conteiners', updateData);
		const responseJson = await response.json();

		if (responseJson.response.message != 'success') {
			return;
		}

		setUpdated(true);

		getAll();
	}

	async function deleteContainer() {
		const conteinerId = idToDelete.current.value.trim();
		if (conteinerId.length == 0) return;

		idToDelete.current.value = '';

		const deleteData = {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				id: conteinerId,
			}),
		};

		const response = await fetch('http://localhost:3000/api/conteiners', deleteData);
		const responseJson = await response.json();

		if (responseJson.response.message != 'success') {
			return;
		}

		setDeleted(true);

		getAll();
	}

	useEffect(() => {
		getAll();
	}, []);

	return (
		<main className='w-full h-full p-6 flex flex-col bg-black text-white items-center'>
			<h1 className='text-4xl overflow-hidden'>Crud de contêiner</h1>
			<div className='m-6 p-4 border border-white flex flex-col w-[50%] gap-2'>
				<h2 className='text-2xl text-center'>Contêiners</h2>
				{conteiners.map((conteiner) => {
					return (
						<div key={conteiner.ID} className='border border-white p-4 flex gap-2 justify-center'>
							<h3>[Cliente: {conteiner.CLIENTE}]</h3>
							<h3>[Número: {conteiner.NUMERO}]</h3>
							<h3>[Tipo :{conteiner.TIPO}]</h3>
							<h3>[Status: {conteiner.STATUS}]</h3>
							<h3>[Categoria: {conteiner.CATEGORIA}]</h3>
							<h3>{conteiner.ID}</h3>
						</div>
					);
				})}
			</div>
			<form className='m-6 p-4 border border-white flex flex-col w-[50%] gap-2'>
				<h2 className='text-2xl text-center'>Criar Contêiner</h2>
				<h3>Cliente:</h3>
				<input type='text' className='p-2 text-black' placeholder='Exemplo.lta' ref={clienteToCreate} />
				<h3>Número:</h3>
				<input type='text' className='p-2 text-black' placeholder='Ex. TEST1234567' ref={numeroToCreate} />
				<h3>Tipo:</h3>
				<input type='text' className='p-2 text-black' placeholder='20/40' ref={tipoToCreate} />
				<h3>Status:</h3>
				<input
					type='text'
					className='p-2 text-black'
					placeholder='Cheio = 1/Vazio = 0'
					ref={statusToCreate}
				/>
				<h3>Categoria:</h3>
				<input
					type='text'
					className='p-2 text-black'
					placeholder='Importação = 0/Exportação = 1'
					ref={categoriaToCreate}
				/>
				<button type='button' className='p-4 border border-white hover:bg-white/10' onClick={addConteiner}>
					Criar
				</button>
				{created ? <h4 className='text-green-500 text-center'>SUCESSO!</h4> : null}
			</form>
			<form className='m-6 p-4 border border-white flex flex-col w-[50%] gap-2'>
				<h2 className='text-2xl text-center'>Atualizar Contêiner</h2>
				<h3>ID:</h3>
				<input type='text' className='p-2 text-black' placeholder='1' ref={idToUpdate} />
				<h3>Cliente:</h3>
				<input type='text' className='p-2 text-black' placeholder='Exemplo.lta' ref={clienteToUpdate} />
				<h3>Número:</h3>
				<input type='text' className='p-2 text-black' placeholder='Ex. TEST1234567' ref={numeroToUpdate} />
				<h3>Tipo:</h3>
				<input type='text' className='p-2 text-black' placeholder='20/40' ref={tipoToUpdate} />
				<h3>Status:</h3>
				<input
					type='text'
					className='p-2 text-black'
					placeholder='Cheio = 1/Vazio = 0'
					ref={statusToUpdate}
				/>
				<h3>Categoria:</h3>
				<input
					type='text'
					className='p-2 text-black'
					placeholder='Importação = 0/Exportação = 1'
					ref={categoriaToUpdate}
				/>
				<button type='button' className='p-4 border border-white hover:bg-white/10' onClick={updateContainer}>
					Atualizar
				</button>
				{updated ? <h4 className='text-green-500 text-center'>SUCESSO!</h4> : null}
			</form>
			<form className='m-6 p-4 border border-white flex flex-col w-[50%] gap-2'>
				<h2 className='text-2xl text-center'>Deletar Contêiner</h2>
				<h3>ID:</h3>
				<input type='text' className='p-2 text-black' placeholder='1' ref={idToDelete} />
				<button
					type='button'
					className='p-4 border border-red-400 hover:bg-red-600/80 bg-red-600'
					onClick={deleteContainer}>
					DELETAR
				</button>
				{deleted ? <h4 className='text-green-500 text-center'>SUCESSO!</h4> : null}
			</form>
		</main>
	);
}
