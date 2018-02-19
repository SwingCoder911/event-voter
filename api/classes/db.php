<?php
require_once("config.php");
require_once("contestant.php");
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
	public function getContestants(){
		$sql = "SELECT * FROM bracket_voter where archived=0;";
		$contestants = array();
		$result = $this->conn->query($sql);
		if ($result->num_rows > 0) {
		    // output data of each row
		    while($row = $result->fetch_assoc()) {
		    	array_push($contestants, new Contestant($row));
		    }
		} 
		return $contestants;	
	}

	/**
	 * Get all pieces
	 * 
	 */
	public function getActiveContestants(){
		$sql = "SELECT * FROM bracket_voter where active=1 and archived=0;";
		$contestants = array();
		$result = $this->conn->query($sql);
		if ($result->num_rows > 0) {
		    // output data of each row
		    while($row = $result->fetch_assoc()) {
		    	array_push($contestants, new Contestant($row));
		    }
		} 
		return $contestants;	
	}
	/**
	 * Get all pieces
	 * 
	 */
	public function getAvailableContestants(){
		$sql = "SELECT * FROM bracket_voter where archived=0;";
		$contestants = array();
		$result = $this->conn->query($sql);
		if ($result->num_rows > 0) {
		    // output data of each row
		    while($row = $result->fetch_assoc()) {
		    	array_push($contestants, new Contestant($row));
		    }
		} 
		return $contestants;	
	}
	public function createContestant($partnerA, $partnerB){
		$sql = "insert into bracket_voter (partner_a, partner_b, votes, active, archived) values ('%s', '%s', 0, 0, 0);";
		$sql = vsprintf($sql, array($partnerA, $partnerB));
		$result = $this->conn->query($sql);
	}
	
	public function updateContestant($coupleId, $partnerA, $partnerB){
		$sql = "update bracket_voter set partner_a='%s', partner_b='%s' where couple_id=%d;";
		$sql = vsprintf($sql, array($partnerA, $partnerB, $coupleId));
		$result = $this->conn->query($sql);
	}

	public function archiveContestant($coupleId){
		$sql = "update bracket_voter set archived=1 where couple_id=%d;";
		$sql = vsprintf($sql, array($coupleId));
		$result = $this->conn->query($sql);
	}

	public function setActiveContest($contestants){
		$sql = "update bracket_voter set active=1 where couple_id in (%s);";
		$sql = vsprintf($sql, array(implode(",", $contestants)));
		$result = $this->conn->query($sql);
		$stampSql = "update bracket_session set stamp='%s' where session_id=1;";
		$stampSql = vsprintf($stampSql, array(time()));
		$result = $this->conn->query($stampSql);
	}

	public function castVote($coupleId){
		$sql = "update bracket_voter set votes=votes+1 where couple_id=%d;";
		$sql = vsprintf($sql, array($coupleId));
		$result = $this->conn->query($sql);
		$stampSql = "SELECT * FROM bracket_session where session_id=1;";
		$result = $this->conn->query($stampSql);
		$row = $result->fetch_assoc();
		return $row['stamp'];	
	}
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
				$currWinner = new Contestant($row);
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
		//Set all contestants to inactive
		$activeSql = "update bracket_voter set active=0, votes=0 where active=1;";
		$result = $this->conn->query($activeSql);
		//Return winners
		return $winners;
	}
}
?>