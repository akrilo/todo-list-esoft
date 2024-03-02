<?php
require_once './utils/auth.php';
require_once './utils/createTask.php';
require_once './utils/editTask.php';
require_once './utils/getTask.php';
require_once './utils/getTasks.php';

// Разрешаем CORS (Cross-Origin Resource Sharing) для всех доменов
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Это предварительный (preflight) запрос CORS, возвращаем пустой успешный ответ
    http_response_code(200);
    exit();
}


$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
preg_match("~^/(\w+)(?:/|$)~", $path, $matches);
$endpoint = $matches[1];

// Роутинг
switch ($endpoint) {
    case 'login':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            // Получаем данные из тела запроса
            $data = json_decode(file_get_contents("php://input"), true);
        
            // Проверяем наличие ключей в массиве $data
            if (!empty($data['username']) && !empty($data['password'])) {
                // Поиск пользователя по логину
                $user = login($data['username']);
        
                // Проверяем, был ли найден пользователь
                if ($user === null) {
                    http_response_code(401);
                    echo json_encode(array("success" => false, "message" => "Пользователь с таким логином не существует"));
                    exit();
                }
        
                // Проверка введенного пароля
                if (password_verify($data['password'], $user['password_hash'])) {
                    // Пароль верный, пользователь успешно аутентифицирован
                    http_response_code(200);
                    echo json_encode(array("success" => true, "currentUser" => $user, "message" => "Авторизация успешна"));
                } else {
                    // Пароль неверный, отображаем сообщение об ошибке
                    http_response_code(401);
                    echo json_encode(array("success" => false, "message" => "Пользователь ввел неверный пароль"));
                }
            } else {
                // Если отсутствует ключ 'username' или 'password', возвращаем ошибку 400 (Bad Request)
                http_response_code(400);
                echo json_encode(array("success" => false, "message" => "Отсутствует логин или пароль"));
            }
        } else {
            // Если это не POST запрос, возвращаем ошибку 405 (Method Not Allowed)
            http_response_code(405);
            echo json_encode(array("success" => false, "message" => "Метод не разрешен"));
        }
        break;

    case 'tasks':
        // Это эндпоинт для создания новой задачи
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            // Получаем данные из тела запроса
            $data = json_decode(file_get_contents("php://input"), true);
            
            // Проверяем наличие всех необходимых полей в данных
            if (isset($data['title']) && isset($data['description']) && isset($data['due_date']) && isset($data['priority']) && isset($data['status']) && isset($data['creator_id']) && isset($data['responsible_id'])) {
                    // Проверяем успешность выполнения запроса
                if (createTask($data['title'], $data['description'], $data['due_date'], $data['priority'], $data['status'], $data['creator_id'], $data['responsible_id'])) {
                    // Задача успешно создана
                    http_response_code(201); // Код 201 означает успешное создание ресурса
                    echo json_encode(array("success" => true, "message" => "Задача успешно создана"));
            } else {
                // Возникла ошибка при создании задачи
                http_response_code(500);
                echo json_encode(array("success" => false, "message" => "Ошибка при создании задачи"));
            }
            } else {
                // Если не все поля переданы, возвращаем ошибку
                http_response_code(400);
                echo json_encode(array("success" => false, "message" => "Не все данные для создания задачи переданы"));
            }
        } elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $tasks = getTasks();
            if(isset($tasks)) {
                http_response_code(200);
                echo json_encode(array("success" => true, "tasks" => $tasks));
            } else {
                http_response_code(500);
                echo json_encode(array("success" => false, "message" => "Ошибка при получении задач."));
            }
        } elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
            $data = json_decode(file_get_contents("php://input"), true);

            if (isset($data['title']) && isset($data['description']) && isset($data['due_date']) && isset($data['priority']) && isset($data['status']) && isset($data['responsible_id'])) {
                $task_id = $_GET['id'];
                editTask($data['title'], $data['description'], $data['due_date'], $data['priority'], $data['status'], $data['responsible_id'], $task_id);
                http_response_code(200);
                echo json_encode(array("success" => true, "message" => "Задача успешно создана"));
            } elseif (isset($data['status'])) {
                $task_id = $_GET['id'];
                editTaskStatus($data['status'], $task_id);
                http_response_code(200);
                echo json_encode(array("success" => true, "message" => "Задача успешно создана"));
            } else {
                // Если отсутствует какой-то из обязательных ключей, возвращаем ошибку
                http_response_code(400);
                echo json_encode(array("success" => false, "message" => "Отсутствуют обязательные данные"));
            }
        } else {
            // Если это не PUT запрос, возвращаем ошибку 405 (Method Not Allowed)
            http_response_code(405);
            echo json_encode(array("success" => false, "message" => "Метод не разрешен"));
        }
        break;
    // Добавьте другие эндпоинты API здесь
    default:
        // Если эндпоинт не существует, возвращаем ошибку 404
        http_response_code(404);
        echo json_encode(array("success" => false, "message" => "Endpoint not found"));
        break;
}

?>