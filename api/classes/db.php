<?php
require_once("config.php");
require_once("suspect.php");
require_once("detective.php");
date_default_timezone_set ('America/Los_Angeles');
class VoterDB{
	public $servername = SERVERNAME;
	public $username = USERNAME;
	public $password = PASSWORD;
	public $dbname = DBNAME;
	private $conn = null;
	private $err = false;
	function __construct(){
		$this->conn = new mysqli($this->servername, $this->username, $this->password, $this->dbname);
		if ($this->conn->connect_error) {
			$this->err = $this->conn->connect_error;
 			die("Connection failed: " . $this->conn->connect_error);
		}
	}

	/**
	 * Get all pieces
	 * 
	 */
	public function getSuspects(){
		$sql = "SELECT * FROM event_suspects;";
		$suspects = array();
		$result = $this->conn->query($sql);
		if ($result->num_rows > 0) {
		    // output data of each row
		    while($row = $result->fetch_assoc()) {
		    	array_push($suspects, new Suspect($row));
		    }
		} 
		return $suspects;	
	}

	public function getWinners(){
		$sql = "SELECT * FROM event_detectives inner join event_suspects on event_detectives.suspect_id = event_suspects.suspect_id and event_suspects.is_culprit = 1;";
		$suspects = array();
		$result = $this->conn->query($sql);
		if ($result->num_rows > 0) {
		    // output data of each row
		    while($row = $result->fetch_assoc()) {
		    	array_push($suspects, new Detective($row));
		    }
		} 
		return $suspects;	
	}
	public function createSuspect($name, $isCulprit){
		$sql = "insert into event_suspects (name, is_culprit) values ('%s', %d);";
		$sql = vsprintf($sql, array($name, $isCulprit));
		$result = $this->conn->query($sql);
	}

	public function deleteSuspect($suspect_id){
		$sql = "delete from event_suspects where suspect_id=%d";
		$sql = vsprintf($sql, array($suspect_id));
		$result = $this->conn->query($sql);
	}	
	
	/**
	 * Need to check here if updating culprit
	 */
	public function updateSuspect($suspectId, $name, $isCulprit){
		$sql = "update event_suspects set name='%s', is_culprit=%d where suspect_id=%d;";
		$sql = vsprintf($sql, array($name, $isCulprit, $suspectId));
		$result = $this->conn->query($sql);
	}

	public function setActiveContest($suspects){
		$sql = "update bracket_voter set active=1 where couple_id in (%s);";
		$sql = vsprintf($sql, array(implode(",", $suspects)));
		$result = $this->conn->query($sql);
		$stampSql = "update bracket_session set stamp='%s' where session_id=1;";
		$stampSql = vsprintf($stampSql, array(time()));
		$result = $this->conn->query($stampSql);
	}

	public function castVote($name, $suspectId){
		$sql = "insert into event_detectives (name, suspect_id) values ('%s', %d);";
		$sql = vsprintf($sql, array($name, $suspectId));
		$result = $this->conn->query($sql);	
	}
	/**
	 * TODO: Figure out a way to turn contest on/off
	 */
	public function getStamp(){
		$stampSql = "SELECT * FROM bracket_session where session_id=1;";
		$result = $this->conn->query($stampSql);
		$row = $result->fetch_assoc();
		return $row['stamp'];
	}
	public function closeActiveContest(){
		//Get all active competitors
		$winnerSql = "select * from bracket_voter where active=1 and archived=0 order by votes desc;";
		$winners = array();
		$losers = array();
		$result = $this->conn->query($winnerSql);
		if ($result->num_rows > 0) {
		    // output data of each row
		    while($row = $result->fetch_assoc()) {
				$currWinner = new Suspect($row);
				if(count($winners) == 0 || $currWinner->votes == $winners[0]->votes){
					array_push($winners, $currWinner);
				}else{
					array_push($winners, $currWinner);
					array_push($losers, $currWinner->id);
				}
		    }
		}
		//Archive losers
		$archiveSql = "update bracket_voter set archived=1, active=0 where active=1 and couple_id in (%s);";
		$archiveSql = vsprintf($archiveSql, array(implode(",", $losers)));
		$result = $this->conn->query($archiveSql);
		//Set all suspects to inactive
		$activeSql = "update bracket_voter set active=0, votes=0 where active=1;";
		$result = $this->conn->query($activeSql);
		//Return winners
		return $winners;
	}
}
?>