<?php
class General
{
    static function result_pagination($db, $query)
    {
        $per_page = 100;
        $page = $_GET['page'] ?? 1;

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
        // echo "<h1>$query</h1>";
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

class Mobs
{
    static function get_mobs()
    {
        require_once './config.php';

        $type = $_GET['type'] ?? NULL;
        $weakpoint = $_GET['weakpoint'] ?? NULL;
        $name = $_GET['name'] ?? NULL;

        $query = '';

        $query .= "SELECT * FROM mobsnpcid ";
        if (isset($weakpoint)) {
            $query .= "INNER JOIN npcskills ON mobsnpcid.NPC_ID = npcskills.NPC_ID ";
        } else {
            $query .= "";
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

        return General::result_pagination($db, $query);
    }
}

class MobDrop
{
    static function get_mobdrop()
    {
        require_once './config.php';
        $npcid = $_GET['npcid'] ?? NULL;

        $query = '';

        $query .= "SELECT droplist.*, NAME,ICON 
            FROM droplist 
            INNER JOIN items ON (items.ITEM_ID = droplist.ITEM_ID) 
            WHERE ";

        if (isset($npcid)) {
            $query .= "NPC_ID = $npcid ";
        } else {
            $query .= "1 ";
        }

        return General::result_pagination($db, $query);
    }
}

class Items
{
    static function get_items()
    {
        require_once './config.php';
        $query = '';
        $query .= "SELECT * FROM items ";
        return General::result_pagination($db, $query);
    }
}

class MobSkills
{
    static function get_mob_skills()
    {
        require_once './config.php';
        $npcid = $_GET['npcid'] ?? NULL;

        $query = '';

        $query .= "SELECT npcskills.*, NAME, ICON 
            FROM npcskills INNER JOIN skillnam 
            ON (npcskills.SKILL_ID = skillnam.SKILL_ID 
            AND npcskills.LEVEL = skillnam.LEVEL) WHERE ";

        if (isset($npcid)) {
            $query .= "NPC_ID = $npcid ";
        } else {
            $query .= "1 ";
        }

        return General::result_pagination($db, $query);
    }
}

class MobSpawn
{
    static function get_mob_spawn()
    {
        require_once './config.php';
        $npcid = $_GET['npcid'] ?? NULL;

        $query = '';

        $query .= "SELECT * FROM mobsspawnlist WHERE ";

        if (isset($npcid)) {
            $query .= "mobsspawnlist.NPC_TEMPLA = $npcid ";
        } else {
            $query .= "1 ";
        }

        return General::result_pagination($db, $query);
    }
}
class BossSpawn
{
    static function get_boss_spawn()
    {
        require_once './config.php';
        $npcid = $_GET['npcid'] ?? NULL;

        $query = '';

        $query .= "SELECT * FROM raidspawn WHERE ";

        if (isset($npcid)) {
            $query .= "raidspawn.BOSS_ID = $npcid ";
        } else {
            $query .= "1 ";
        }

        return General::result_pagination($db, $query);
    }
}
