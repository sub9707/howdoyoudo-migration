"use client";

import { Map, MapMarker } from "react-kakao-maps-sdk";
import useKakaoLoader from "./useKakaoLoader";

interface KakaoMapProps {
    lat: number;
    lng: number;
    markerTitle?: string;
}

const KakaoMap = ({ lat, lng, markerTitle }: KakaoMapProps) => {
    useKakaoLoader();
    return (
        <Map
            id="map"
            center={{ lat, lng }}
            style={{ width: "100%", height: "100%" }} // 부모 박스 안에서 꽉 차게
            level={3}
            isPanto={true}
        >
            <MapMarker position={{ lat, lng }}>
                {markerTitle && (
                    <div style={{ padding: "5px 10px", background: "white", borderRadius: "4px", fontSize: "14px" }}>
                        {markerTitle}
                    </div>
                )}
            </MapMarker>
        </Map>
    );
};

export default KakaoMap;