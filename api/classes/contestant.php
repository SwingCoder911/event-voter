<?php
class Contestant{
    public $id = "";
    public $partnerA = "";
    public $partnerB = "";
    public $votes = 0;
    public $active = 0;
    public $archived = 0;
    function __construct($data){
        $this->id = array_key_exists('couple_id', $data) ? $data['couple_id'] : '';
        $this->partnerA = array_key_exists('partner_a', $data) ? $data['partner_a'] : '';
        $this->partnerB = array_key_exists('partner_b', $data) ? $data['partner_b'] : '';
        $this->votes = array_key_exists('votes', $data) ? (int)$data['votes'] : 0;
        $this->archived = array_key_exists('archived', $data) ? (int)$data['archived'] : 0;
        $this->active = array_key_exists('active', $data) ? (int)$data['active'] : 0;
    }
}