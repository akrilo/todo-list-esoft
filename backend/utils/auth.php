<?php
require_once './config/database.php';

function login($username) {
    global $pdo ;
    try {
        $stmt = $pdo->prepare("SELECT * FROM users WHERE login = ?");
        $stmt->execute([$username]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        // Проверяем, был ли найден пользователь
        if ($user === false) {
            return null; // Возвращаем null, если пользователь не найден
        }

        return $user;
    } catch (PDOException $e) {
        // Обработка ошибок запроса
        die("Ошибка запроса: " . $e->getMessage());
    }
}
?>
