<?php
/**
 * Get bucket of all available contestants
 */
include "classes/db.php";
$db = new VoterDB();
$detectives = $db->getDetectives();
echo(json_encode($detectives));