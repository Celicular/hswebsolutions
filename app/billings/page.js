import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BillingsHero from "./components/BillingsHero";
import PaymentMethods from "./components/PaymentMethods";
import Invoices from "./components/Invoices";
import PaymentTerms from "./components/PaymentTerms";
import SecurityInfo from "./components/SecurityInfo";
import BillingSupport from "./components/BillingSupport";
import styles from "./page.module.css";

export const metadata = {
  title: "Payments & Billing - HS Web Solutions",
  description:
    "Secure and compliant payment methods, invoicing, and billing information for HS Web Solutions projects.",
};

export default function BillingsPage() {
  return (
    <div className={styles.container}>
      <Navbar />

      <div className={styles.pageContent}>
        <BillingsHero />
        <PaymentMethods />
        <Invoices />
        <PaymentTerms />
        <SecurityInfo />
        <BillingSupport />
      </div>

      <Footer />
    </div>
  );
}
