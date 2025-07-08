$ = document.querySelector.bind(document);
$$ = document.querySelectorAll.bind(document);
const detailProductsManager = {
    container: $(".container"),
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
    async renderDetail() {
        const param = new URLSearchParams(location.search);
        const Index = param.get("i");
        const productDetail = await this.send(
            "GET",
            `https://dummyjson.com/products/${Index}`
        );
        const html = `<div class="product-detail-container">
                  <div class="product-images">
                      <img
                          class="main-image"
                          src="${this.escapeHTML(productDetail.images[0])}"
                          alt="Essence Mascara Lash Princess"
                      />
                      <div class="image-gallery">
                          <img
                              src="${this.escapeHTML(productDetail.images[0])}"
                              alt="Gallery 1"
                          />
                      </div>
                  </div>
                  <div class="product-info">
                      <h1>${this.escapeHTML(productDetail.title)}</h1>
                      <p><strong>Thương hiệu:</strong> ${this.escapeHTML(
                          productDetail.brand
                      )}</p>
                      <p><strong>Danh mục:</strong> ${this.escapeHTML(
                          productDetail.category
                      )}</p>
                      <p>
                          <strong>Trạng thái:</strong>
                          <span class="in-stock">Còn hàng</span> (${this.escapeHTML(
                              productDetail.stock
                          )} sản phẩm)
                      </p>
  
                      <div class="price-section">
                          <span class="original-price">${this.escapeHTML(
                              productDetail.price
                          )}$</span>
                          <span class="discounted-price">${(
                              (Number(this.escapeHTML(productDetail.price)) *
                                  (100 -
                                      Number(
                                          this.escapeHTML(
                                              productDetail.discountPercentage
                                          )
                                      ))) /
                              100
                          ).toFixed(2)}$</span>
                          <span class="discount">-${this.escapeHTML(
                              productDetail.discountPercentage
                          )}%</span>
                      </div>
                      <p><strong>Số lượng tối thiểu đặt hàng:</strong>${this.escapeHTML(
                          productDetail.minimumOrderQuantity
                      )}</p>
                      <p class="description">
                          ${this.escapeHTML(productDetail.description)}
                      </p>
                      <div class="tags">
                          <span class="tag">${this.escapeHTML(
                              productDetail.tags[0]
                          )}</span>
                          <span class="tag">${this.escapeHTML(
                              productDetail.tags[1]
                          )}</span>
                      </div>
                      <div class="specs">
                          <p>
                              <strong>Kích thước:</strong> ${this.escapeHTML(
                                  productDetail.dimensions.width
                              )} x ${this.escapeHTML(
            productDetail.dimensions.height
        )} x ${this.escapeHTML(productDetail.dimensions.depth)}
                              mm
                          </p>
                          <p><strong>Trọng lượng:</strong> ${this.escapeHTML(
                              productDetail.weight
                          )}g</p>
                      </div>
                      <div class="extra-info">
                          <p>
                              <strong>Chính sách đổi trả:</strong> ${this.escapeHTML(
                                  productDetail.returnPolicy
                              )}
                          </p>
                          <p><strong>Bảo hành:</strong> ${this.escapeHTML(
                              productDetail.warrantyInformation
                          )}</p>
                          <p>
                              <strong>Vận chuyển:</strong> ${this.escapeHTML(
                                  productDetail.shippingInformation
                              )}
                          </p>
                      </div>
                      <div class="meta">
                          <p><strong>Ngày tạo:</strong> ${this.convertDate(
                              this.escapeHTML(productDetail.meta.createdAt)
                          )}</p>
                          <p><strong>Cập nhật:</strong> ${this.convertDate(
                              this.escapeHTML(productDetail.meta.updatedAt)
                          )}</p>
                      </div>
                      <div class="rating">
                          <strong>Đánh giá:</strong> ${this.escapeHTML(
                              productDetail.rating
                          )} / 5
                      </div>
                      <div class="reviews">
                          <h3>Nhận xét</h3>
                          <div class="review">${this.escapeHTML(
                              productDetail.reviews[0].comment
                          )}</div>
                          <div class="review">${this.escapeHTML(
                              productDetail.reviews[1].comment
                          )}</div>
                          <div class="review">${this.escapeHTML(
                              productDetail.reviews[2].comment
                          )}</div>
                      </div>
                  </div>
              </div>`;
        this.container.innerHTML = html;
    },
    convertDate(str) {
        const subStr = str.substring(0, 10);
        return subStr.replaceAll("-", "/");
    },
    async start() {
        await this.renderDetail();
    },
    escapeHTML(html) {
        const tempDiv = document.createElement("div");
        tempDiv.textContent = html;
        return tempDiv.innerHTML;
    },
};
detailProductsManager.start();
