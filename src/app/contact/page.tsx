import PageHeader from "@/components/sections/PageHeader";
import KakaoMap from "@/components/ui/KakaoMap";
import { MapPin, Mail, Phone, Facebook, Youtube, Instagram } from "lucide-react";

export default function Page() {
    return (
        <div className="flex flex-col min-h-screen">
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
        </div>
    );
}