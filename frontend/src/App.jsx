import { BrowserRouter, Routes, Route } from "react-router-dom";
import adminRoutes from "./router/adminRoutes";
import businessRoutes from "./router/businessRoutes";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import { BusinessAuthProvider } from "./context/BusinessAuthContext";
import LoginSelectPage from "./pages/auth/LoginSelectPage";

function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <BusinessAuthProvider>
          <Routes>
            {/* 관리자 라우트 */}
            {adminRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element}>
                {route.children?.map((child) => (
                  <Route
                    key={child.path || "index"}
                    index={child.index}
                    path={child.path}
                    element={child.element}
                  />
                ))}
              </Route>
            ))}

            {/* 사업자 라우트 */}
            {businessRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element}>
                {route.children?.map((child) => (
                  <Route
                    key={child.path || "index"}
                    index={child.index}
                    path={child.path}
                    element={child.element}
                  />
                ))}
              </Route>
            ))}

            {/* 루트 - 로그인 선택 페이지 */}
            <Route path="/" element={<LoginSelectPage />} />
          </Routes>
        </BusinessAuthProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}

export default App;
