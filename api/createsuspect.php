<?php
/**
 * Create active contestant to be placed into the bucket
 */

include "classes/db.php";
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
$db = new VoterDB();
$db->createContestant($partnerA, $partnerB);
echo(true);