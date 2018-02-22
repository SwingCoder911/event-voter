<?php
/**
 * Cast vote for winner choice
 */
 include "classes/db.php";
if(!array_key_exists('name', $_GET)){
    echo("Missing voter name");
    return;
}
if(!array_key_exists('suspect_id', $_GET)){
    echo("Missing suspect_id");
    return;
}
$name = $_GET['name'];
$suspectId = $_GET['suspect_id'];
$db = new VoterDB();
$db->castVote($name, $suspectId);
echo(1);