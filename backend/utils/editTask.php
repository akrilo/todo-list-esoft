<?php
require_once './config/database.php';

function editTask($title, $description, $due_date, $priority, $status, $responsible_id, $task_id) {
    global $pdo ;
    try {
        $stmt = $pdo->prepare("UPDATE tasks SET title = ?, description = ?, due_date = ?, priority = ?, status = ?, responsible_id = ? WHERE id = ?");
        $stmt->execute([$title, $description, $due_date, $priority, $status, $responsible_id, $task_id]);
    } catch (PDOException $e) {
        // Обработка ошибок запроса
        die("Ошибка запроса: " . $e->getMessage());
    }
}

function editTaskStatus( $status, $task_id) {
    global $pdo ;
    try {
        $stmt = $pdo->prepare("UPDATE tasks SET status = ? WHERE id = ?");
        $stmt->execute([$status, $task_id]);
    } catch (PDOException $e) {
        // Обработка ошибок запроса
        die("Ошибка запроса: " . $e->getMessage());
    }
}
?>
