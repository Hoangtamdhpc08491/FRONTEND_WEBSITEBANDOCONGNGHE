// src/App.jsx
import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import router from "./routes";
import '@fortawesome/fontawesome-free/css/all.min.css';

import { SystemSettingProvider, useSystemSetting } from "@/contexts/SystemSettingContext";
import { systemSettingService } from "@/services/admin/systemSettingService";
import useAuthStore from "@/stores/AuthStore";
import keepAliveService from "@/services/keepAliveService";

import { GoogleOAuthProvider } from "@react-oauth/google";
import ThemeCustomization from "./themes"; 
import Toastify from "components/common/Toastify";
import ScrollTop from "./components/Admin/ScrollTop";
import KeepAliveMonitor from "./components/common/KeepAliveMonitor";

import "./assets/Client/css/global.css";
import "./index.css";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function DynamicTitleUpdater() {
  const { settings } = useSystemSetting();

  useEffect(() => {
    if (settings?.siteName && settings.siteName.trim() && settings.siteName !== "my shop 11111") {
      // đổi title (chỉ khi có title hợp lệ và không phải "my shop 11111")
      document.title = settings.siteName;

      // đổi meta description
      let meta = document.querySelector("meta[name='description']");
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = "description";
        document.head.appendChild(meta);
      }
      meta.content = settings.siteDescription || "Cyberzone - Mua sắm trực tuyến các sản phẩm điện tử, điện gia dụng, và công nghệ với giá tốt nhất";
    }
  }, [settings]);

  return null;
}

function AppContent() {
  const fetchUserInfo = useAuthStore((s) => s.fetchUserInfo);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  // Khởi động keep-alive service cho backend
  useEffect(() => {
    // Chỉ chạy trong production hoặc khi có VITE_ENABLE_KEEP_ALIVE=true
    const shouldEnableKeepAlive = 
      import.meta.env.PROD || 
      import.meta.env.VITE_ENABLE_KEEP_ALIVE === 'true';

    if (shouldEnableKeepAlive) {
      console.log('🚀 Starting backend keep-alive service...');
      keepAliveService.start();

      // Cleanup khi component unmount
      return () => {
        keepAliveService.stop();
      };
    }
  }, []);

  useEffect(() => {
    const fetchSystemSettings = async () => {
      try {
        const res = await systemSettingService.get();
        if (res && res.favicon) {
          const link = document.querySelector("link[rel*='icon']") || document.createElement("link");
          link.type = "image/x-icon";
          link.rel = "shortcut icon";
          link.href = res.favicon;
          document.getElementsByTagName("head")[0].appendChild(link);
        }
      } catch (err) {
        console.error("Lỗi khi lấy favicon:", err);
      }
    };

    fetchSystemSettings();
  }, []);

  return (
    <> 
      <ScrollTop />
      <Toastify />
      <DynamicTitleUpdater />
      <KeepAliveMonitor />
     
      <RouterProvider router={router} />
    </>
  );
}
console.log('API URL:', import.meta.env.VITE_API_BASE_URL);

export default function App() {
  return (
    <HelmetProvider>
      <GoogleOAuthProvider clientId={clientId}>
        <SystemSettingProvider>
          {/* Đặt ThemeCustomization ở đây, bao bọc AppContent hoặc trực tiếp RouterProvider */}
          <ThemeCustomization> {/* <-- Đặt ThemeCustomization ở cấp cao hơn */}
            <AppContent />
          </ThemeCustomization>
        </SystemSettingProvider>
      </GoogleOAuthProvider>
    </HelmetProvider>
  );
}