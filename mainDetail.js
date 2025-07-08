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
        console.log(productDetail);
        const html = `<div class="product-detail-container">
                  <div class="product-images">
                      <img
                          class="main-image"
                          src="${productDetail.images[0]}"
                          alt="Essence Mascara Lash Princess"
                      />
                      <div class="image-gallery">
                          <img
                              src="${productDetail.images[0]}"
                              alt="Gallery 1"
                          />
                      </div>
                  </div>
                  <div class="product-info">
                      <h1>${productDetail.title}</h1>
                      <p><strong>Thương hiệu:</strong> ${
                          productDetail.brand
                      }</p>
                      <p><strong>Danh mục:</strong> ${
                          productDetail.category
                      }</p>
                      <p>
                          <strong>Trạng thái:</strong>
                          <span class="in-stock">Còn hàng</span> (${
                              productDetail.stock
                          } sản phẩm)
                      </p>
  
                      <div class="price-section">
                          <span class="original-price">${
                              productDetail.price
                          }$</span>
                          <span class="discounted-price">${(
                              (Number(productDetail.price) *
                                  (100 -
                                      Number(
                                          productDetail.discountPercentage
                                      ))) /
                              100
                          ).toFixed(2)}$</span>
                          <span class="discount">-${
                              productDetail.discountPercentage
                          }%</span>
                      </div>
                      <p><strong>Số lượng tối thiểu đặt hàng:</strong>${
                          productDetail.minimumOrderQuantity
                      }</p>
                      <p class="description">
                          ${productDetail.description}
                      </p>
                      <div class="tags">
                          <span class="tag">${productDetail.tags[0]}</span>
                          <span class="tag">${productDetail.tags[1]}</span>
                      </div>
                      <div class="specs">
                          <p>
                              <strong>Kích thước:</strong> ${
                                  productDetail.dimensions.width
                              } x ${productDetail.dimensions.height} x ${
            productDetail.dimensions.depth
        }
                              mm
                          </p>
                          <p><strong>Trọng lượng:</strong> ${
                              productDetail.weight
                          }g</p>
                      </div>
                      <div class="extra-info">
                          <p>
                              <strong>Chính sách đổi trả:</strong> ${
                                  productDetail.returnPolicy
                              }
                          </p>
                          <p><strong>Bảo hành:</strong> ${
                              productDetail.warrantyInformation
                          }</p>
                          <p>
                              <strong>Vận chuyển:</strong> ${
                                  productDetail.shippingInformation
                              }
                          </p>
                      </div>
                      <div class="meta">
                          <p><strong>Ngày tạo:</strong> ${this.convertDate(
                              productDetail.meta.createdAt
                          )}</p>
                          <p><strong>Cập nhật:</strong> ${this.convertDate(
                              productDetail.meta.updatedAt
                          )}</p>
                      </div>
                      <div class="rating">
                          <strong>Đánh giá:</strong> ${productDetail.rating} / 5
                      </div>
                      <div class="reviews">
                          <h3>Nhận xét</h3>
                          <div class="review">${
                              productDetail.reviews[0].comment
                          }</div>
                          <div class="review">${
                              productDetail.reviews[1].comment
                          }</div>
                          <div class="review">${
                              productDetail.reviews[2].comment
                          }</div>
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
};
detailProductsManager.start();
