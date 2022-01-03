import axios from "axios";

export class Utils {
    static getApiEndpoint(signature) {
        let gatewayPath = 'http://127.0.0.1:8000/api/'
        let token = localStorage.getItem('access_token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = "Bearer " + token
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
        switch(signature){
            case 'login':
                return gatewayPath + 'token/';
            case 'tweet':
                return gatewayPath + 'tweet/';
            case 'feed':
                return gatewayPath + 'feed/';
            case 'like-tweet':
                return gatewayPath + 'like-tweet/';
            case 'create-tweet':
                return gatewayPath + 'create-tweet/';
            case 'retweet':
                return gatewayPath + 'retweet/';
            default:
                return '';
        }
    }
}