import { supabase } from "../../lib/supabaseClient";
import { productIdsForCert, productHref } from "../../lib/crossLinks";

export const revalidate = 3600;

async function getCertificates() {
  const { data } = await supabase
    .from("vikna_royal_certificates")
    .select("*")
    .order("valid_to", { ascending: false });
  return data || [];
}

async function getProductNames() {
  const { data } = await supabase.from("vikna_royal_products").select("id, name");
  return Object.fromEntries((data || []).map((p) => [p.id, p.name]));
}

function isExpired(validTo) {
  if (!validTo) return null;
  return new Date(validTo) < new Date();
}

export default async function CertificatesPage() {
  const certs = await getCertificates();
  const productNames = await getProductNames();
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
              <th>Скан</th>
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
                <tr key={c.image_url} id={`cert-${c.registration}`}>
                  <td>
                    <a href={c.image_url} target="_blank" rel="noreferrer">
                      <img
                        src={c.image_url}
                        alt={c.registration}
                        style={{ width: 64, height: 88, objectFit: "cover", borderRadius: 4, border: "1px solid var(--border)" }}
                      />
                    </a>
                  </td>
                  <td>{c.registration}</td>
                  <td>
                    {c.product}
                    {productIdsForCert(c).filter((id) => productNames[id]).length > 0 && (
                      <p className="xlinks">
                        Продукція:{" "}
                        {productIdsForCert(c)
                          .filter((id) => productNames[id])
                          .map((id) => (
                            <a key={id} href={productHref(id)}>
                              {productNames[id]}
                            </a>
                          ))}
                      </p>
                    )}
                  </td>
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
