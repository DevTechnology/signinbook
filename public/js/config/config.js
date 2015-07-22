angular.module('devSigninConfig', [])
.constant('config', {
    'backend': 'http://prod_node_server_ip:8080',
    'disclaimer' : 'Dev Technology is a Secure Facility and therefore visitors to are not permitted entry without official business purposes, ' + 
                    'and are requested to sign in upon entering. All visitors are required to present valid, ' + 
                    'government-issued identification or are escorted otherwise.'
})