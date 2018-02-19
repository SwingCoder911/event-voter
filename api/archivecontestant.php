<?php
/**
 * Archive active contestant to be placed into the bucket
 */

include "classes/db.php";
if(!array_key_exists('couple_id', $_GET)){
    echo("Missing couple id");
    return;
}

$coupleId = (int)$_GET['couple_id'];
$db = new VoterDB();
$db->archiveContestant($coupleId);
echo(true);