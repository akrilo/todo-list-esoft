<?php
// Параметры подключения к базе данных
$db_host = 'localhost';
$db_name = 'todo_list';
$db_user = 'postgres';
$db_pass = '0000';

// Подключение к базе данных
try {
    $pdo  = new PDO("pgsql:host={$db_host};dbname={$db_name};user={$db_user};password={$db_pass}");
    $pdo ->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die("Ошибка подключения к базе данных: " . $e->getMessage());
}
?>
