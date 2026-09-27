import { LegalPage } from "@/components/public/LegalPage";

export function RefundPolicy() {
  return (
    <LegalPage
      title="Refund Policy"
      updated="Last updated 1 July 2026"
      sections={[
        {
          heading: "1. Fast cancellations",
          body: "Cancel a delivery within 60 seconds of booking and you pay nothing. Cancellations after a rider is dispatched may incur a small dispatch fee, shown at the moment of cancellation.",
        },
        {
          heading: "2. Failed or late deliveries",
          body: "If we fail to complete a booked delivery for reasons within our control, you receive a full refund of the fare. If a delivery arrives more than 30 minutes past the agreed ETA for reasons within our control, you receive a 20% credit on the fare.",
        },
        {
          heading: "3. Damaged or missing items",
          body: "Report damage or missing items within 48 hours of delivery, with photos. Approved claims are settled through our insurance cover, up to $200 per shipment, within 7 working days.",
        },
        {
          heading: "4. Movers & Packers",
          body: "Deposits for scheduled moves are refundable up to 24 hours before the booked window. Within 24 hours, the deposit is retained to cover crew and vehicle allocation.",
        },
        {
          heading: "5. Duplicate charges",
          body: "If you are charged twice for the same booking, we refund the duplicate charge to the original payment method within 5 working days of confirmation.",
        },
        {
          heading: "6. How to request a refund",
          body: "Open the Help & Support screen in the HexiDrop app, select the relevant delivery, and tap 'Request refund'. Our support team reviews and responds within 2 hours.",
        },
      ]}
    />
  );
}

export default RefundPolicy;
