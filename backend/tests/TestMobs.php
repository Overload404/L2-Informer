<?php

use PHPUnit\Framework\TestCase;

require_once '../classes/Mobs.php';

class TestMobs extends TestCase
{
    function test_page_weakpoint()
    {
        $url = 'http://l2-informer/backend/mobs?page=1&weakpoint=5598';
        $result = file_get_contents($url);
        $response = '{"response":[],"pagination":{"total":0,"lastPage":0,"currentPage":"1","from":0,"to":0}}';
        $this->assertEquals($response, $result);
    }
    function test_mobs()
    {
        $url = 'http://l2-informer/backend/mobs';
        $result = file_get_contents($url);
        $response = file_get_contents('./files/test_mobs.json');
        $this->assertEquals($response, $result);
    }
}
