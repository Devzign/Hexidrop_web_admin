import { Link } from "react-router-dom";
import { LegalPage } from "@/components/hexi/LegalPage";



export function Terms() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="Last updated 1 July 2026"
      sections={[
        {
          heading: "1. Acceptance of terms",
          body: "By using HexiDrop you agree to these Terms of Service. If you do not agree, please do not use the service. These terms apply to every booking, whether placed on our website, app or over the phone.",
        },
        {
          heading: "2. The service",
          body: "HexiDrop provides on-demand parcel delivery and moving services across Zimbabwe. We connect senders with independent riders and moving crews. Availability, ETAs and fares are estimates and may change based on traffic, weather and demand.",
        },
        {
          heading: "3. Your responsibilities",
          body: "You must accurately describe the parcel, provide correct pickup and drop-off details and be reachable by phone. You may not send prohibited items, including cash, weapons, illegal substances, hazardous materials or perishable goods without prior approval.",
        },
        {
          heading: "4. Fares and payment",
          body: "Fares are shown before you confirm and comprise a base fare, distance and any applicable service fee. Payment is due upon delivery via cash, EcoCash or a supported card. Business accounts may settle monthly under a separate agreement.",
        },
        {
          heading: "5. Insurance",
          body: "Every HexiDrop delivery includes complimentary in-transit insurance up to $200 per shipment. Claims must be filed within 48 hours of delivery. High-value shipments may require additional cover, arranged in advance.",
        },
        {
          heading: "6. Cancellations",
          body: "You may cancel a booking free of charge within 60 seconds. Cancellations after a rider has been dispatched may incur a small dispatch fee. Moves cancelled less than 24 hours before the booked window may forfeit the deposit.",
        },
        {
          heading: "7. Liability",
          body: "HexiDrop is not liable for indirect or consequential damages. Our maximum liability for a single shipment is limited to the insurance cover in effect. We are not responsible for delays caused by events beyond our reasonable control.",
        },
        {
          heading: "8. Changes to these terms",
          body: "We may update these terms from time to time. Material changes will be communicated by email or in-app notice. Continued use of HexiDrop after such notice constitutes acceptance of the updated terms.",
        },
        {
          heading: "9. Contact",
          body: "Questions about these terms? Email legal@hexidrop.co.zw or write to us at 14 Sam Levy Way, Borrowdale, Harare.",
        },
      ]}
    />
  );
}

export default Terms;
