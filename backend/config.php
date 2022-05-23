<?php

// Enable CORS from React 
header("Access-Control-Allow-Origin: *");
// DataBase connection
$db = new PDO('sqlite:./data/main.db');
// Max rows per page
$per_page = 100;
// Default page is 1
$page = $_GET['page'] ?? 1;
