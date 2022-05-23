<?php

require_once '../classes/MobDrop.php';

use PHPUnit\Framework\TestCase;

class TestMobDrop extends TestCase
{
    function test_mobdrop()
    {
        $url = 'http://l2-informer/backend/mobdrop';
        $result = file_get_contents($url);
        $response = file_get_contents('./files/test_mobdrop.json');
        $this->assertEquals($response, $result);
    }
}
