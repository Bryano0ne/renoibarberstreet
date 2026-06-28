import { NextRequest } from "next/server";
import { createHmac } from "crypto";

export async function POST(req: NextRequest) {
  const body = await req.json();

  // Vérification signature CinetPay — obligatoire en production
  const secret = process.env.CINETPAY_SECRET_KEY;
  if (secret) {
    const expected = createHmac("sha256", secret)
      .update(body.cpm_trans_id + body.cpm_site_id)
      .digest("hex");
    if (body.signature !== expected) {
      return Response.json({ error: "Signature invalide" }, { status: 401 });
    }
  } else if (process.env.NODE_ENV === "production") {
    return Response.json({ error: "Webhook non configuré" }, { status: 503 });
  }

  const { cpm_trans_id, cpm_result, cpm_amount, cpm_custom } = body;

  if (cpm_result === "00") {
    // En prod : UPDATE reservations SET statut='payee', paye=true WHERE id = cpm_custom
    void cpm_custom; void cpm_amount; void cpm_trans_id;
  }

  return Response.json({ code: "00", message: "OK" });
}
