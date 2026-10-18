import { supabase } from "../../lib/supabaseClient";
import { certsForProduct, certHref } from "../../lib/crossLinks";

export const revalidate = 3600;

async function getProducts() {
  const { data } = await supabase
    .from("vikna_royal_products")
    .select("id, name, url, data, image_url")
    .order("image_url", { ascending: true, nullsFirst: false })
    .order("name");
  return data || [];
}

async function getCertificates() {
  const { data } = await supabase
    .from("vikna_royal_certificates")
    .select("registration, product, valid_to")
    .order("valid_to", { ascending: false });
  return data || [];
}

function listFields(d) {
  const out = [];
  for (const key of ["features", "types", "common_features", "options", "use_cases", "forms", "fillings"]) {
    if (Array.isArray(d?.[key])) out.push(...d[key]);
  }
  return out;
}

export default async function ProductsPage() {
  const products = await getProducts();
  const certs = await getCertificates();

  return (
    <main>
      <section className="block">
        <h2>Вся продукція</h2>
        <p className="lead">{products.length} категорій. Ціни на сайті не публікуються — лише за запитом.</p>
        <div className="grid">
          {products.map((p) => {
            const productCerts = certsForProduct(p.id, certs);
            return (
            <div className="card" key={p.id} id={p.id}>
              {p.image_url && (
                <img
                  src={p.image_url}
                  alt={p.name}
                  style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 8, marginBottom: 12 }}
                />
              )}
              <h3>{p.name}</h3>
              {p.data?.description && (
                <p style={{ fontSize: 14, color: "var(--muted)" }}>{p.data.description}</p>
              )}
              <ul>
                {listFields(p.data).slice(0, 6).map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
              {productCerts.length > 0 && (
                <p className="xlinks">
                  Сертифікати:{" "}
                  {productCerts.map((c) => (
                    <a key={c.registration} href={certHref(c)}>
                      {c.registration}
                    </a>
                  ))}
                </p>
              )}
              {p.url && (
                <a className="more" href={p.url} target="_blank" rel="noreferrer">
                  Оригінал на сайті →
                </a>
              )}
            </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
