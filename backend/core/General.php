<?php

class General
{

    static function result_page()
    {
        require_once '../config.php';
        return 'result_page()';
    }
}

echo General::result_page();
