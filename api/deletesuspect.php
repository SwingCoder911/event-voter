<?php
/**
 * Create active contestant to be placed into the bucket
 */

include "classes/db.php";
if(!array_key_exists('suspect_id', $_GET)){
    echo("Missing suspect_id");
    return;
}
$suspectId = $_GET['suspect_id'];
$db = new VoterDB();
$db->deleteSuspect($suspectId);
echo(true);