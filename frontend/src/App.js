import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// import { loadStripe } from '@stripe/stripe-js'
// import { Elements } from '@stripe/react-stripe-js'

//import from react bootstrap
import { Container } from "react-bootstrap";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import CartScreen from "./screens/CartScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ShippingScreen from "./screens/ShippingScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from "./screens/OrderScreen";
import UserListScreen from "./screens/UserListScreen";
import BannerUploadScreen from "./screens/BannerUploadScreen";
import SmallBannerUploadScreen from "./screens/SmallBannerUploadScreen";
import UserEditScreen from "./screens/UserEditScreen";
import ProductListScreen from "./screens/ProductListScreen";
import ProductEditScreen from "./screens/ProductEditScreen";
import CategoryListScreen from "./screens/CategoryListScreen";
import OrderListScreen from "./screens/OrderListScreen";
import CodSuccessScreen from "./screens/CodSuccessScreen";
import ContactUsScreen from "./screens/ContactUsScreen";
import DeliveryFaqScreen from "./screens/DeliveryFaqScreen";
import ReturnScreen from "./screens/ReturnScreen";
import AboutUsScreen from "./screens/AboutUsScreen";
import PrivacyPolicyScreen from "./screens/PrivacyPolicyScreen";
import TermsScreen from "./screens/TermsScreen";
import ProductCategoryScreen from "./screens/ProductCategoryScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";
import ScrollToTop from "./components/ScrollToTop";
import Completion from "./screens/Completion";
import SelectPaymentScreen from "./screens/SelectPaymentScreen";
import CategoryEditScreen from "./screens/CategoryEditScreen";
import PromotionListScreen from "./screens/PromotionListScreen";
import PromotionEditScreen from "./screens/PromotionEditScreen";
import ProductPromotionScreen from "./screens/ProductPromotionScreen";
import SuccessPage from "./components/SuccessPage";
const getMarginTop = () => {
  const isMobile = window.innerWidth <= 767; // Adjust the breakpoint as needed
  return isMobile ? "140px" : "140px";
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="bg-light">
        <Header />

        <main className="py-3">
          <Container style={{ marginTop: getMarginTop(), padding: 0 }}>
            {/* <HomeScreen /> */}
            {/* If a link has / with anything it will take this route so 'exact'*/}
            {/* 'component' has changed to 'element' in react-router-dom version 6*/}
            <Routes>
              <Route path="/success" element={<SuccessPage />} />
              <Route path="/completion" element={<Completion />} />
              <Route path="/orders/:id" element={<OrderScreen />} />

              <Route
                path="/forgot-password"
                element={<ForgotPasswordScreen />}
              />
              <Route path="/reset-password" element={<ResetPasswordScreen />} />

              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route path="/shipping" element={<ShippingScreen />} />
              <Route path="/selectpayment" element={<SelectPaymentScreen />} />
              <Route path="/orders/:id/cod" element={<CodSuccessScreen />} />
              <Route path="/register" element={<RegisterScreen />} />
              <Route path="/profile" element={<ProfileScreen />} />
              <Route path="/contactus" element={<ContactUsScreen />} />
              <Route path="/delivery" element={<DeliveryFaqScreen />} />
              <Route path="/returns" element={<ReturnScreen />} />
              <Route path="/aboutus" element={<AboutUsScreen />} />
              <Route path="/privacy" element={<PrivacyPolicyScreen />} />
              <Route path="/terms" element={<TermsScreen />} />

              <Route path="/login" element={<LoginScreen />} />
              <Route path="/product/:id" element={<ProductScreen />} />
              <Route
                path="/category/:category"
                element={<ProductCategoryScreen />}
              />
              <Route
                path="/promotion/:promotion"
                element={<ProductPromotionScreen />}
              />

              <Route path="/cart/:id?" element={<CartScreen />} />
              <Route path="/admin/userlist" element={<UserListScreen />} />
              <Route path="/admin/user/:id/edit" element={<UserEditScreen />} />
              <Route path="/admin/orderlist" element={<OrderListScreen />} />
              <Route path="/admin/banners" element={<BannerUploadScreen />} />
              <Route
                path="/admin/categories"
                element={<CategoryListScreen />}
              />

              <Route
                path="/admin/categories/:id/edit"
                element={<CategoryEditScreen />}
              />
              <Route
                path="/admin/bannerssmall"
                element={<SmallBannerUploadScreen />}
              />
              <Route
                path="/admin/promotions"
                element={<PromotionListScreen />}
              />
              <Route
                path="/admin/promotions/:id/edit"
                element={<PromotionEditScreen />}
              />
              <Route
                path="/admin/productlist"
                element={<ProductListScreen />}
                exact
              />
              <Route
                path="/admin/productlist/:pageNumber"
                element={<ProductListScreen />}
                exact
              />

              <Route
                path="/admin/product/:id/edit"
                element={<ProductEditScreen />}
              />
              <Route path="/admin/orders" element={<OrderListScreen />} />

              {/* <Route path="/search/:keyword" element={<HomeScreen />} exact /> */}
              <Route path="/search/:keyword" element={<HomeScreen />} />

              <Route path="/page/:pageNumber" element={<HomeScreen />} />

              <Route path="/" element={<HomeScreen />} exact />
            </Routes>
          </Container>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
//test
//test
