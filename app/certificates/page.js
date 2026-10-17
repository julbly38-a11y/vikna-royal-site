import { supabase } from "../../lib/supabaseClient";

export const revalidate = 3600;

async function getCertificates() {
  const { data } = await supabase
    .from("vikna_royal_certificates")
    .select("*")
    .order("valid_to", { ascending: false });
  return data || [];
}

function isExpired(validTo) {
  if (!validTo) return null;
  return new Date(validTo) < new Date();
}

export default async function CertificatesPage() {
  const certs = await getCertificates();
  const expiredCount = certs.filter((c) => isExpired(c.valid_to)).length;

  return (
    <main>
      <section className="block">
        <h2>Сертифікати відповідності</h2>
        <p className="lead">
          {certs.length} сертифікатів зі сканів на сайті.{" "}
          {expiredCount > 0 && (
            <strong style={{ color: "#a11313" }}>{expiredCount} прострочено — дані для переоформлення.</strong>
          )}
        </p>
        <table>
          <thead>
            <tr>
              <th>Номер</th>
              <th>Продукт</th>
              <th>Виробник</th>
              <th>Термін дії</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {certs.map((c) => {
              const expired = isExpired(c.valid_to);
              return (
                <tr key={c.image_url}>
                  <td>{c.registration}</td>
                  <td>{c.product}</td>
                  <td>{c.manufacturer}</td>
                  <td>
                    {c.valid_from} — {c.valid_to}
                  </td>
                  <td>
                    <span className={`badge ${expired ? "expired" : "ok"}`}>
                      {expired ? "прострочено" : "чинний"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </main>
  );
}
