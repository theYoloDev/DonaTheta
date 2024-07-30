import request from "request";

const THETA_EDGECLOUD_API_KEY = "srvacc_n733cs8ugs30nvrrk5rmnv793"
const THETA_EDGECLOUD_API_SECRET = "v0td9ay01ib80mwtpse33tk6tpmv3k8g"

export default class ThetaVideoApi {

    static async createNewLiveStream(liveStreamName) {
        let request = require('request');
        const options = {
            'method': 'POST',
            'url': 'https://api.thetavideoapi.com/stream',
            'headers': {
                'x-tva-sa-id': THETA_EDGECLOUD_API_KEY,
                'x-tva-sa-secret': THETA_EDGECLOUD_API_SECRET,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "name": liveStreamName
            })
        };
        request(options, function (error, response) {
            if (error) throw new Error(error);
            console.log(response.body);
            return response.body;
        });
    }

    static async getLiveStream(
        url
    ) {
        let request = require('request');
        const options = {
            'method': 'GET',
            'url': `https://api.thetavideoapi.com/stream/${url}`,
            'headers': {
                'x-tva-sa-id': THETA_EDGECLOUD_API_KEY,
                'x-tva-sa-secret': THETA_EDGECLOUD_API_SECRET
            }
        };
        request(options, function (error, response) {
            if (error) throw new Error(error);
            console.log(response.body);

            return response.body;
        });
    }

    static async listLiveStreams() {
        let request = require('request');
        const options = {
            'method': 'GET',
            'url': `https://api.thetavideoapi.com/service_account/${THETA_EDGECLOUD_API_KEY}/streams`,
            'headers': {
                'x-tva-sa-id': THETA_EDGECLOUD_API_KEY,
                'x-tva-sa-secret': THETA_EDGECLOUD_API_SECRET
            }
        };
        request(options, function (error, response) {
            if (error) throw new Error(error);
            console.log(response.body);

            return response.body;
        });
    }

    static async listEdgeIngestors() {
        let request = require('request');
        const options = {
            'method': 'GET',
            'url': 'https://api.thetavideoapi.com/ingestor/filter',
            'headers': {
                'x-tva-sa-id': THETA_EDGECLOUD_API_KEY,
                'x-tva-sa-secret': THETA_EDGECLOUD_API_SECRET
            }
        }

        request(options, function (error, response) {
            if (error) throw new Error(error);
            console.log(response.body);

            return response.body;
        });
    }

    static async selectEdgeIngestor(ingestorUrl, streamUrl) {
        let request = require('request');
        const options = {
            'method': 'PUT',
            'url': `https://api.thetavideoapi.com/ingestor/${ingestorUrl}/select`,
            'headers': {
                'x-tva-sa-id': THETA_EDGECLOUD_API_KEY,
                'x-tva-sa-secret': THETA_EDGECLOUD_API_SECRET,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "tva_stream": streamUrl
            })
        };
        request(options, function (error, response) {
            if (error) throw new Error(error);
            console.log(response.body);

            return response.body;
        });
    }

    static async unselectEdgeIngestor(ingestorUrl) {
        let request = require('request');
        const options = {
            'method': 'PUT',
            'url': `https://api.thetavideoapi.com/ingestor/${ingestorUrl}/unselect`,
            'headers': {
                'x-tva-sa-id': THETA_EDGECLOUD_API_KEY,
                'x-tva-sa-secret': THETA_EDGECLOUD_API_SECRET,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        };
        request(options, function (error, response) {
            if (error) throw new Error(error);
            console.log(response.body);

            return true;
        });
    }

}
