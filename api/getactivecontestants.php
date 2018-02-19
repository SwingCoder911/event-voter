<?php
/**
 * Get current contest with contestants
 */
include "classes/db.php";
$db = new VoterDB();
$activeContestants = $db->getActiveContestants();
echo(json_encode($activeContestants));