import { useEffect, useState } from 'react'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import Tabla from '../components/Tabla'
import Modal from '../components/Modal'
import Logo from '../assets/img/logo.png'

const Form = () => {

    const [ notas, setNotas ] = useState([])
    const [ notaEdit, setNotaEdit ] = useState({
        id : '',
        studentName : '',
        subject : '',
        score : '',
    });

    const [message , setMessage] = useState('')

    const [ openModal, setOpenModal ] = useState(false)
    const [ openModalDelete, setOpenModalDelete ] = useState(false)
    const [ openModalNew, setOpenModalNew ] = useState(false)


    useEffect(() => {
        fetch()
    },[])

    const fetch = () => {
        axios.get('grade/index',{},{
        })
        .then(response => setNotas((notas) => response.data ))
        .catch(error => console.error(error.response.data.error))
    }

    const update = () => {
        axios.post('grade/update/' + notaEdit.id,{
            studentName : notaEdit.studentName,
            subject : notaEdit.subject,
            score : notaEdit.score
        })
        .then(response =>{
            setMessage(response.data)
            fetch()
            resetData()
        })
        .catch(error => {
            console.error(error.response.data)
        })
    }

    const store = () => {
        axios.post('grade/store',{
            studentName : notaEdit.studentName,
            subject : notaEdit.subject,
            score : notaEdit.score
        })
        .then(response =>{
            setMessage(response.data)
            fetch()
            resetData()
        })
        .catch(error => {
            console.error(error.response.data)
        })
    }

    const destroy = () => {
        axios.post('grade/destroy/'+ notaEdit.id)
        .then(response =>{
            setMessage(response.data)
            fetch()
            resetData()
        })
        .catch(error => {
            console.error(error.response.data)
        })
    }

    const editNota = (item) => {
        setOpenModal(true)
        setNotaEdit(item)

    }

    const deleteNota = (item) => {
        setOpenModalDelete(true)
        setNotaEdit(item)
    }

    const resetData = () => {
        setNotaEdit({})
        setOpenModal(false)
        setOpenModalDelete(false)
        setOpenModalNew(false)
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target
        setNotaEdit({
          ...notaEdit,
          [name]: value,
        })
      }

    useEffect(() => {
        console.log(notaEdit);
    }, [notaEdit]);


    return (
        <div>
            <div className='flex items-center justify-center h-screen'>
                <div className='container mx-auto p-8 border'>
                <img src={Logo} alt="Muniguate" className='mx-auto' />
                    <div className='flex justify-center items-center'>
                        <h1 className='text-4xl text-center'>CRUD DE NOTAS</h1>
                        <hr className='my-5' />
                        <Tabla thead={
                            <tr>
                                <th>ID</th>
                                <th>ESTUDIANTE</th>
                                <th>MATERIA</th>
                                <th className='text-center'>PUNTEO</th>
                                <th width='100px' ></th>
                            </tr>
                        } 
                        tbody={
                            notas.map((nota,index) => (
                                <tr key={nota.id}>
                                    <td>{nota.id}</td>
                                    <td>{nota.studentName}</td>
                                    <td>{nota.subject}</td>
                                    <td className='text-center'>{nota.score}</td>
                                    <td>
                                        <div className='flex gap-2'>
                                            <Icon onClick={() => editNota(nota)} icon='fa-regular  fa-edit' className='text-green-500 hover:scale-125 cursor-pointer' />
                                            <Icon onClick={() => deleteNota(nota)} icon='fa-regular  fa-trash-can' className='text-red-500 hover:scale-125 cursor-pointer'/>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        }
                        />
                    </div>
                    <div className='flex justify-center'>
                        <button onClick={() => setOpenModalNew(true) } className='btn-primary border px-3 py-2 rounded-full' icon='fa-solid fa-xmark'>
                            <div className='flex items-center gap-1'>
                                <Icon icon="fa-solid fa-plus"/>
                                Nuevo registro
                            </div>
                        </button>
                    </div>
                    <div className='flex justify-center text-green-500 font-bold text-2xl'>
                        {
                            message.length > 0 ? 
                            <div>
                                {message}
                            </div>
                            : null
                        }
                    </div>
                </div>
            </div>
            <div>
                {   openModalNew
                    ? 
                        <Modal>
                                <div className='p-5'>
                                    <header>
                                        <div className='flex items-center text-3xl text-blue-500 gap-2'>
                                            <Icon icon="fa-solid fa-edit"/>
                                            <h1 className='font-semibold text-center'>Editar registro</h1>
                                        </div>
                                    </header>
                                    <hr className='my-3' />
                                    
                                    <div className='grid grid-cols-2 gap-4'>
                                    <input name="id" value={notaEdit.id} onChange={handleInputChange} className='input' type="text" hidden />
                                        <label>
                                            <span className='font-bold text-gray-500 text-xl'>Nombre estudiante: </span>
                                            <input name="studentName" value={notaEdit.studentName} onChange={handleInputChange} className='input' type="text" />
                                        </label>
                                        <label>
                                            <span className='font-bold text-gray-500 text-xl'>Materia: </span>
                                            <input name="subject" value={notaEdit.subject} onChange={handleInputChange} className='input' type="text" />
                                        </label>
                                        <label className=' col-span-2'>
                                            <span className='font-bold text-gray-500 text-xl'>Punteo: </span>
                                            <input name="score" value={notaEdit.score} onChange={handleInputChange} className='input' type="text" />
                                        </label>
                                    </div>
                                    <hr className='my-4' />
                                    <footer className='flex justify-between'>
                                        <button onClick={() => resetData() } className='btn-danger border shadow-red-800 px-3 py-2 rounded-full' icon='fa-solid fa-xmark'>
                                            <div className='flex items-center gap-1'>
                                                <Icon icon="fa-solid fa-xmark"/>
                                                Cancelar
                                            </div>
                                        </button>
                                        <button onClick={() => store() } className='btn-primary border shadow-blue-800 px-3 py-2 rounded-full' icon='fa-solid fa-xmark'>
                                            <div className='flex items-center gap-1'>
                                                <Icon icon="fa-solid fa-plus"/>
                                                Crear
                                            </div>
                                        </button>
                    
                                    </footer>
                                </div>
                        </Modal>
                    :
                    null
                }
            </div>
            <div>
                {   openModal 
                    ? 
                        <Modal>
                                <div className='p-5'>
                                    <header>
                                        <div className='flex items-center text-3xl text-blue-500 gap-2'>
                                            <Icon icon="fa-solid fa-edit"/>
                                            <h1 className='font-semibold text-center'>Editar registro</h1>
                                        </div>
                                    </header>
                                    <hr className='my-3' />
                                    
                                    <div className='grid grid-cols-2 gap-4'>
                                    <input name="id" value={notaEdit.id} onChange={handleInputChange} className='input' type="text" hidden />
                                        <label>
                                            <span className='font-bold text-gray-500 text-xl'>Nombre estudiante: </span>
                                            <input name="studentName" value={notaEdit.studentName} onChange={handleInputChange} className='input' type="text" />
                                        </label>
                                        <label>
                                            <span className='font-bold text-gray-500 text-xl'>Materia: </span>
                                            <input name="subject" value={notaEdit.subject} onChange={handleInputChange} className='input' type="text" />
                                        </label>
                                        <label className=' col-span-2'>
                                            <span className='font-bold text-gray-500 text-xl'>Punteo: </span>
                                            <input name="score" value={notaEdit.score} onChange={handleInputChange} className='input' type="text" />
                                        </label>
                                    </div>
                                    <hr className='my-4' />
                                    <footer className='flex justify-between'>
                                        <button onClick={() => resetData() } className='btn-danger border shadow-red-800 px-3 py-2 rounded-full' icon='fa-solid fa-xmark'>
                                            <div className='flex items-center gap-1'>
                                                <Icon icon="fa-solid fa-xmark"/>
                                                Cancelar
                                            </div>
                                        </button>
                                        <button onClick={() => update() } className='btn-primary border shadow-blue-800 px-3 py-2 rounded-full' icon='fa-solid fa-xmark'>
                                            <div className='flex items-center gap-1'>
                                                <Icon icon="fa-solid fa-save"/>
                                                Guardar
                                            </div>
                                        </button>
                    
                                    </footer>
                                </div>
                        </Modal>
                    :
                    null
                }
            </div>
            <div>
                {   openModalDelete 
                    ? 
                        <Modal>
                                <div className='p-5'>
                                    <header>
                                        <div className='flex items-center text-xl text-blue-500 gap-2'>
                                            <Icon icon="fa-solid fa-xmark"/>
                                            <h1 className='font-semibold text-center'> A T E N C I O N</h1>
                                        </div>
                                    </header>
                                    <hr className='my-3' />
                                    
                                    <div className='flex items-center'>
                                        <Icon icon="fa-solid fa-triangle-exclamation" className='text-5xl text-orange-500' />
                                        <h1 className='text-2xl font-semibold text-gray-500'>¿ Esta seguro de eliminar el registro ?</h1>
                                    </div>
                                    <hr className='my-4' />
                                    <footer className='flex justify-between'>
                                        <button onClick={() => resetData() } className='btn-danger border shadow-red-800 px-3 py-2 rounded-full' icon='fa-solid fa-xmark'>
                                            <div className='flex items-center gap-1'>
                                                <Icon icon="fa-solid fa-xmark"/>
                                                Cancelar
                                            </div>
                                        </button>
                                        <button onClick={() => destroy() } className='btn-primary border shadow-blue-800 px-3 py-2 rounded-full' icon='fa-solid fa-xmark'>
                                            <div className='flex items-center gap-1'>
                                                <Icon icon="fa-solid fa-trash"/>
                                                Si eliminar
                                            </div>
                                        </button>
                    
                                    </footer>
                                </div>
                        </Modal>
                    :
                    null
                }
            </div>
        </div>
    )

}
export default Form