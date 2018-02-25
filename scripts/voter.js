let app = angular.module('VoterApp', []);
app.controller('VoterController', ['$scope', '$http', function($scope, $http){
    this.VotedSuspect = null;
    this.Detective = {
        Name: "",
        SuspectId: null,
        Message: false
    };
    this.Suspects = [];
    this.Loaded = false;
    this.Pending = false;
    this.AlreadyVoted = false;
    /**
     * Dom events
     */
    this.onVoteClicked = ($event, suspect) => {
        $('.vote-modal').modal('show');
        console.log(suspect);
        this.VotedSuspect = suspect;
        this.Detective.SuspectId = suspect.id;
    };
    this.onVoteConfirmClicked = ($event) => {
        if(this.Pending){
            return;
        }
        this.CheckDetective()
            .then((result) => {
                this.CastVote()
                    .then((stamp) => {
                        $('.vote-modal').modal('hide');
                        this.VotedSuspect = null;
                        this.AlreadyVoted = true;
                        $scope.$apply();
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            })
            .catch((error) => {
                this.Detective.Message = error;
                $scope.$apply();
            });
        
    };
    this.onVoteCancelClicked = ($event) => {
        $('.vote-modal').modal('hide');
        this.VotedSuspect = null;
        this.ClearDetective();
    };
    this.CheckDetective = () => {
        return new Promise((resolve, reject) => {
            $http.get(`api/checkname.php?name=${this.Detective.Name}`)
                .then((result) => {
                    if(result.data === 'true'){
                        resolve(true);
                    }else{
                        reject("We're sorry but you've already guessed! Thanks for playing!");
                    }
                },
                (error) => {
                    //TODO: HANDLE ERROR
                    console.log(error);
                    reject(error);
                });
        });
    };
    /**
     * Class methods
     */
    this.ClearDetective = () => {
        this.Detective.Name = "";
        this.Detective.SuspectId = null;
        this.Detective.Message = false;
    };
    this.LoadSuspects = () => {
        this.Loaded = false;
        $http.get(`api/getsuspects.php`)
            .then((results) => {               
                if(!results.hasOwnProperty('data')){
                    console.log("Error in data");
                    return;
                }
                console.log(results.data);
                this.Suspects = results.data;
                this.Loaded = true;
            },
            (error) => {
                //TODO: HANDLE ERROR
                console.log(error);
            });
    };

    this.CastVote = () => {
        this.Pending = true;
        return new Promise((resolve, reject) => {
            $http.get(`api/vote.php?name=${this.Detective.Name}&suspect_id=${this.Detective.SuspectId}`)
                .then((result) => {
                    this.Pending = false;
                    ///localStorage.setItem('voted', stamp);
                    resolve(result.data);
                },
                (error) =>{
                    console.log("Something broke! ", error);  
                    reject(error);      
                })
        });
    };

    this.LoadSuspects();
}]);