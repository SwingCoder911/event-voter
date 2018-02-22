<?php
/**
 * Create active contestant to be placed into the bucket
 */

include "classes/db.php";
if(!array_key_exists('suspect_id', $_GET)){
    echo("Missing suspect id");
    return;
}
if(!array_key_exists('name', $_GET)){
    echo("Missing suspect name");
    return;
}
if(!array_key_exists('is_culprit', $_GET)){
    echo("Is this culprit a suspect?");
    return;
}
$suspectId = $_GET['suspect_id'];
$name = $_GET['name'];
$isCulprit = $_GET['is_culprit'];
$db = new VoterDB();
$db->updateSuspect($suspectId, $name, $isCulprit);
echo(true);