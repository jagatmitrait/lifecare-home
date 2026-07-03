import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import HomeCare from "./homecare";
import HomeVisitForm from "./HomeVisitForm";
import BookSlot from "./BookSlot";
import BookingStatus from "./BookingStatus";
import About from "./about";
import TermsAndConditions from "./TermsAndConditions";
import PrivacyPolicy from "./PrivacyPolicy";
import TreatmentDetails from "./TreatmentDetails";
import NursingCareers from "./NursingCareers";

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <HomeCare />
            </Layout>
          }
        />
        <Route
          path="/about"
          element={
            <Layout>
              <About />
            </Layout>
          }
        />
        <Route
          path="/services/home-care"
          element={
            <Layout>
              <HomeCare />
            </Layout>
          }
        />
        <Route
          path="/home-visit"
          element={
            <Layout>
              <HomeVisitForm />
            </Layout>
          }
        />
        <Route
          path="/book-slot"
          element={
            <Layout>
              <BookSlot />
            </Layout>
          }
        />
        <Route
          path="/booking-status"
          element={
            <Layout>
              <BookingStatus />
            </Layout>
          }
        />
        <Route
          path="/terms"
          element={
            <Layout>
              <TermsAndConditions />
            </Layout>
          }
        />
        <Route
          path="/privacy"
          element={
            <Layout>
              <PrivacyPolicy />
            </Layout>
          }
        />
        <Route
          path="/treatment-details"
          element={
            <Layout>
              <TreatmentDetails />
            </Layout>
          }
        />
        <Route
          path="/careers/nursing"
          element={
            <Layout>
              <NursingCareers />
            </Layout>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
