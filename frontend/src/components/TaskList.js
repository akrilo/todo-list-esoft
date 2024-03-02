import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { useLocation } from 'react-router-dom';

const TaskList = () => {    
    const location = useLocation();
    const currentUser = location.state.currentUser;

    const [tasks, setTasks] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [groupBy, setGroupBy] = useState('none');
    const [selectedTask, setSelectedTask] = useState(null);

    useEffect(() => {
        // Функция для загрузки списка задач при монтировании компонента
        const fetchTasks = async () => {
            try {
                const response = await axios.get('http://localhost:8000/tasks');
                setTasks(response.data.tasks);
            } catch (error) {
                console.error('Ошибка при загрузке задач:', error.message);
            }
        };
        fetchTasks(); // Вызываем функцию загрузки задач
    }, []);

    const handleTaskClick = (task) => {
        setSelectedTask(task);
        openModal();
    };

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = {
                title: selectedTask.title,
                description: selectedTask.description,
                due_date: selectedTask.due_date,
                priority: selectedTask.priority,
                status: selectedTask.status,
                responsible_id: selectedTask.responsible_id,
            };

            if (selectedTask.creator_id === currentUser.id) {
                const response = await axios.put(`http://localhost:8000/tasks?id=${selectedTask.id}`, formData);
                if (response.data.success) {
                    closeModal();
                    alert('Задача успешно отредактирована');
                } else {
                    console.error('Ошибка при редактировании задачи:', response.data.message);
                }
            } else {
                const statusFormData = {
                    status: formData.status 
                };
                const response = await axios.put(`http://localhost:8000/tasks?id=${selectedTask.id}`, statusFormData);
                if (response.data.success) {
                    closeModal();
                    alert('Статус задачи успешно отредактирован');
                } else {
                    console.error('Ошибка при редактировании статуса задачи:', response.data.message);
                }
            }
        } catch (error) {
            console.error('Ошибка при редактировании задачи:', error);
        }
    };

    // Функция для определения цвета заголовка в зависимости от статуса задачи и даты завершения
    const getHeaderColor = (task) => {
        const today = new Date();
        const dueDate = new Date(task.due_date);
        if (task.status === 'completed') {
            return 'green'; // Зеленый цвет для завершенных задач
        } else if (dueDate < today) {
            return 'red'; // Красный цвет для просроченных задач
        } else {
            return 'grey'; // Серый цвет для остальных задач
        }
    };

    // Функция для сортировки задач по дате завершения
    const sortByDueDate = (taskA, taskB) => {
        const dateA = new Date(taskA.due_date);
        const dateB = new Date(taskB.due_date);
        return dateA - dateB;
    };

    // Функция для группировки задач по дате завершения
    const groupTasksByDueDate = () => {
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);

        const userTasks = tasks.filter(task => task.responsible_id === currentUser.id);

        const todayTasks = userTasks.filter((task) => new Date(task.due_date) <= today);
        const nextWeekTasks = userTasks.filter((task) => new Date(task.due_date) > today && new Date(task.due_date) <= nextWeek);
        const futureTasks = userTasks.filter((task) => new Date(task.due_date) > nextWeek);
        return { today: todayTasks, nextWeek: nextWeekTasks, future: futureTasks };
    };

     // Функция для группировки задач по ответственным
    const groupTasksByResponsible = () => {
        const groupedTasks = {};
        if(currentUser.is_leader === true){
            tasks.forEach((task) => {
                if (!groupedTasks[task.responsible_id]) {
                    groupedTasks[task.responsible_id] = [];
                }
                groupedTasks[task.responsible_id].push(task);
            });
        }
        return groupedTasks;
    };

    
    // Функция для отображения задач в зависимости от выбранной группировки
    const renderTasks = () => {
        switch (groupBy) {
            case 'today':
            case 'nextWeek':
            case 'future':
                const groupedTasks = groupTasksByDueDate();
                return groupedTasks[groupBy].map((task) => (
                    <div className='task' key={task.id} onClick={() => handleTaskClick(task)}>
                        <h3 style={{ color: getHeaderColor(task) }}>{task.title}</h3>
                        <p>Приоритет: {task.priority}</p>
                        <p>Дата окончания: {task.due_date}</p>
                        <p>Ответственный: {task.responsible_id}</p>
                        <p>Статус: {task.status}</p>
                    </div>
                ));
            case 'responsible':
                const groupedTasksByResponsible = groupTasksByResponsible();
                return Object.keys(groupedTasksByResponsible).map((responsible_id) => (
                    <div key={responsible_id}>
                        <h3>{responsible_id}</h3>
                        {groupedTasksByResponsible[responsible_id].map((task) => (
                            <div className='task' key={task.id} onClick={() => handleTaskClick(task)}>
                                <h3 style={{ color: getHeaderColor(task) }} >{task.title}</h3>
                                <p>Приоритет: {task.priority}</p>
                                <p>Дата окончания: {task.due_date}</p>
                                <p>Ответственный: {task.responsible_id}</p>
                                <p>Статус: {task.status}</p>
                            </div>
                        ))}
                    </div>
                ));
            default:
                if (tasks) {
                    return tasks.sort(sortByDueDate).map((task) => (
                        <div className='task' key={task.id} onClick={() => handleTaskClick(task)}>
                            <h3 style={{ color: getHeaderColor(task) }}>{task.title}</h3>
                            <p>Приоритет: {task.priority}</p>
                            <p>Дата окончания: {task.due_date}</p>
                            <p>Ответственный: {task.responsible_id}</p>
                            <p>Статус: {task.status}</p>
                        </div>
                    ));
                } else {
                    return null;
                }
        }
    };
    

    return (
        <div className='taskList-container'>
            <div>
                <label>Группировка:</label>
                <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)}>
                    <option value="none">Без группировки</option>
                    <option value="today">На сегодня</option>
                    <option value="nextWeek">На неделю</option>
                    <option value="future">На будущее</option>
                    <option value="responsible">По ответственным</option>
                </select>
            </div>
            {renderTasks()}
            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className='Modal'>
                <h2>Редактирование задачи</h2>
                <form onSubmit={handleEditSubmit}>
                    {selectedTask && (
                        <>
                            {/* Форма для редактирования задачи */}
                            <div>
                                <label>Заголовок:</label>
                                <input type="text" value={selectedTask.title} onChange={(e) => setSelectedTask({ ...selectedTask, title: e.target.value })} />
                            </div>
                            <div>
                                <label>Описание:</label>
                                <textarea value={selectedTask.description} onChange={(e) => setSelectedTask({ ...selectedTask, description: e.target.value })}></textarea>
                            </div>
                            <div>
                                <label>Дата окончания:</label>
                                <input type="date" value={selectedTask.due_date} onChange={(e) => setSelectedTask({ ...selectedTask, due_date: e.target.value })} />
                            </div>
                            <div>
                                <label>Приоритет:</label>
                                <select value={selectedTask.priority} onChange={(e) => setSelectedTask({ ...selectedTask, priority: e.target.value })}>
                                    <option value="высокий">Высокий</option>
                                    <option value="средний">Средний</option>
                                    <option value="низкий">Низкий</option>
                                </select>
                            </div>
                            <div>
                                <label>Статус:</label>
                                <select value={selectedTask.status} onChange={(e) => setSelectedTask({ ...selectedTask, status: e.target.value })}>
                                    <option value="к выполнению">К выполнению</option>
                                    <option value="выполняется">Выполняется</option>
                                    <option value="выполнена">Выполнена</option>
                                    <option value="отменена">Отменена</option>
                                </select>
                            </div>
                            <div>
                                <label>Идентификатор ответственного:</label>
                                <input type="text" value={selectedTask.responsible_id} onChange={(e) => setSelectedTask({ ...selectedTask, responsible_id: e.target.value })} />
                            </div>
                            <button type="submit">Сохранить</button>
                            <button onClick={closeModal}>Отмена</button>
                        </>
                    )}
                </form>
            </Modal>
        </div>
    );
    
};

export default TaskList;
