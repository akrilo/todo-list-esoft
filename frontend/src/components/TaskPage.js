import React, { useState } from 'react';
import Modal from 'react-modal';
import { useLocation } from 'react-router-dom';
import TaskList from './TaskList';
import axios from 'axios';


const TaskPage = () => {
    const location = useLocation();
    const currentUser = location.state.currentUser;

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState('');
    const [status, setStatus] = useState('');
    const [responsibleId, setResponsibleId] = useState('');

    const openModal = () => {
        setModalIsOpen(true);
    }

    const closeModal = () => {
        setModalIsOpen(false);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {  
            let formData = {
                title,
                description,
                due_date: dueDate,
                priority,
                status,
                creator_id: currentUser.id,
            };

            if (currentUser.is_leader === true) {
                formData = {
                    ...formData,
                    responsible_id: responsibleId,
                };
            }

            const response = await axios.post('http://localhost:8000/tasks', formData);
            if (response.data.success) {
                setTitle('');
                setDescription('');
                setDueDate('');
                setPriority('');
                setStatus('');
                setResponsibleId('');
            } else {
                console.error('Ошибка при создании задачи:', response.data.message);
            }
        } catch (error) {
            console.error('Error creating task:', error);
            // Обработка ошибки при создании задачи
        }
    };

    return (
        <div className='taskPage-container'>
            <h1>Список задач</h1>
            <button onClick={openModal}>Новая задача</button>
            <TaskList />
            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className='Modal'>
                <h2>Создание новой задачи</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Заголовок:</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div>
                        <label>Описание:</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                    </div>
                    <div>
                        <label>Дата окончания:</label>
                        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                    </div>
                    <div>
                        <label>Приоритет:</label>
                        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                            <option value="высокий">Высокий</option>
                            <option value="средний">Средний</option>
                            <option value="низкий">Низкий</option>
                        </select>
                    </div>
                    <div>
                        <label>Статус:</label>
                        <select value={status} onChange={(e) => setStatus(e.target.value)}>
                                <option value="к выполнению">К выполнению</option>
                                <option value="выполняется">Выполняется</option>
                                <option value="выполнена">Выполнена</option>
                                <option value="отменена">Отменена</option>
                        </select>
                    </div>
                    <div>
                        <label>Идентификатор ответственного:</label>
                        <input type="text" value={responsibleId} onChange={(e) => setResponsibleId(e.target.value)} />
                    </div>
                    <button type="submit">Создать</button>
                </form>
            </Modal>
        </div>
    );
}

export default TaskPage;
