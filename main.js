$ = document.querySelector.bind(document);
$$ = document.querySelectorAll.bind(document);
const productsManager = {
    listProduct: $(`.list-item`),
    pageList: $(".page"),
    startItemInPage: 0,
    currentPage: 1,
    numberInPage: 12,
    dataProductPage: [],
    dataRespond: {},
    async getDataProducts() {
        this.dataRespond = await this.send(
            "GET",
            "https://dummyjson.com/products"
        );
    },
    async send(method, url) {
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
    },
    renderPage() {
        const dataProducts = this.dataRespond.products;
        let numberPage = 0;
        dataProducts.length % this.numberInPage === 0
            ? (numberPage = dataProducts.length / this.numberInPage)
            : (numberPage = Math.ceil(dataProducts.length / this.numberInPage));

        for (let i = 1; i <= numberPage; i++) {
            const div = document.createElement("div");
            if (i === this.currentPage) div.classList.add("active");
            div.classList.add("page-num");
            div.dataset.index = i;
            div.innerHTML = `<span>${i}</span>`;
            this.pageList.appendChild(div);
        }
    },
    handleEvent() {
        this.pageList.onclick = (e) => {
            const btnPage = e.target.closest(".page-num");
            if (btnPage && this.currentPage != Number(btnPage.dataset.index)) {
                const oldPage = this.pageList.querySelector(".page-num.active");
                oldPage.classList.remove("active");
                btnPage.classList.add("active");
                this.currentPage = Number(btnPage.dataset.index);
                this.startItemInPage =
                    (this.currentPage - 1) * this.numberInPage;
                this.renderProducts(this.startItemInPage, this.numberInPage);
            }
        };
        this.listProduct.onclick = (e) => {
            const productItem = e.target.closest(".product-item");
            if (productItem) {
                const oldPathName = location.pathname;
                const arr = oldPathName.split("/");
                let path = "";
                for (let i = 0; i < arr.length - 1; i++) {
                    path += `/${arr[i]}`;
                }

                const params = `i=${
                    Number(productItem.dataset.index) +
                    1 +
                    (this.currentPage - 1) * this.numberInPage
                }`;
                console.log(this);
                location.href =
                    location.origin +
                    path +
                    `/detail.html` +
                    `?${params}` +
                    location.hash;
            }
        };
    },
    renderProducts(startItemInPage, numberInPage) {
        const dataProducts = this.dataRespond.products;
        this.dataProductPage = dataProducts.slice(
            startItemInPage,
            startItemInPage + numberInPage
        );
        const html = this.dataProductPage
            .map((product, index) => {
                return `<div class="col col-sm-12 col-md-4 col-xl-3 p-2">
                              <div class="product-item w-100 h-100" data-index=${index}>
                                  <div class="product-img">
                                      <img
                                          src='${product.images[0]}'
                                          alt="Tên sản phẩm"
                                      />
                                      <span class="discount-badge">${this.escapeHTML(
                                          product.discountPercentage
                                      )}%</span>
                                  </div>
                                  <div class="product-info">
                                      <h3 class="product-title">
                                          ${this.escapeHTML(product.title)}
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
        this.listProduct.innerHTML = html;
    },
    async start() {
        await this.getDataProducts();
        this.renderPage();
        this.renderProducts(this.startItemInPage, this.numberInPage);
        this.handleEvent.call(this);
    },
    escapeHTML(html) {
        const tempDiv = document.createElement("div");
        tempDiv.textContent = html;
        return tempDiv.innerHTML;
    },
};
productsManager.start();
