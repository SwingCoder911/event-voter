let app = angular.module('VoterApp', []);
app.controller('VoterController', ['$scope', '$http', function($scope, $http){
    this.VotedSuspect = null;
    this.ActiveSuspects = [];
    this.Loaded = false;
    this.Pending = false;
    this.AlreadyVoted = false;
    /**
     * Dom events
     */
    this.onVoteClicked = ($event, suspect) => {
        $('.vote-modal').modal('show');
        this.VotedSuspect = suspect;
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
                localStorage.setItem('voted', stamp);
                $scope.$apply();
            })
            .catch((error) => {
                console.log(error);
            });
    };
    this.onVoteCancelClicked = ($event) => {
        $('.vote-modal').modal('hide');
        this.VotedSuspect = null;
    };
    /**
     * Class methods
     */
    this.LoadActiveSuspects = () => {
        $http.get('api/getsession.php')
            .then((result) => {
                if(localStorage.getItem('voted') == result.data){
                    this.AlreadyVoted = true;
                    this.Loaded = true;
                }else{
                    $http.get(`api/getavailablesuspects.php`)
                        .then((results) => {               
                            if(!results.hasOwnProperty('data')){
                                console.log("Error in data");
                                return;
                            }
                            console.log(results.data);
                            this.ActiveSuspects = results.data;
                            this.Loaded = true;
                        },
                        (error) => {
                            //TODO: HANDLE ERROR
                            console.log(error);
                        });
                }
                console.log(result.data);
            })
       
    };

    this.CastVote = () => {
        this.Pending = true;
        return new Promise((resolve, reject) => {
            $http.get(`api/vote.php?couple_id=${this.VotedSuspect.id}`)
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

    this.LoadActiveSuspects();
}]);