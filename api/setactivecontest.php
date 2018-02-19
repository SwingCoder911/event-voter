<?php
/**
 * Set current active contestants
 */
include "classes/db.php";
if(!array_key_exists('contestants', $_GET)){
    echo("Missing contestants");
    return;
}
$contestants = explode(",", $_GET['contestants']);
$db = new VoterDB();
$stamp = $db->setActiveContest($contestants);
echo($stamp);