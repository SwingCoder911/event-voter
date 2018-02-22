<?php
class Suspect{
    public $id = "";
    public $name = "";
    public $isCulprit = 0;
    function __construct($data){
        $this->id = array_key_exists('suspect_id', $data) ? $data['suspect_id'] : '';
        $this->name = array_key_exists('name', $data) ? $data['name'] : '';
        $this->isCulprit = array_key_exists('is_culprit', $data) ? intval($data['is_culprit']) : '';
    }
}