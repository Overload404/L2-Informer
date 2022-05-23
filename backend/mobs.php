<?php

require_once __DIR__ . './config.php';
require_once __DIR__ . './tools.php';

$per_page = 100;
$page = $_GET['page'] ?? 1;
$type = $_GET['type'] ?? NULL;
$weakpoint = $_GET['weakpoint'] ?? NULL;
$name = $_GET['name'] ?? NULL;

$query = '';

$query .= "SELECT * FROM mobsnpcid ";
if (isset($weakpoint)) {
    $query .= "INNER JOIN npcskills ON mobsnpcid.NPC_ID = npcskills.NPC_ID ";
}

$query .= "WHERE ";

if (isset($type)) {
    $query .= "TYPE IN ($type) ";
} else {
    $query .= "1 ";
}

if (isset($name)) {
    $query .= "AND NPC_NAME LIKE \"%$name%\" ";
}

if (isset($weakpoint)) {
    $query .= "AND SKILL_ID = $weakpoint ";
}


$q = $db->query($query);
$total = 0;
while ($row = $q->fetch()) {
    $total++;
}
// __print($total);


if (isset($page)) {
    $a = ($page - 1) * $per_page;
    $b = $per_page;
    $query .= "LIMIT $a, $b";
}

// __print($query);

$q = $db->query($query);
$response = [];
while ($row = $q->fetch()) {
    $response[] = $row;
}

$result = [
    'response' => $response,
    'pagination' => [
        'total' => $total,
        'lastPage' => ceil($total / $per_page),
        'currentPage' => $page,
        'from' => $a + 1,
        'to' => $a + $per_page,
    ],
];

$result = json_encode($result);
echo $result;

// $result = json_decode($result);
// foreach ($result->response as $value) {
//     __print($value);
// }
// __print($result->pagination);
