<?php
/**
 * Cast vote for winner choice
 */
 include "classes/db.php";
if(!array_key_exists('couple_id', $_GET)){
    echo("Missing couple id");
    return;
}
$coupleId = $_GET['couple_id'];
$db = new VoterDB();
$stamp = $db->castVote($coupleId);
echo($stamp);