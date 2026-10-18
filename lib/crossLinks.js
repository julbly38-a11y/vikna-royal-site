// У базі немає прямого зв'язку продукт ↔ сертифікат, тому він виводиться
// з тексту certificates.product. Ключ — vikna_royal.products.id.
const RULES = {
  "plastic-windows-doors": /ПВХ|VEKA|склопакет/i,
  "aluminium-windows-doors": /ALUPROF/i,
  "aluminium-structures": /ALUPROF/i,
  "stained-glass": /вітраж/i,
};

export function productIdsForCert(cert) {
  return Object.keys(RULES).filter((id) => RULES[id].test(cert.product || ""));
}

export function certsForProduct(productId, certs) {
  const rule = RULES[productId];
  return rule ? certs.filter((c) => rule.test(c.product || "")) : [];
}

export const productHref = (id) => `/products#${encodeURIComponent(id)}`;
export const certHref = (cert) => `/certificates#${encodeURIComponent(`cert-${cert.registration}`)}`;
