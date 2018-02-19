<?php
/**
 * Set current contest head to head bracket
 */
 include "classes/db.php";
$db = new VoterDB();
$winners = $db->closeActiveContest();
echo(json_encode($winners));