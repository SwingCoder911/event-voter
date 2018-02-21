<?php
/**
 * Create active contestant to be placed into the bucket
 */

include "classes/db.php";
if(!array_key_exists('couple_id', $_GET)){
    echo("Missing couple id");
    return;
}
if(!array_key_exists('partner_a', $_GET)){
    echo("Missing partner A");
    return;
}
if(!array_key_exists('partner_b', $_GET)){
    echo("Missing partner B");
    return;
}
$partnerA = $_GET['partner_a'];
$partnerB = $_GET['partner_b'];
$coupleId = $_GET['couple_id'];
$db = new VoterDB();
$db->updateContestant($coupleId, $partnerA, $partnerB);
echo(true);