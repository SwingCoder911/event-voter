<?php
/**
 * Create active contestant to be placed into the bucket
 */

include "classes/db.php";
if(!array_key_exists('detective_id', $_GET)){
    echo("Missing detective id");
    return;
}
if(!array_key_exists('name', $_GET)){
    echo("Missing suspect name");
    return;
}
$name = $_GET['name'];
$db = new VoterDB();
$db->updateDetective($detectiveId, $name);
echo(true);