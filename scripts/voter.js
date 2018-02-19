let app = angular.module('VoterApp', []);
app.controller('VoterController', ['$scope', '$http', function($scope, $http){
    this.VotedContestant = null;
    this.ActiveContestants = [];
    this.Loaded = false;
    this.Pending = false;
    this.AlreadyVoted = false;
    /**
     * Dom events
     */
    this.onVoteClicked = ($event, contestant) => {
        $('.vote-modal').modal('show');
        this.VotedContestant = contestant;
    };
    this.onVoteConfirmClicked = ($event) => {
        if(this.Pending){
            return;
        }
        this.CastVote()
            .then((stamp) => {
                $('.vote-modal').modal('hide');
                this.VotedContestant = null;
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
        this.VotedContestant = null;
    };
    /**
     * Class methods
     */
    this.LoadActiveContestants = () => {
        $http.get('api/getsession.php')
            .then((result) => {
                if(localStorage.getItem('voted') == result.data){
                    this.AlreadyVoted = true;
                    this.Loaded = true;
                }else{
                    $http.get(`api/getactivecontestants.php`)
                        .then((results) => {               
                            if(!results.hasOwnProperty('data')){
                                console.log("Error in data");
                                return;
                            }
                            console.log(results.data);
                            this.ActiveContestants = results.data;
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
            $http.get(`api/vote.php?couple_id=${this.VotedContestant.id}`)
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

    this.LoadActiveContestants();
}]);