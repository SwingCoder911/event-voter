<?php
/**
 * Get bucket of all available contestants
 */
include "classes/db.php";

if(!array_key_exists('name', $_GET)){
    echo("Missing name");
    return;
}
$db = new VoterDB();
$detectives = $db->getDetectives();
$newVoter = 'true';
$inputName = strtolower(trim(preg_replace('/\s{2,}/i', ' ', $_GET['name'])));
foreach($detectives as $detective){
    if(strtolower($detective->name) == $inputName){
        $newVoter = 'false';
    }
}
echo($newVoter);