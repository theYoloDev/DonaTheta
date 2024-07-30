const THETA_EDGECLOUD_API_KEY = "srvacc_n733cs8ugs30nvrrk5rmnv793"
const THETA_EDGECLOUD_API_SECRET = "v0td9ay01ib80mwtpse33tk6tpmv3k8g"

export default class ThetaVideoApi {

    static async createNewLiveStream(liveStreamName) {
        try {
            const res = await fetch(
                'https://api.thetavideoapi.com/stream',
                {
                    method: "POST",
                    headers: {
                        'x-tva-sa-id': THETA_EDGECLOUD_API_KEY,
                        'x-tva-sa-secret': THETA_EDGECLOUD_API_SECRET,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "name": liveStreamName
                    })
                }
            )

            return res.body;
        } catch (e) {
            console.log("ThetaVideoApi: createNewLiveStream: error", e);
            throw e;
        }
    }

    static async getLiveStream(liveStreamUrl) {
        try {
            const res = await fetch(
                `https://api.thetavideoapi.com/stream/${liveStreamUrl}`,
                {
                    method: "GET",
                    headers: {
                        'x-tva-sa-id': THETA_EDGECLOUD_API_KEY,
                        'x-tva-sa-secret': THETA_EDGECLOUD_API_SECRET
                    }
                }
            );

            return res.body;
        } catch (e) {
            console.log("ThetaVideoApi: getLiveStream: error", e)
            throw e
        }
    }

    static async listLiveStreams() {
        try {

            const res = await fetch(
                `https://api.thetavideoapi.com/service_account/${THETA_EDGECLOUD_API_KEY}/streams`,
                {
                    method: "GET",
                    headers: {
                        'x-tva-sa-id': THETA_EDGECLOUD_API_KEY,
                        'x-tva-sa-secret': THETA_EDGECLOUD_API_SECRET
                    }
                }
            )

            return res.body;

        } catch (e) {
            console.log("ThetaVideoApi: listLiveStreams: error", e);
            throw e;
        }
    }

    static async listEdgeIngestors() {
        try {

            const res = await fetch(
                'https://api.thetavideoapi.com/ingestor/filter',
                {
                    method: "GET",
                    headers: {
                        'x-tva-sa-id': THETA_EDGECLOUD_API_KEY,
                        'x-tva-sa-secret': THETA_EDGECLOUD_API_SECRET
                    }
                }
            )

            return res.body;

        } catch (e) {
            console.log("ThetaVideoApi: listEdgeIngestors: error", e);
            throw e;
        }
    }

    static async selectEdgeIngestor(ingestorUrl, streamUrl) {
        try {
            const res = await fetch(
                `https://api.thetavideoapi.com/ingestor/${ingestorUrl}/select`,
                {
                    method: "PUT",
                    headers: {
                        'x-tva-sa-id': THETA_EDGECLOUD_API_KEY,
                        'x-tva-sa-secret': THETA_EDGECLOUD_API_SECRET,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "tva_stream": streamUrl
                    })
                }
            )

            return res.body;
        } catch (e) {
            console.error("ThetaVideoApi: selectEdgeIngestor: error: ", e)
            throw e
        }
    }

    static async unselectEdgeIngestor(ingestorUrl) {
        try {
            await fetch(
                `https://api.thetavideoapi.com/ingestor/${ingestorUrl}/unselect`,
                {
                    method: "PUT",
                    headers: {
                        'x-tva-sa-id': THETA_EDGECLOUD_API_KEY,
                        'x-tva-sa-secret': THETA_EDGECLOUD_API_SECRET,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({})
                }
            )

            return true;

        } catch (e) {
            console.log("ThetaVideoApi: unselectEdgeIngestor: Error", e);
            throw e;
        }
    }

}
