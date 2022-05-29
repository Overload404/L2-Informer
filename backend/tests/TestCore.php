<?php

use PHPUnit\Framework\TestCase;

require_once '../core.php';

class TestCore extends TestCase
{
    function test_mobs()
    {
        $url = 'http://l2-informer/backend/mobs';
        $result = file_get_contents($url);
        $response = file_get_contents('./files/test_mobs.json');
        $this->assertEquals($response, $result);
    }

    function test_mobs_page_weakpoint()
    {
        $url = 'http://l2-informer/backend/mobs?page=1&weakpoint=5598';
        $result = file_get_contents($url);
        $response = '{"response":[],"pagination":{"total":0,"lastPage":0,"currentPage":"1","from":0,"to":0}}';
        $this->assertEquals($response, $result);
    }

    function test_mobdrop()
    {
        $url = 'http://l2-informer/backend/mobdrop';
        $result = file_get_contents($url);
        $response = file_get_contents('./files/test_mobdrop.json');
        $this->assertEquals($response, $result);
    }
    function test_mobdrop_npcid_18001()
    {
        $url = 'http://l2-informer/backend/mobdrop?npcid=18001';
        $result = file_get_contents($url);
        $response = file_get_contents('./files/test_mobdrop_npcid_18001.json');
        $this->assertEquals($response, $result);
    }
    function test_items_page_52()
    {
        $url = 'http://l2-informer/backend/items?page=7';
        $result = file_get_contents($url);
        $response = file_get_contents('./files/test_items_page_7.json');
        $this->assertEquals($response, $result);
    }

    function test_mobskills_npcid_18001()
    {
        $url = 'http://l2-informer/backend/mobskills?npcid=18001';
        $result = file_get_contents($url);
        $response = file_get_contents('./files/test_mobskills_npcid_18001.json');
        $this->assertEquals($response, $result);
    }

    function test_mobspawn_npcid_30080()
    {
        $url = 'http://l2-informer/backend/mobspawn?page=1&npcid=30080';
        $result = file_get_contents($url);
        $response = file_get_contents('./files/test_mobspawn_npcid_30080.json');
        $this->assertEquals($response, $result);
    }

    function test_bossspawn_npcid_25372()
    {
        $url = 'http://l2-informer/backend/bossspawn?page=1&npcid=25372';
        $result = file_get_contents($url);
        $response = file_get_contents('./files/test_bossspawn_npcid_25372.json');
        $this->assertEquals($response, $result);
    }
}
