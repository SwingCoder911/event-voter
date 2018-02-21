<?php
class Suspect{
    public $id = "";
    public $name = "";
    function __construct($data){
        $this->id = array_key_exists('suspect_id', $data) ? $data['suspect_id'] : '';
        $this->partnerA = array_key_exists('suspect_name', $data) ? $data['suspect_name'] : '';
    }
}