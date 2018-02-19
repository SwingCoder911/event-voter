let app = angular.module('VoterApp', []);
app.controller('AdminController', ['$scope', '$http', function($scope, $http){
    this.AvailableContestants = [];
    this.Winners = [];
    this.SelectedContestants = [];
    this.ContestMode = null;
    this.CurrentContestant = null;
    this.ContestantForm = {
        PartnerA: "",
        PartnerB: "",
        Message: ""
    };
    /**
     * Page events
     */
    this.onCreateClicked = ($event) => {
        $(".create-modal").modal('toggle');
    };
    this.onCreateConfirmClicked = ($event) => {
        if(this.ContestantForm.PartnerA.length == 0 || this.ContestantForm.PartnerB.length == 0){
            console.log("Bad form!");
            this.ContestantForm.Message = "Fill out both fields!";
            return;
        }else{
            this.ContestantForm.Message = "";
        }
        this.CreateContestant()
            .then(() => {
                this.ClearContestantForm();
                $(".create-modal").modal('hide');
            })
            .catch(() => {
                console.log("Something broke!");
            });
        
    };
    this.onCreateCancelClicked = ($event) => {
        $(".create-modal").modal('hide');
        this.ClearContestantForm();
    };
    this.onContestantToggled = ($event, id) => {
        if(this.SelectedContestants.indexOf(id) !== -1){
            this.SelectedContestants.splice(this.SelectedContestants.indexOf(id), 1);
        }else{
            this.SelectedContestants.push(id);
        }        
    };
    this.onEditClicked = ($event, contestant) => {
        $event.stopPropagation();
        $(".edit-modal").modal('show');
        this.CurrentContestant = contestant.id;
        this.ContestantForm.PartnerA = contestant.partnerA;
        this.ContestantForm.PartnerB = contestant.partnerB;
        console.log("Editing");
    };
    this.onEditConfirmClicked = ($event) => {
        if(this.ContestantForm.PartnerA.length == 0 || this.ContestantForm.PartnerB.length == 0){
            console.log("Bad form!");
            this.ContestantForm.Message = "Fill out both fields!";
            return;
        }else{
            this.ContestantForm.Message = "";
        }
        this.EditContestant()
            .then(() => {
                $(".edit-modal").modal('hide');
            })
            .catch(() => {
                console.log("Something broke!");
            });
        
    };
    this.onEditCancelClicked = ($event) => {
        $(".edit-modal").modal('hide');
        this.ClearContestantForm();
        this.CurrentContestant = null;
    };
    this.onDeleteClicked = ($event, id) => {
        console.log("Deleting");
        $event.stopPropagation();
        $('.delete-modal').modal('show');
        this.CurrentContestant = id;
    };
    this.onDeleteConfirmClicked = ($event, id) => {
        $('.delete-modal').modal('show');
        this.DeleteContestant()
            .then(() => {
                $(".delete-modal").modal('hide');
            })
            .catch(() => {
                console.log("Something broke!");
            });
    };
    this.onDeleteCancelClicked = ($event, id) => {
        $('.delete-modal').modal('hide');
        this.CurrentContestant = null;
    };
    this.onStartClicked = ($event, contestant) => {
        $event.stopPropagation();
        if(this.SelectedContestants.length < 2){
            return;
        }
        $(".start-modal").modal('show');
        console.log("Editing");
    };
    this.onStartConfirmClicked = ($event) => {
        this.StartContest()
            .then(() => {
                $(".start-modal").modal('hide');
            })
            .catch(() => {
                console.log("Something broke!");
            });
        
    };
    this.onStartCancelClicked = ($event) => {
        $(".start-modal").modal('hide');
    };
    this.onStopClicked = ($event, contestant) => {
        $event.stopPropagation();
        $(".stop-modal").modal('show');
    };
    this.onStopConfirmClicked = ($event) => {
        this.StopContestant()
            .then((winningContestants) => {
                $(".stop-modal").modal('hide');
                $(".winner-modal").modal('show');
            })
            .catch(() => {
                console.log("Something broke!");
            });
        
    };
    this.onStopCancelClicked = ($event) => {
        $(".stop-modal").modal('hide');
    };
    this.onFinishClicked = ($event) => {
        $('.winner-modal').modal('hide');
    };
    
    /**
     * App Methods
     */
    this.ClearContestantForm = () => {
        this.ContestantForm.PartnerA = "";
        this.ContestantForm.PartnerB = "";
    };
    this.CreateContestant = () => {
        return new Promise((resolve, reject) => {
            $http.get(`api/createcontestant.php?partner_a=${this.ContestantForm.PartnerA}&partner_b=${this.ContestantForm.PartnerB}`)
                .then((result) => {
                    console.log("Finished! ", result);
                    this.LoadAvailableContestants(); 
                    resolve(result);
                },
                (error) => {
                    //TODO: HANDLE ERROR
                    console.log(error);
                    reject(error);
                });
        });        
    };
    this.EditContestant = () => {
        return new Promise((resolve, reject) => {
            $http.get(`api/updatecontestant.php?couple_id=${this.CurrentContestant}&partner_a=${this.ContestantForm.PartnerA}&partner_b=${this.ContestantForm.PartnerB}`)
                .then((result) => {
                    console.log("Finished! ", result);
                    this.LoadAvailableContestants(); 
                    resolve(result);
                },
                (error) => {
                    //TODO: HANDLE ERROR
                    console.log(error);
                    reject(error);
                });
        });        
    };
    this.DeleteContestant = () => {
        return new Promise((resolve, reject) => {
            $http.get(`api/archivecontestant.php?couple_id=${this.CurrentContestant}`)
                .then((result) => {
                    this.LoadAvailableContestants(); 
                    resolve(result);
                },
                (error) => {
                    //TODO: HANDLE ERROR
                    console.log(error);
                    reject(error);
                });
        });   
    };
    this.StartContest = () => {
        return new Promise((resolve, reject) => {
            $http.get(`api/setactivecontest.php?contestants=${this.SelectedContestants.join(',')}`)
                .then((result) => {
                    this.LoadAvailableContestants(); 
                    this.ContestMode = true;
                    resolve(result);
                },
                (error) => {
                    //TODO: HANDLE ERROR
                    console.log(error);
                    reject(error);
                });
        });   
    };
    this.StopContestant = () => {
        return new Promise((resolve, reject) => {
            $http.get(`api/closeactivecontest.php`)
                .then((result) => {
                    this.LoadAvailableContestants(); 
                    this.Winners = result.data;
                    console.log(this.Winners);
                    this.ContestMode = false;
                    resolve(result);
                },
                (error) => {
                    //TODO: HANDLE ERROR
                    console.log(error);
                    reject(error);
                });
        });   
    };
    this.LoadAvailableContestants = () => {
        $http.get(`api/getavailablecontestants.php`)
            .then((results) => {               
               if(!results.hasOwnProperty('data')){
                   console.log("Error in data");
                   return;
               }
               console.log(results.data);
               this.AvailableContestants = results.data;
               let running = false;
               for(let i = 0, len = this.AvailableContestants.length; i < len; i++){
                    if(this.AvailableContestants[i].active){
                        running = true;
                    }
               }
               this.ContestMode = running;
            },
            (error) => {
                //TODO: HANDLE ERROR
                console.log(error);
            });
    };

    this.LoadAvailableContestants();
}]);