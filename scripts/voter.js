let app = angular.module('VoterApp', []);
app.controller('VoterController', ['$scope', '$http', function($scope, $http){
    this.VotedSuspect = null;
    this.Detective = {
        Name: "",
        SuspectId: null
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
        this.CastVote()
            .then((stamp) => {
                $('.vote-modal').modal('hide');
                this.VotedSuspect = null;
                this.AlreadyVoted = true;
                // localStorage.setItem('voted', stamp);
                $scope.$apply();
            })
            .catch((error) => {
                console.log(error);
            });
    };
    this.onVoteCancelClicked = ($event) => {
        $('.vote-modal').modal('hide');
        this.VotedSuspect = null;
        this.ClearDetective();
    };
    /**
     * Class methods
     */
    this.ClearDetective = () => {
        this.Detective.Name = "";
        this.Detective.SuspectId = null;
    };
    this.LoadSuspects = () => {
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