<?php

namespace classes;

class MobDrop
{
    static function get_mobdrop()
    {
        require_once './config.php';
        $npcid = $_GET['npcid'] ?? NULL;
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

        if (isset($page)) {
            $a = ($page - 1) * $per_page;
            $b = $per_page;
            $query .= "LIMIT $a, $b";
        }

        $q = $db->query($query);
        $response = [];
        while ($row = $q->fetch()) {
            $response[] = $row;
        }

        $from = ($total > 0) ? $a + 1  : 0;
        $to = ($a + $per_page < $total) ? $a + $per_page : $total;

        if ($a + $per_page)
            $result = [
                'response' => $response,
                'pagination' => [
                    'total' => $total,
                    'lastPage' => ceil($total / $per_page),
                    'currentPage' => $page,
                    'from' => $from,
                    'to' => $to,
                ],
            ];

        $result = json_encode($result);
        return 111;
    }
}
