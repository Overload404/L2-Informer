<?php
// Enable CORS from React 
header("Access-Control-Allow-Origin: *");
// DataBase connection
$db = new PDO('sqlite:./data/main.db');
// Include var_dump++
require_once './tools.php';
