$ = document.querySelector.bind(document);
$$ = document.querySelectorAll.bind(document);
const listProduct = $(`.list-item`);
const pageList = $(".page");
let startItemInPage = 0;
let currentPage = 1;
const numberInPage = 12;
let dataProductPage = [];
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
async function renderPage() {
  const dataRespond = await send("GET", "https://dummyjson.com/products");
  const dataProducts = dataRespond.products;
  let numberPage = 0;
  dataProducts.length % numberInPage === 0
    ? (numberPage = dataProducts.length / numberInPage)
    : (numberPage = Math.ceil(dataProducts.length / numberInPage));

  for (let i = 1; i <= numberPage; i++) {
    const div = document.createElement("div");
    if (i === currentPage) div.classList.add("active");
    div.classList.add("page-num");
    div.dataset.index = i;
    div.innerHTML = `<span>${i}</span>`;
    pageList.appendChild(div);
  }
}
renderPage();
async function renderProducts(startItemInPage, numberInPage) {
  const dataRespond = await send("GET", "https://dummyjson.com/products");
  const dataProducts = dataRespond.products;
  dataProductPage = dataProducts.slice(
    startItemInPage,
    startItemInPage + numberInPage
  );
  const html = dataProductPage
    .map((product, index) => {
      return `<div class="col col-sm-12 col-md-4 col-xl-3 p-2">
                            <div class="product-item w-100" data-index=${index}>
                                <div class="product-img">
                                    <img
                                        src='${product.images[0]}'
                                        alt="Tên sản phẩm"
                                    />
                                    <span class="discount-badge">${escapeHTML(
                                      product.discountPercentage
                                    )}%</span>
                                </div>
                                <div class="product-info">
                                    <h3 class="product-title">
                                        ${escapeHTML(product.title)}
                                    </h3>
                                    <p class="product-price">
                                        <span class="original-price"
                                            >${product.price}$</span
                                        >
                                        ${(
                                          (Number(product.price) *
                                            (100 -
                                              Number(
                                                product.discountPercentage
                                              ))) /
                                          100
                                        ).toFixed(2)}$
                                    </p>
                                    <button class="add-to-cart">
                                        Thêm vào giỏ
                                    </button>
                                </div>
                            </div>
                        </div>`;
    })
    .join("");
  listProduct.innerHTML = html;
}
renderProducts(startItemInPage, numberInPage);

pageList.onclick = function (e) {
  const btnPage = e.target.closest(".page-num");
  if (btnPage && currentPage != Number(btnPage.dataset.index)) {
    const oldPage = pageList.querySelector(".page-num.active");
    oldPage.classList.remove("active");
    btnPage.classList.add("active");
    currentPage = Number(btnPage.dataset.index);
    startItemInPage = (currentPage - 1) * numberInPage;
    renderProducts(startItemInPage, numberInPage);
  }
};
document.body.onclick = function (e) {
  const productItems = $$(".product-item");
  productItems.forEach((item) => {
    item.onclick = () => {
      const params = `i=${
        Number(item.dataset.index) + 1 + (currentPage - 1) * numberInPage
      }`;
      location.href =
        location.origin + `/detail.html` + `?${params}` + location.hash;
    };
  });
};

function escapeHTML(html) {
  const tempDiv = document.createElement("div");
  tempDiv.textContent = html;
  return tempDiv.innerHTML;
}
