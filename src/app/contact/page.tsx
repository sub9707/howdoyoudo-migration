import PageHeader from "@/components/sections/PageHeader";
import KakaoMap from "@/components/ui/KakaoMap";
import { MapPin, Mail, Phone, Facebook, Youtube, Instagram } from "lucide-react";

export default function Page() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <PageHeader title='CONTACT US' description="오시는 길과 연락처" />
            
            {/* Main Contact Section */}
            <main className="flex-1 container mx-auto px-4 py-16">
                <div className="flex flex-col lg:flex-row">
                    {/* Left: Contact Information */}
                    <div className="lg:w-1/2 h-120 flex flex-col justify-center items-center  bg-gray-800 text-white p-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                            {/* Address */}
                            <div className="text-center">
                                <div className="w-16 h-16 bg-transparent border-2 border-white rounded-full flex items-center justify-center mx-auto mb-4">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <h3 className="text-sm font-semibold mb-2 tracking-wider">ADDRESS:</h3>
                                <p className="text-sm text-gray-300">서울시 금천구 벚꽃로 244</p>
                                <p className="text-sm text-gray-300">벽산디지털밸리 5차 712호</p>
                            </div>

                            {/* Email */}
                            <div className="text-center">
                                <div className="w-16 h-16 bg-transparent border-2 border-white rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <h3 className="text-sm font-semibold mb-2 tracking-wider">EMAIL:</h3>
                                <p className="text-sm text-gray-300">hello@company.com</p>
                                <p className="text-sm text-gray-300">support@company.com</p>
                            </div>

                            {/* Phone */}
                            <div className="text-center">
                                <div className="w-16 h-16 bg-transparent border-2 border-white rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <h3 className="text-sm font-semibold mb-2 tracking-wider">CALL US:</h3>
                                <p className="text-sm text-gray-300">+82 2 322 9775</p>
                                <p className="text-sm text-gray-300">+82 2 6499 2525</p>
                            </div>
                        </div>

                        {/* Contact Us */}
                        <div className="w-full text-center border-t border-gray-600 pt-8">
                            <h3 className="text-sm font-semibold mb-8 tracking-wider">CONTACT US</h3>
                            <div className="flex justify-center space-x-4">
                                <a href="#" className="w-8 h-8 bg-transparent border border-gray-500 rounded flex items-center justify-center hover:bg-white hover:text-gray-800 transition-colors">
                                    <Facebook className="w-4 h-4" />
                                </a>
                                <a href="#" className="w-8 h-8 bg-transparent border border-gray-500 rounded flex items-center justify-center hover:bg-white hover:text-gray-800 transition-colors">
                                    <Youtube className="w-4 h-4" />
                                </a>
                                <a href="#" className="w-8 h-8 bg-transparent border border-gray-500 rounded flex items-center justify-center hover:bg-white hover:text-gray-800 transition-colors">
                                    <Instagram className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Right: Map */}
                    <div className="lg:w-1/2">
                        <div className="w-full h-120 rounded-lg overflow-hidden shadow-md">
                            <KakaoMap 
                                lat={37.476744} 
                                lng={126.885778} 
                                markerTitle="벽산디지털밸리5차" 
                            />
                        </div>
                    </div>
                </div>
            </main>

            {/* Contact Form Section */}
            <section className="bg-white py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-800 mb-4">Send us a message</h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Send us an e-mail and we will get back to you in 24 hours. We're here to help you with any questions or inquiries you may have.
                            </p>
                        </div>
                        
                        <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100">
                            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-1">
                                    <input
                                        type="text"
                                        placeholder="Your Name*"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        required
                                    />
                                </div>
                                
                                <div className="md:col-span-1">
                                    <input
                                        type="email"
                                        placeholder="E-mail*"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        required
                                    />
                                </div>
                                
                                <div className="md:col-span-2">
                                    <input
                                        type="text"
                                        placeholder="Subject"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>
                                
                                <div className="md:col-span-2">
                                    <textarea
                                        rows={6}
                                        placeholder="Message*"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                        required
                                    />
                                </div>
                                
                                <div className="md:col-span-2 text-center">
                                    <button
                                        type="submit"
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 min-w-[120px]"
                                    >
                                        Send Message
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}