import request from "request";

const THETA_EDGECLOUD_API_KEY = "srvacc_n733cs8ugs30nvrrk5rmnv793"
const THETA_EDGECLOUD_API_SECRET = "v0td9ay01ib80mwtpse33tk6tpmv3k8g"

export default class ThetaVideoApi {

    static async createNewUrl() {
        let request = require('request');
        const options = {
            'method': 'POST',
            'url': 'https://api.thetavideoapi.com/upload',
            'headers': {
                'x-tva-sa-id': THETA_EDGECLOUD_API_KEY,
                'x-tva-sa-secret': THETA_EDGECLOUD_API_SECRET
            }
        };
        request(options, function (error, response) {
            if (error) throw new Error(error);
            console.log(response.body);
        });
    }

    static async getVideo(
        url
    ) {
        let request = require('request');
        const options = {
            'method': 'GET',
            'url': `https://api.thetavideoapi.com/video/${url}`,
            'headers': {
                'x-tva-sa-id': THETA_EDGECLOUD_API_KEY,
                'x-tva-sa-secret': THETA_EDGECLOUD_API_SECRET
            }
        };
        request(options, function (error, response) {
            if (error) throw new Error(error);
            console.log(response.body);
        });
    }

    static async listVideos(
        page = 1,
        number = 100
    ) {
        let request = require('request');
        const options = {
            'method': 'GET',
            'url': `https://api.thetavideoapi.com/video/${THETA_EDGECLOUD_API_KEY}/list?page=${page}&number=${number}`,
            'headers': {
                'x-tva-sa-id': THETA_EDGECLOUD_API_KEY,
                'x-tva-sa-secret': THETA_EDGECLOUD_API_SECRET
            }
        };
        request(options, function (error, response) {
            if (error) throw new Error(error);
            console.log(response.body);
        });
    }

}
