<?php
/**
 * Get bucket of all available contestants
 */
include "classes/db.php";
$db = new VoterDB();
$availableSuspects = $db->getSuspects();
echo(json_encode($availableSuspects));