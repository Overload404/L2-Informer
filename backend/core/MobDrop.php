<?php
class MobDrop
{
    static function get_mobdrop()
    {
        require_once './core/Config.php';
        $npcid = $_GET['npcid'] ?? NULL;

        $query = '';

        $query .= "SELECT DROPLIST.*, NAME 
        FROM DROPLIST 
        INNER JOIN ITEMS ON ITEMS.ITEM_ID = DROPLIST.ITEM_ID 
        WHERE ";

        if (isset($npcid)) {
            $query .= "NPC_ID = $npcid ";
        } else {
            $query .= "1 ";
        }

        $q = $db->query($query);
        $total = 0;
        while ($row = $q->fetch()) {
            $total++;
        }

        __print($total);

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

        return json_encode($result);
    }
}
