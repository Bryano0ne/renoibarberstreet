import { NextRequest } from "next/server";

const CINETPAY_URL = "https://api-checkout.cinetpay.com/v2/payment";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    reservation_id, montant, client_nom, client_telephone,
    description, methode,
  } = body;

  if (!reservation_id || !montant || !client_nom || !client_telephone) {
    return Response.json({ error: "Paramètres manquants." }, { status: 400 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const transaction_id = `TXN-${reservation_id}-${Date.now()}`;

  // Mode démo si API key non configurée
  if (!process.env.CINETPAY_API_KEY || process.env.CINETPAY_API_KEY === "your_cinetpay_api_key") {
    return Response.json({
      demo: true,
      payment_url: `${appUrl}/paiement/succes?id=${reservation_id}&montant=${montant}&demo=1&txn=${transaction_id}`,
      transaction_id,
    });
  }

  // Appel CinetPay réel
  try {
    const res = await fetch(CINETPAY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        apikey: process.env.CINETPAY_API_KEY,
        site_id: process.env.CINETPAY_SITE_ID,
        transaction_id,
        amount: montant,
        currency: "XOF",
        description: description || `Paiement RENOI Barberstreet — ${reservation_id}`,
        return_url: `${appUrl}/paiement/succes?id=${reservation_id}&txn=${transaction_id}`,
        notify_url: `${appUrl}/api/paiement/webhook`,
        cancel_url: `${appUrl}/paiement/echec?id=${reservation_id}`,
        customer_name: client_nom.split(" ")[0] || client_nom,
        customer_surname: client_nom.split(" ").slice(1).join(" ") || "",
        customer_phone_number: client_telephone,
        customer_address: "Ouagadougou",
        customer_city: "Ouagadougou",
        customer_country: "BF",
        customer_state: "BF",
        customer_zip_code: "00000",
        channels: methode === "card" ? "ALL" : "MOBILE_MONEY",
        lang: "fr",
        metadata: reservation_id,
      }),
    });

    const data = await res.json();

    if (data.code !== "201") {
      return Response.json({ error: data.message || "Erreur CinetPay" }, { status: 502 });
    }

    return Response.json({
      payment_url: data.data.payment_url,
      payment_token: data.data.payment_token,
      transaction_id,
    });
  } catch {
    return Response.json({ error: "Service de paiement indisponible." }, { status: 503 });
  }
}
