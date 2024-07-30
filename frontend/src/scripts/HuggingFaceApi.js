
const HUGGING_FACE_API_KEY = "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"

export default class HuggingFaceApi {

    static async stableDiffusionXl(prompt) {
        try {
            const response = await fetch(
                "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
                {
                    headers: {
                        Authorization: `Bearer ${HUGGING_FACE_API_KEY}`,
                        "Content-Type": "application/json",
                    },
                    method: "POST",
                    body: JSON.stringify({
                        "inputs": prompt
                    }),
                }
            );
            const result = await response.blob();
            return result;
        } catch (e) {
            console.log("HuggingFaceApi: stableDiffusionXl: error", e);
            throw e;
        }
    }

}
