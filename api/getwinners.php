<?php
/**
 * Get bucket of all available contestants
 */
include "classes/db.php";
$db = new VoterDB();
$winners = $db->getWinners();
echo(json_encode($winners));