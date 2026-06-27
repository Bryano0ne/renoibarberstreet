import { NextRequest } from "next/server";
import { createHmac } from "crypto";

export async function POST(req: NextRequest) {
  const body = await req.json();

  // Vérification signature CinetPay
  const secret = process.env.CINETPAY_SECRET_KEY;
  if (secret && body.cpm_site_id) {
    const expected = createHmac("sha256", secret)
      .update(body.cpm_trans_id + body.cpm_site_id)
      .digest("hex");
    if (body.signature && body.signature !== expected) {
      return Response.json({ error: "Signature invalide" }, { status: 401 });
    }
  }

  const { cpm_trans_id, cpm_result, cpm_amount, cpm_custom } = body;

  if (cpm_result === "00") {
    // Paiement confirmé — en prod : UPDATE reservations SET statut='payee', paye=true WHERE id = cpm_custom
    console.log(`[WEBHOOK] Paiement confirmé — Réservation ${cpm_custom} — ${cpm_amount} XOF — TXN: ${cpm_trans_id}`);
  } else {
    console.log(`[WEBHOOK] Paiement échoué — Réservation ${cpm_custom} — Code: ${cpm_result}`);
  }

  return Response.json({ code: "00", message: "OK" });
}
