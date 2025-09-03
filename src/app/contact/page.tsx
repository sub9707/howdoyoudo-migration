import PageHeader from "@/components/sections/PageHeader";
import KakaoMap from "@/components/ui/KakaoMap";

export default function Page() {
    return (
        <div className="flex flex-col min-h-screen ">
            <PageHeader title='CONTACT' description="찾아오시는 길" />
            <main className="flex-1 container mx-auto px-4 py-16 flex flex-col lg:flex-row gap-8">
                {/* Left: Map */}
                <div className="flex-1 rounded-lg overflow-hidden shadow-md">
                    <div className="w-full h-80 lg:h-[500px] rounded-lg overflow-hidden shadow-md">
                        <KakaoMap lat={37.476744} lng={126.885778} markerTitle="벽산디지털밸리5차" />
                    </div>
                </div>

                {/* Right: Company Info */}
                <div className="flex-1 p-6 rounded-lg shadow-md flex flex-col justify-center">
                    <h3 className="text-xl font-semibold mb-4">Company Info</h3>
                    <p>서울시 금천구 벚꽃로 244</p>
                    <p>벽산디지털밸리 5차 712호</p>
                    <p>(지번, 가산동 60-73)</p>
                    <div className="my-4"></div>
                    <p>Tel. +82 2 322 9775</p>
                    <p>Fax. +82 2 6499 2525</p>
                </div>
            </main>

            {/* Contact Form 아래 배치 */}
            <div className="container mx-auto px-4 py-16">
                <div className="p-8 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
                    <p className="mb-6 text-gray-600">
                        Send us an e-mail and we will get back to you in 24 hours.
                    </p>
                    <form className="flex flex-col gap-4 pointer-events-none">
                        <input
                            type="text"
                            placeholder="Your Name*"
                            className="border border-gray-300 rounded px-3 py-2 bg-gray-100"
                        />
                        <input
                            type="email"
                            placeholder="E-mail*"
                            className="border border-gray-300 rounded px-3 py-2 bg-gray-100"
                        />
                        <input
                            type="text"
                            placeholder="Subject"
                            className="border border-gray-300 rounded px-3 py-2 bg-gray-100"
                        />
                        <textarea
                            rows={6}
                            placeholder="Message*"
                            className="border border-gray-300 rounded px-3 py-2 bg-gray-100 resize-none"
                        />
                        <button
                            type="button"
                            className="bg-blue-600 text-white rounded px-6 py-2 cursor-not-allowed"
                        >
                            Send
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
