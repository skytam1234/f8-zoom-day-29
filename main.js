async function send(method, url) {
  const res = await fetch(url, { method });
  if (!res.ok) throw new Error(`HTTP code:${(await res).status}`);
  const type = (await res).headers.get(`content-type`);
  const isJSON = type && type.includes(`application/json`);
  try {
    const result = isJSON ? await res.json() : await res.text();
    return result;
  } catch (error) {
    throw new Error("Invalid JSON format");
  }
}
const a = send("GET", "https://dummyjson.com/products");
a.then((res) => console.log(res.products[0]));
