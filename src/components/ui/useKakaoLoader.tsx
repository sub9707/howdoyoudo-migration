import { useKakaoLoader as useKakaoLoaderOrigin } from "react-kakao-maps-sdk"

export default function useKakaoLoader() {
  console.log(process.env.NEXT_PUBLIC_KAKAOJSKEY)
  useKakaoLoaderOrigin({
    appkey: process.env.NEXT_PUBLIC_KAKAOJSKEY!,
    libraries: ["clusterer", "drawing", "services"],
  })
}