$ = document.querySelector.bind(document);
$$ = document.querySelectorAll.bind(document);
const container = $(".container");

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
async function renderDetail() {
  const param = new URLSearchParams(location.search);
  const Index = param.get("i");
  const productDetail = await send(
    "GET",
    `https://dummyjson.com/products/${Index}`
  );
  console.log(productDetail);
  const html = `<div class="product-detail-container">
                <div class="product-images">
                    <img
                        class="main-image"
                        src="${productDetail.images}"
                        alt="Essence Mascara Lash Princess"
                    />
                    <div class="image-gallery">
                        <img
                            src="${productDetail.images}"
                            alt="Gallery 1"
                        />
                    </div>
                </div>
                <div class="product-info">
                    <h1>${productDetail.title}</h1>
                    <p><strong>Thương hiệu:</strong> ${productDetail.brand}</p>
                    <p><strong>Danh mục:</strong> ${productDetail.category}</p>
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
                            (100 - Number(productDetail.discountPercentage))) /
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
                        <p><strong>Trọng lượng:</strong> 4g</p>
                    </div>
                    <div class="extra-info">
                        <p>
                            <strong>Chính sách đổi trả:</strong> No return
                            policy
                        </p>
                        <p><strong>Bảo hành:</strong> 1 week warranty</p>
                        <p>
                            <strong>Vận chuyển:</strong> Ships in 3-5 business
                            days
                        </p>
                    </div>
                    <div class="meta">
                        <p><strong>Ngày tạo:</strong> 30/04/2025</p>
                        <p><strong>Cập nhật:</strong> 30/04/2025</p>
                    </div>
                    <div class="rating">
                        <strong>Đánh giá:</strong> 2.56 / 5
                    </div>
                    <div class="reviews">
                        <h3>Nhận xét</h3>
                        <div class="review">Nhận xét 1...</div>
                        <div class="review">Nhận xét 2...</div>
                        <div class="review">Nhận xét 3...</div>
                    </div>
                </div>
            </div>`;
  container.innerHTML = html;
}
renderDetail();
