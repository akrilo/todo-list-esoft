<?php
require_once './config/database.php';

function createTask($title, $description, $due_date, $priority, $status, $creator_id, $responsible_id) {
    global $pdo ;
    try {
        $stmt = $pdo->prepare("INSERT INTO tasks (title, description, due_date, priority, status, creator_id, responsible_id) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$title, $description, $due_date, $priority, $status, $creator_id, $responsible_id]);
        if ($stmt->rowCount() > 0) {
            return true;
        } else return false;
    } catch (PDOException $e) {
        // Обработка ошибок запроса
        die("Ошибка запроса: " . $e->getMessage());
    }
}
?>
