type TUserDevice = "mobile" | "tablet" | "desktop" | "undefined";

export default function GetUserDevice(): TUserDevice {
    const userAgent = navigator.userAgent.toLowerCase();

    const isMobile = /iphone|ipod|android|blackberry|iemobile|opera mini|windows phone/i.test(userAgent);
    const isTablet = /ipad|android|tablet|kfapwi/i.test(userAgent) && !/mobile/i.test(userAgent);
    const isDesktop = !isMobile && !isTablet;

    if (isMobile) {
        return "mobile";
    } else if (isTablet) {
        return "tablet";
    } else if (isDesktop) {
        return "desktop"
    } else {
        return "undefined";
    }
}