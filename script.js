class ProductCart {
  cart = {};
  constructor() {
    this.imgsWrapper = document.querySelector(".images");
    this.CartButton();
    this.modal = document.querySelector(".modal");
    this.overlay = document.querySelector(".overlay");
    this.modalContent = document.querySelector(".modal-content");
  }

  CartButton() {
    this.imgsWrapper.addEventListener(
      "click",
      this.onCartButtonProcess.bind(this)
    );
  }

  onCartButtonProcess(e) {
    const addToCartDiv = e.target.closest(".add-to-cart");
    const plusBtn = e.target.closest(".btn-increase");
    const minusBtn = e.target.closest(".btn-decrease");

    // ✅ 1. User clicks "Add to Cart"
    if (addToCartDiv && !addToCartDiv.classList.contains("showing-quantity")) {
      const container = e.target.closest(".image-container");
      const title = container.querySelector("h3").textContent;
      const price = container.querySelector(".price").textContent;
      const img = container.querySelector("img").src;
      // Save to memory
      this.cart[title] = {
        price,
        count: 1,
        img,
      };
      // Replace with quantity controller
      addToCartDiv.innerHTML = `
        <div class="quantity-controller">
          <button class="btn-decrease">
            <img src="assets/images/icon-decrement-quantity.svg" alt="decrease" class="icon-btn" />
          </button>
          <span class="quantity">1</span>
          <button class="btn-increase">
            <img src="assets/images/icon-increment-quantity.svg" alt="increase" class="icon-btn" />
          </button>
        </div>
      `;

      // Add flag class to show it's now quantity mode
      addToCartDiv.classList.add("showing-quantity");
      this._renderCartList();
      return;
    }

    // ✅ 2. User clicks the "+" button
    if (plusBtn) {
      const container = e.target.closest(".image-container");
      const title = container.querySelector("h3").textContent;

      // safety check
      if (!this.cart[title]) return;

      // Update memory
      this.cart[title].count++;

      // Update UI
      const quantityEl = container.querySelector(".quantity");
      quantityEl.textContent = this.cart[title].count;
      this._renderCartList();
    }
    // ✅ 3. User clicks the "-" button
    if (minusBtn) {
      const container = e.target.closest(".image-container");
      const title = container.querySelector("h3").textContent;
      // safety check
      if (!this.cart[title]) return;

      this.cart[title].count--;
      //if the count is less than 1 show the cart back
      if (this.cart[title].count < 1) {
        delete this.cart[title];
        const addToCartDiv = container.querySelector(".add-to-cart");
        addToCartDiv.innerHTML = `
          <img src="assets/images/icon-add-to-cart.svg" alt="add to cart" />
          <button>Add to cart</button>`;

        addToCartDiv.classList.remove("showing-quantity");
      } else {
        const quantityEl = document.querySelector(".quantity");
        quantityEl.textContent = this.cart[title].count;
        this._renderCartList();
      }
    }
  }
  _renderCartList() {
    const cartContainer = document.querySelector(".yes-container");
    let totalItems = 0;
    let totalPrice = 0;
    let markup = "";
    //convert object to array and loop through it
    Object.entries(this.cart).forEach(([title, item]) => {
      totalItems += item.count;
      totalPrice += item.count * parseFloat(item.price.slice(1));
      console.log(totalPrice);
      markup += `<div class="cart-item">
      <h4>${title}</h4>
      <p>${item.count}x<span>${item.price}</span></p>
      
      </div>`;
    });

    // Final HTML render
    cartContainer.innerHTML = `
    <h3>Your Cart <span>(${totalItems})</span></h3>
    ${
      markup ||
      '<img src="assets/images/illustration-empty-cart.svg" class="empty" />'
    }
    ${
      totalItems > 0
        ? `<div class="Total-div"><p class="total-label">Order Total</p> <strong><p class="total-price">$${totalPrice.toFixed(
            2
          )}</p></strong></div>`
        : ""
    }
         ${
           totalItems > 0
             ? `<button class="click-Btn">Confirm Order</button>`
             : ""
         }
    
    
    `;

    // Handle modal open
    const clickBtn = document.querySelector(".click-Btn");
    if (clickBtn) {
      clickBtn.addEventListener("click", this._showModal.bind(this));
    }
  }

  _showModal() {
    let markup = "";
    let totalPrice = 0;
    let totalAmount = 0;

    Object.entries(app.cart).forEach(([title, item]) => {
      //only for a list
      const totalItem = item.count * parseFloat(item.price.replace("$", ""));
      //Total list
      totalPrice += totalItem;
      markup += `<div class="cart-items">
    
    <img src="${item.img}" alt="user img" class="img-src" />
   <div class="flexer">
   <div>
    <h4>${title}</h4>
  <p>${item.count}x<span>${item.price}</span></p>
  </div>
  <div>
    <span class="itemer">$${totalItem.toFixed(2)}</span>
  </div>
  </div>
  </div>`;
    });
    this.modalContent.innerHTML = `   
  <img src="assets/images/icon-order-confirmed.svg" alt="order-icon" class="iconer" />
  <h2>Order Confirmed</h2>
  <p>We hope you enjoyed your food</p>
  
  <div class="styler">
  ${markup}
  
  
  <div class="Total-divs"><p class="total-label">Order Total</p> <strong><p class="total-prices">$${totalPrice.toFixed(
    2
  )}</p></strong></div></div>
    
<button class="click-Btns">Start New Order</button>`;
    this.modal.classList.remove("hidden");
    this.overlay.classList.remove("hidden");

    this.overlay.addEventListener("click", () => {
      this.modal.classList.add("hidden");
      this.overlay.classList.add("hidden");
    });
    const startBtn = this.modalContent.querySelector(".click-Btns");
    if (startBtn) {
      startBtn.addEventListener("click", this._startAfresh.bind(this));
    }
  }
  _startAfresh() {
    //Reset cart memory
    this.cart = {};

    this.modal.classList.add("hidden");
    this.overlay.classList.add("hidden");

    // 3. Re-render cart (it will now be empty)
    this._renderCartList();

    // 4. Reset all "Add to cart" buttons back to default
    const addToCartBtns = document.querySelectorAll(".add-to-cart");
    addToCartBtns.forEach((btn) => {
      btn.innerHTML = ` <img src="assets/images/icon-add-to-cart.svg" alt="add to cart" />
          <button>Add to cart</button>`;
      btn.classList.remove("showing-quantity");
    });
  }
}

const app = new ProductCart();
// //| Part                             | Purpose                              |
// | -------------------------------- | ------------------------------------ |
// | `for (const title in this.cart)` | Loops through all cart items         |
// | `totalItems`                     | Tracks how many total products       |
// | `markup`                         | Builds the visual HTML               |
// | `cartContainer.innerHTML`        | Renders the final output to the page |

//count is how many of that item

// price is string like "$5.00"

// .slice(1) removes $

// parseFloat(...) converts to number

// Multiply count × price

// Keep adding to totalPrice
//i have done the revealing of the first question of the accordion, but to close it is giving me problem, when you click the 'icon-minus.svg', it logs the 'hi to the console but the result is not being hidden
