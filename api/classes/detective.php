<?php
class Detective{
    public $id = "";
    public $name = "";
    public $suspectId = null;
    function __construct($data){
        $this->id = array_key_exists('detective_id', $data) ? $data['detective_id'] : '';
        $this->name = array_key_exists('name', $data) ? $data['name'] : '';
        $this->suspectId = array_key_exists('suspect_id', $data) ? $data['suspect_id'] : '';
    }
}