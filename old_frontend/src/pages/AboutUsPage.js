import React from "react";

export default function AboutUsPage() {
    return (
        <>
            <div id="main" className="grow p-6">
                {/* System Explanation Section */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold mb-4">About DonaTheta</h2>
                    <p className="text-lg mb-6">
                        DonaTheta is a revolutionary donation platform that leverages the power of video content to create awareness for donation projects. By showcasing videos, we aim to provide a transparent and engaging way for donors to see the impact of their contributions. Additionally, our platform ensures that all withdrawn funds are meticulously tracked, giving donors peace of mind that their donations are being used as intended.
                    </p>
                    <p className="text-lg">
                        This project was submitted as part of a hackathon sponsored by the Theta blockchain, showcasing the capabilities and potential of Theta's decentralized video delivery network.
                    </p>
                </section>

                {/* Contact Section */}
                <section>
                    <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
                    <p className="text-lg mb-6">
                        If you have any questions, suggestions, or would like to get involved, please don't hesitate to reach out to us.
                    </p>
                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="name">Name</label>
                            <input type="text" id="name" className="w-full p-2 border bg-transparent border-gray-300 rounded-md" placeholder="Your name" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
                            <input type="email" id="email" className="w-full p-2 bg-transparent border border-gray-300 rounded-md" placeholder="Your email" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="message">Message</label>
                            <textarea id="message" className="w-full p-2 border bg-transparent border-gray-300 rounded-md" rows="4" placeholder="Your message"></textarea>
                        </div>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Send Message</button>
                    </form>
                </section>
            </div>
        </>
    );
}
