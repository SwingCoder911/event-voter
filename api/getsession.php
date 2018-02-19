<?php
/**
 * Set current active contestants
 */
include "classes/db.php";
$db = new VoterDB();
$stamp = $db->getStamp($contestants);
echo($stamp);