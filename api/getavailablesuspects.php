<?php
/**
 * Get bucket of all available contestants
 */
include "classes/db.php";
$db = new VoterDB();
$availableContestants = $db->getAvailableContestants();
echo(json_encode($availableContestants));