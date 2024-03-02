<?php
require_once './config/database.php';

function getTask($taskId) {
    global $pdo ;
    try {
        $stmt = $pdo->prepare("SELECT * FROM tasks WHERE id = ?");
        $stmt->execute([$taskId]);
        $task = $stmt->fetch(PDO::FETCH_ASSOC);
        return $task;
    } catch (PDOException $e) {
        // Обработка ошибок запроса
        die("Ошибка запроса: " . $e->getMessage());
    }
}
?>
