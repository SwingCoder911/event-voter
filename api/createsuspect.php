<?php
/**
 * Create active contestant to be placed into the bucket
 */

include "classes/db.php";
if(!array_key_exists('name', $_GET)){
    echo("Missing suspect name");
    return;
}
if(!array_key_exists('is_culprit', $_GET)){
    echo("Is this suspect the culprit?");
    return;
}
$name = $_GET['name'];
$isCulprit = $_GET['is_culprit'];
$db = new VoterDB();
$db->createSuspect($name, $isCulprit);
echo(true);