let app = angular.module('VoterApp', []);
app.controller('AdminController', ['$scope', '$http', function($scope, $http){
    this.Suspects = [];
    this.Winners = [];
    this.Detectives = [];
    this.ContestMode = null;
    this.CurrentSuspect = null;
    this.CurrentDetective = null;
    this.ActiveTab = 'suspects';
    this.Loading = false;
    this.SuspectForm = {
        Suspect: "",
        IsCulprit: null,
        Message: ""
    };
    /**
     * Page events
     */
    this.onTabClicked = (tab) => {
        this.ActiveTab = tab;
        if(tab === 'winners'){
            this.LoadWinners();
        }else if(tab == 'detectives'){
            this.LoadDetectives();
        }else{
            this.LoadSuspects();
        }
    };
    this.onCreateClicked = ($event) => {
        $(".create-modal").modal('toggle');
    };
    this.onCreateConfirmClicked = ($event) => {
        if(this.SuspectForm.Name.length == 0){
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
        this.SuspectForm.Name = suspect.name;
        this.SuspectForm.IsCulprit = parseInt(suspect.isCulprit);
        console.log("Editing");
    };
    this.onEditConfirmClicked = ($event) => {
        if(this.SuspectForm.Name.length == 0){
            console.log("Bad form!");
            this.SuspectForm.Message = "Fill out name!";
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
    this.onDeleteDetectiveClicked = ($event, id) => {
        console.log("Deleting");
        $event.stopPropagation();
        $('.delete-modal.detective').modal('show');
        this.CurrentDetective = id;
    };
    this.onDeleteDetectiveConfirmClicked = ($event, id) => {
        $('.delete-modal.detective').modal('show');
        this.DeleteDetective()
            .then(() => {
                $(".delete-modal.detective").modal('hide');
            })
            .catch(() => {
                console.log("Something broke!");
            });
    };
    this.onDeleteDetectiveCancelClicked = ($event, id) => {
        $('.delete-modal.detective').modal('hide');
        this.CurrentDetective = null;
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
        this.SuspectForm.Name = "";
        this.SuspectForm.IsCulprit = null;
    };
    this.CreateSuspect = () => {
        return new Promise((resolve, reject) => {
            $http.get(`api/createsuspect.php?name=${this.SuspectForm.Name}&is_culprit=${this.SuspectForm.IsCulprit}`)
                .then((result) => {
                    console.log("Finished! ", result);
                    this.LoadSuspects(); 
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
            console.log(this.SuspectForm);
            $http.get(`api/updatesuspect.php?suspect_id=${this.CurrentSuspect}&name=${this.SuspectForm.Name}&is_culprit=${this.SuspectForm.IsCulprit}`)
                .then((result) => {
                    console.log("Finished! ", result);
                    this.LoadSuspects(); 
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
            $http.get(`api/deletesuspect.php?suspect_id=${this.CurrentSuspect}`)
                .then((result) => {
                    this.LoadSuspects(); 
                    resolve(result);
                },
                (error) => {
                    //TODO: HANDLE ERROR
                    console.log(error);
                    reject(error);
                });
        });   
    };
    this.DeleteDetective = () => {
        return new Promise((resolve, reject) => {
            $http.get(`api/deletesuspect.php?suspect_id=${this.CurrentSuspect}`)
                .then((result) => {
                    this.LoadSuspects(); 
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
                    this.LoadSuspects(); 
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
                    this.LoadSuspects(); 
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
    this.LoadSuspects = () => {
        this.Loading = true;
        $http.get(`api/getsuspects.php`)
            .then((results) => {               
               if(!results.hasOwnProperty('data')){
                   console.log("Error in data");
                   return;
               }
               this.Loading = false;
               this.Suspects = results.data;
            },
            (error) => {
                //TODO: HANDLE ERROR
                this.Loading = false;
                console.log(error);
            });
    };
    this.LoadDetectives = () => {
        this.Loading = true;
        $http.get(`api/getdetectives.php`)
            .then((results) => {               
               if(!results.hasOwnProperty('data')){
                   console.log("Error in data");
                   return;
               }
               this.Loading = false;
               this.Detectives = results.data;
            },
            (error) => {
                //TODO: HANDLE ERROR
                console.log(error);
                this.Loading = false;
            });
    };
    this.LoadWinners = () => {
        this.Loading = true;
        $http.get(`api/getwinners.php`)
            .then((results) => {               
               if(!results.hasOwnProperty('data')){
                   console.log("Error in data");
                   return;
               }
               this.Loading = false;
               this.Winners = results.data;
            },
            (error) => {
                //TODO: HANDLE ERROR
                console.log(error);
                this.Loading = false;
            });
    };
    this.LoadSuspects();
}]);