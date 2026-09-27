import { Link } from "react-router-dom";
import { LegalPage } from "@/components/hexi/LegalPage";



export function Privacy() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="Last updated 1 July 2026"
      sections={[
        {
          heading: "1. What we collect",
          body: "We collect the information you give us — name, phone, email, addresses and payment details — plus data automatically generated when you use HexiDrop, such as device information, approximate location and booking history.",
        },
        {
          heading: "2. How we use it",
          body: "Your information is used to match you with the right rider or moving crew, process payments, send delivery updates, improve our service and comply with our legal obligations. We do not sell your data.",
        },
        {
          heading: "3. Sharing",
          body: "We share only the minimum information needed with our drivers (name, phone and pickup / drop-off addresses), payment processors, and government authorities where required by law.",
        },
        {
          heading: "4. Location data",
          body: "Live tracking uses precise location while a booking is active. You can turn location off at any time from your device settings — some features will stop working while it is off.",
        },
        {
          heading: "5. Retention",
          body: "We keep booking data for as long as needed to provide the service and to comply with tax and legal requirements — typically five years — after which it is deleted or anonymised.",
        },
        {
          heading: "6. Your rights",
          body: "You may request a copy of your data, ask us to correct it or ask us to delete it. Email privacy@hexidrop.co.zw and we will respond within 30 days.",
        },
        {
          heading: "7. Security",
          body: "We use industry-standard safeguards — encryption in transit, hashed credentials and role-based access — to protect your information. No system is perfectly secure, but we treat your data as if it were our own.",
        },
        {
          heading: "8. Contact",
          body: "Privacy questions? Email privacy@hexidrop.co.zw or write to us at 14 Sam Levy Way, Borrowdale, Harare.",
        },
      ]}
    />
  );
}

export default Privacy;
