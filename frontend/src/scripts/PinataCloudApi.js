
// const PINATA_API_KEY = "d89f72ee7cf5f30231df"
// const PINATA_API_SECRET = "017131184d5dee1f3f0e91310b83af4b2e0573dfbfdf14e13b325c98780d1dd3"
const PINATA_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJiNTZmMDM1Yy02MzFjLTQyYzctOGUxMS0yMzIxZmM1ODkxMTciLCJlbWFpbCI6Im1iaWdvc3BhbUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiZDg5ZjcyZWU3Y2Y1ZjMwMjMxZGYiLCJzY29wZWRLZXlTZWNyZXQiOiIwMTcxMzExODRkNWRlZTFmM2YwZTkxMzEwYjgzYWY0YjJlMDU3M2RmYmZkZjE0ZTEzYjMyNWM5ODc4MGQxZGQzIiwiZXhwIjoxNzUzODA5MjA3fQ.x97If-19X5IqeFCgLS_gs6admvVKChErbUiTtAUWkSk"
const GATEWAY_URL = "azure-accurate-puma-356.mypinata.cloud"

export default class PinataCloudApi {

    static async submitFile(fileName, selectedFile) {
        try {
            const formData = new FormData()
            formData.append("file", selectedFile);

            const metadata = JSON.stringify({
                name: fileName
            });

            formData.append("pinataMetadata", metadata);

            const options = JSON.stringify({
                cidVersion: 0
            });
            formData.append("pinataOptions", options);

            const res = await fetch(
                "https://api.pinata.cloud/pinning/pinFileToIPFS",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${PINATA_JWT}`
                    },
                    body: formData
                }
            );

            const resData = await res.json();

            return `${GATEWAY_URL}/ipfs/${resData.IpfsHash}`;
        } catch (e) {
            console.log("PinataCloudApi: submitFile: error", e);
        }
    }

}
