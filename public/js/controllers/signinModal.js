angular.module('devSigninController')
    .controller('signinCtrl', ['$scope','$http','Entries','$modalInstance', '$filter', function($scope, $http, Entries, $modalInstance, $filter) {
        var placeholderText = "Please type POC.";
        var purposePlaceholderText = "Please type the purpose of visit.";
        
        $scope.user = {};
        // this scope variable is for when the poc other button is clicked.
        $scope.isPocOther = false;
        $scope.isPurposeOther = false;
        
        $scope.placeholderText = placeholderText;
        $scope.purposePlaceholderText = purposePlaceholderText;
        
        // CREATE ==================================================================
        // when submitting the add form, send the text to the node API
        $scope.createEntry = function() {
            // validate the formData to make sure that something is there
            // if form is empty, nothing will happen
            if ($scope.user != undefined && validate($scope.user)) {
                $scope.loading = true;
                
                var userToUpdate = $scope.user;
                var now = new Date();
                userToUpdate.date = now;
                userToUpdate.timeIn = now;
                userToUpdate.timeOut = undefined;

                // call the create function from our service (returns a promise object)
                Entries.create(userToUpdate)

                    // if successful creation, call our get function to get all the new entries
                    .success(function(data) {
                        $scope.loading = false;
                        $modalInstance.close(data);
                    });
            } else {
                console.log("error: user input validation failed.");
            }
        };
        
        var validate = function(user) {
            if(!user.fname || user.fname.length == 0) 
                return false;
            if(!user.lname || user.lname.length == 0) 
                return false;
            if(!user.company || user.company.length == 0) 
                return false;
            if(!user.poc || user.poc.length == 0) 
                return false;
            if(!user.purpose || user.purpose.length == 0) 
                return false;
            
            return true;
        }
        
        // POC textbox and buttons control
        $scope.dropdown = {
            isopen: false
        };

        $scope.toggled = function(open) {
            $log.log('Dropdown is now: ', open);
        };

        $scope.toggleDropdown = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.dropdown.isopen = !$scope.dropdown.isopen;
        };
        
        var togglePocOther = function() {
            $scope.isPocOther = !$scope.isPocOther;
        };
        
        $scope.togglePocOther = togglePocOther;
        
        var hidePlaceholderText = function() {
            $scope.placeholderText = "";
        };
        
        var showPlaceholderText = function() {
            resetPlaceholderText();
        };
        
        var resetPlaceholderText = function() {
            $scope.placeholderText = placeholderText;
        };
        
        $scope.hidePlaceholderText = hidePlaceholderText;
        $scope.showPlaceholderText = showPlaceholderText;
        
        var resetPocBtn = function() {
            togglePocOther();
            resetPlaceholderText();
        };
        
        $scope.resetPocBtn = resetPocBtn;
        
        // purpose textbox and buttons control
        $scope.purposeDropdown = {
            isopen: false
        };

        $scope.purposeToggled = function(open) {
            $log.log('Dropdown is now: ', open);
        };

        $scope.purposeToggleDropdown = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.purposeDropdown.isopen = !$scope.purposeDropdown.isopen;
        };
        var togglePurposeOther = function() {
            $scope.isPurposeOther = !$scope.isPurposeOther;
        };
        
        $scope.togglePurposeOther = togglePurposeOther;
        
        var hidePurposePlaceholderText = function() {
            $scope.placePurposeholderText = "";
        };
        
        var showPurposePlaceholderText = function() {
            resetPurposePlaceholderText();
        };
        
        var resetPurposePlaceholderText = function() {
            $scope.purposePlaceholderText = purposePlaceholderText;
        };
        
        $scope.hidePurposePlaceholderText = hidePurposePlaceholderText;
        $scope.showPurposePlaceholderText = showPurposePlaceholderText;
        
        var resetPurposeBtn = function() {
            togglePurposeOther();
            resetPurposePlaceholderText();
        };
        
        $scope.resetPurposeBtn = resetPurposeBtn;
        
        
        $scope.cancel = function () {
          $modalInstance.dismiss('cancel');
        };
        
        $scope.setCurrentPoc = function(techy) {
            $scope.user.poc = techy;
        };
        
        $scope.setCurrentPov = function(pov) {
            $scope.user.purpose = pov;
        };
        
        $scope.setCurrentName = function(name) {
            $scope.user.name = name;
        };
        
    }]);