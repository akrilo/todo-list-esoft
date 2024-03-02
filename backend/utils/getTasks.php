<?php
require_once './config/database.php';

function getTasks() {
    global $pdo ;
    try {
        $stmt = $pdo->query("SELECT * FROM tasks");
        $tasks  = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $tasks;
    } catch (PDOException $e) {
        // Обработка ошибок запроса
        die("Ошибка запроса: " . $e->getMessage());
    }
}
?>
