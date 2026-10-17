import { supabase } from "../lib/supabaseClient";

export const revalidate = 3600;

async function getCompany() {
  const { data } = await supabase
    .from("vikna_royal_company_info")
    .select("data")
    .eq("id", 1)
    .single();
  return data?.data || {};
}

async function getProducts() {
  const { data } = await supabase
    .from("vikna_royal_products")
    .select("id, name, url, data, image_url")
    .order("image_url", { ascending: true, nullsFirst: false })
    .order("name");
  return data || [];
}

export default async function HomePage() {
  const company = await getCompany();
  const products = await getProducts();
  const contacts = company.contacts || {};

  return (
    <>
      <div className="hero">
        <h1>{company.company?.name || "Royal Technology"}</h1>
        <p>{company.company?.slogan}</p>
      </div>
      <main>
        <section className="block">
          <h2>Продукція</h2>
          <p className="lead">Металопластикові та алюмінієві конструкції власного виробництва, {company.company?.city}.</p>
          <div className="grid">
            {products.slice(0, 6).map((p) => (
              <div className="card" key={p.id}>
                {p.image_url && (
                  <img
                    src={p.image_url}
                    alt={p.name}
                    style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 8, marginBottom: 12 }}
                  />
                )}
                <h3>{p.name}</h3>
                <ul>
                  {(p.data?.features || p.data?.types || p.data?.common_features || []).slice(0, 3).map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
                <a className="more" href="/products">Детальніше →</a>
              </div>
            ))}
          </div>
        </section>

        <section className="block">
          <h2>Контакти</h2>
          <div className="card">
            <p>{contacts.address}</p>
            <p>{(contacts.phones || []).join(" · ")}</p>
            <p>{contacts.email}</p>
            {contacts.working_hours && (
              <p>
                Пн–Пт {contacts.working_hours.mon_fri}, Сб {contacts.working_hours.sat}, Нд — {contacts.working_hours.sun}
              </p>
            )}
          </div>
        </section>

        <section className="block">
          <h2>Партнери</h2>
          <div className="grid">
            {(company.partners || []).map((p) => (
              <div className="card" key={p.name}>
                <h3>{p.name}</h3>
                <p style={{ color: "var(--muted)", fontSize: 14 }}>{p.type}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
