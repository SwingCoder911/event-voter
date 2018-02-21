let app = angular.module('VoterApp', []);
app.controller('AdminController', ['$scope', '$http', function($scope, $http){
    this.AvailableSuspects = [];
    this.Winners = [];
    this.SelectedSuspects = [];
    this.ContestMode = null;
    this.SuspectForm = {
        Suspect: "",
        Message: ""
    };
    /**
     * Page events
     */
    this.onCreateClicked = ($event) => {
        $(".create-modal").modal('toggle');
    };
    this.onCreateConfirmClicked = ($event) => {
        if(this.SuspectForm.Suspect.length == 0){
            console.log("Bad form!");
            this.SuspectForm.Message = "Fill out the field!";
            return;
        }else{
            this.SuspectForm.Message = "";
        }
        this.CreateSuspect()
            .then(() => {
                this.ClearSuspectForm();
                $(".create-modal").modal('hide');
            })
            .catch(() => {
                console.log("Something broke!");
            });
        
    };
    this.onCreateCancelClicked = ($event) => {
        $(".create-modal").modal('hide');
        this.ClearSuspectForm();
    };
    this.onSuspectToggled = ($event, id) => {
        if(this.SelectedSuspects.indexOf(id) !== -1){
            this.SelectedSuspects.splice(this.SelectedSuspects.indexOf(id), 1);
        }else{
            this.SelectedSuspects.push(id);
        }        
    };
    this.onEditClicked = ($event, suspect) => {
        $event.stopPropagation();
        $(".edit-modal").modal('show');
        this.CurrentSuspect = suspect.id;
        this.SuspectForm.PartnerA = suspect.partnerA;
        this.SuspectForm.PartnerB = suspect.partnerB;
        console.log("Editing");
    };
    this.onEditConfirmClicked = ($event) => {
        if(this.SuspectForm.PartnerA.length == 0 || this.SuspectForm.PartnerB.length == 0){
            console.log("Bad form!");
            this.SuspectForm.Message = "Fill out both fields!";
            return;
        }else{
            this.SuspectForm.Message = "";
        }
        this.EditSuspect()
            .then(() => {
                $(".edit-modal").modal('hide');
            })
            .catch(() => {
                console.log("Something broke!");
            });
        
    };
    this.onEditCancelClicked = ($event) => {
        $(".edit-modal").modal('hide');
        this.ClearSuspectForm();
        this.CurrentSuspect = null;
    };
    this.onDeleteClicked = ($event, id) => {
        console.log("Deleting");
        $event.stopPropagation();
        $('.delete-modal').modal('show');
        this.CurrentSuspect = id;
    };
    this.onDeleteConfirmClicked = ($event, id) => {
        $('.delete-modal').modal('show');
        this.DeleteSuspect()
            .then(() => {
                $(".delete-modal").modal('hide');
            })
            .catch(() => {
                console.log("Something broke!");
            });
    };
    this.onDeleteCancelClicked = ($event, id) => {
        $('.delete-modal').modal('hide');
        this.CurrentSuspect = null;
    };
    this.onStartClicked = ($event, suspect) => {
        $event.stopPropagation();
        if(this.SelectedSuspects.length < 2){
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
    this.onStopClicked = ($event, suspect) => {
        $event.stopPropagation();
        $(".stop-modal").modal('show');
    };
    this.onStopConfirmClicked = ($event) => {
        this.StopContest()
            .then((winningSuspects) => {
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
    this.ClearSuspectForm = () => {
        this.SuspectForm.PartnerA = "";
        this.SuspectForm.PartnerB = "";
    };
    this.CreateSuspect = () => {
        return new Promise((resolve, reject) => {
            $http.get(`api/createsuspect.php?partner_a=${this.SuspectForm.PartnerA}&partner_b=${this.SuspectForm.PartnerB}`)
                .then((result) => {
                    console.log("Finished! ", result);
                    this.LoadAvailableSuspects(); 
                    resolve(result);
                },
                (error) => {
                    //TODO: HANDLE ERROR
                    console.log(error);
                    reject(error);
                });
        });        
    };
    this.EditSuspect = () => {
        return new Promise((resolve, reject) => {
            $http.get(`api/updatesuspect.php?couple_id=${this.CurrentSuspect}&partner_a=${this.SuspectForm.PartnerA}&partner_b=${this.SuspectForm.PartnerB}`)
                .then((result) => {
                    console.log("Finished! ", result);
                    this.LoadAvailableSuspects(); 
                    resolve(result);
                },
                (error) => {
                    //TODO: HANDLE ERROR
                    console.log(error);
                    reject(error);
                });
        });        
    };
    this.DeleteSuspect = () => {
        return new Promise((resolve, reject) => {
            $http.get(`api/archivesuspect.php?couple_id=${this.CurrentSuspect}`)
                .then((result) => {
                    this.LoadAvailableSuspects(); 
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
            $http.get(`api/setactivecontest.php?suspects=${this.SelectedSuspects.join(',')}`)
                .then((result) => {
                    this.LoadAvailableSuspects(); 
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
    this.StopContest = () => {
        return new Promise((resolve, reject) => {
            $http.get(`api/closeactivecontest.php`)
                .then((result) => {
                    this.LoadAvailableSuspects(); 
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
    this.LoadAvailableSuspects = () => {
        $http.get(`api/getavailablesuspects.php`)
            .then((results) => {               
               if(!results.hasOwnProperty('data')){
                   console.log("Error in data");
                   return;
               }
               console.log(results.data);
               this.AvailableSuspects = results.data;
               let running = false;
               for(let i = 0, len = this.AvailableSuspects.length; i < len; i++){
                    if(this.AvailableSuspects[i].active){
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

    this.LoadAvailableSuspects();
}]);