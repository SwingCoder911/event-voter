<?php
/**
 * Create active contestant to be placed into the bucket
 */

include "classes/db.php";
if(!array_key_exists('detective_id', $_GET)){
    echo("Missing detective_id");
    return;
}
$detectiveId = $_GET['detective_id'];
$db = new VoterDB();
$db->deleteDetective($detectiveId);
echo(true);