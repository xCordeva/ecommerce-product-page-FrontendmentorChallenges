const cartIcon = document.querySelector('.cart-icon')
const minusIcon = document.querySelector('.minus-icon')
const plusIcon = document.querySelector('.plus-icon')
const addToCart = document.querySelector('.add-to-cart-button')
const cartQuantityText = document.querySelector('.counter p')
const cartQuantityIcon= document.querySelector('.cart-quanitity-icon')
const cartContent = document.querySelector('.cart-fillings')


/* declaring a clicked variable to check if the cart icon is clicked */
let clicked = false
/* showing and hididng the cart content */
cartIcon.addEventListener('click', (event) => {
    // Prevent the click event from propagating to the document
    event.stopPropagation();
    if(!clicked){
        document.querySelector('.cart-info').style.display = 'block';
        clicked = true
    }else{
        document.querySelector('.cart-info').style.display = 'none';
        clicked = false
    }
})

let quantity = 0;
let chosenQuantity= 0;
/* making the plus & minus icons add and subtract from the quantity when clicked */
minusIcon.addEventListener('click', ()=>{
    if(quantity > 0){
        quantity--
        cartQuantityText.innerHTML = quantity
    }
})
plusIcon.addEventListener('click', ()=>{
        quantity++
        cartQuantityText.innerHTML = quantity
})

/* add to cart button resets the counter to zero and adds the quantity to the cart quantity icon */
addToCart.addEventListener('click', ()=>{
    chosenQuantity += quantity;
    quantity = 0
    cartQuantityText.innerHTML = quantity
    if(chosenQuantity !== 0){
        cartQuantityIcon.style.display = 'block'
        cartQuantityIcon.innerHTML = chosenQuantity
        cartContent.innerHTML = `
        <div class="cart-not-empty">
            <div class="cart-content">
            <img src="./images/image-product-1-thumbnail.jpg" alt="image-product-1">
            <div class="cart-content-text">
                <p>Fall Limited Edition sneakers
                $125.00 x ${chosenQuantity} &nbsp; <span> $${chosenQuantity * 125}</span></p>
            </div>
            <img src="./images/icon-delete.svg" alt="icon-delete" class="delete-button">
            </div>
        <button>Checkout</button>
        </div>
        `
    }
    emptyCart()
})


/* empty the cart and and remove the quantity counter icon */
function emptyCart() {
    const deleteIcon = document.querySelector('.delete-button')
    deleteIcon.addEventListener('click', (event)=>{
        chosenQuantity = 0;
        cartQuantityIcon.style.display = 'none'
        cartContent.innerHTML = `
        <div class="cart-empty">Your cart is empty.</div>
        `
        event.stopPropagation();
    })
}

/* hide the cart info when clicking anywhere on the page */
document.addEventListener('click', (event) => {
    const cartInfo = document.querySelector('.cart-info');
    if (clicked && !cartInfo.contains(event.target) ) {
        cartInfo.style.display = 'none';
        clicked = false;
    }
});
/* hide the cart info when escape is clicked */
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && clicked) {
        document.querySelector('.cart-info').style.display = 'none';
        clicked = false;
    }
});


/********  Images Part ********/
const thumbnailImages = document.querySelector('.container').querySelectorAll('.thumbnail-image')
const thumbnailImagesZoomed = document.querySelectorAll('.js-thumbnail-image')
let mainImage = document.querySelector('.main-image img')
let imageClicked;

const closeButton = document.getElementById('close-button')
let nextButton = document.getElementById('next-button')
let prevButton = document.getElementById('prev-button')
const lightBox = document.getElementById('lightbox')

let saveFirstImageMatch = false;
let mainImageClicked = false;


/* going through thumbnails and making the clicked one the main image */
thumbnailImages.forEach((thumbnailImage)=>{
    thumbnailImage.addEventListener('click', ()=>{
        //check if the main image is clicked (we're in the lighbox mode) if its clicked we change the main image to the one on the lightbox
        if(mainImageClicked){
            mainImage = document.querySelector('.lightbox-image img')
        }
        else{
            mainImage = document.querySelector('.main-image img')
        }

        // getting the images' source
        const thumbnailSrc = thumbnailImage.getAttribute('src');
        
        // exchanging the images' sources 
        mainImage.setAttribute('src', thumbnailSrc)

        // remove the class from all the thumbnails first
        thumbnailImages.forEach((thumbnailImage)=>{  
            thumbnailImage.parentNode.classList.remove('image-container')
        })

        // adding the class to the thumbnails thats clicked
        thumbnailImage.parentNode.classList.add('image-container')

    })
    
})

// close button on click removes the lightbox 
closeButton.addEventListener('click', () => {
    lightBox.style.display = 'none';
    // remove previous selected thumbnail
    thumbnailImages.forEach((thumbnailImage) => {
        thumbnailImage.parentNode.classList.remove('image-container')
    });

    // Only add the class if it was previously saved (main image was clicked)
    if (saveFirstImageMatch) {
        imageClicked.parentNode.classList.add('image-container');

        // setting the main image back to the image thats on screen since the thumbnail click changes its src to the clicked thumb
        mainImage.setAttribute('src', imageClicked.getAttribute('src'))
        saveFirstImageMatch = false;
    }

    mainImageClicked = false;
});


// making the main image only clickable for the desktop version & changing the next and prev buttons to the ones on the lightbox since i have another version for the mobile view
if(window.innerWidth >= 950){

    mainImage.addEventListener('click', mainImageClick);
    nextButton = document.querySelector('.lightbox .next-button')
    prevButton = document.querySelector('.lightbox .prev-button')

}

// click on the main image on the page
function mainImageClick(){
    lightBox.style.display = 'flex';
    mainImageClicked = true;
    thumbnailImages.forEach((thumbnailImage) => {
        if (thumbnailImage.getAttribute('src') === mainImage.getAttribute('src')) {

            // saving the image thats clicked to be used back to put on its image-container class and the if is for getting the first image since theres images on the page and images on lightbox
            if (!saveFirstImageMatch) {
                imageClicked = thumbnailImage;
                saveFirstImageMatch = true;
            }
            thumbnailImage.parentNode.classList.add('image-container');
            mainImage = document.querySelector('.lightbox-image img');
            mainImage.setAttribute('src', thumbnailImage.getAttribute('src'));
        }
    });
}


// next and prev button on the lightbox
nextButton.addEventListener('click', () => {

    // find the index of the current image
    const currentIndex = Array.from(thumbnailImagesZoomed).findIndex(thumbnailImage => {
        return mainImage.getAttribute('src') === thumbnailImage.getAttribute('src');
    });
    let nextIndex = currentIndex + 1
    // check if its the last image
    if(currentIndex === Array.from(thumbnailImagesZoomed).length -1){
        nextIndex = currentIndex
    }
        // Get the next image's source
        const nextImageSrc = thumbnailImagesZoomed[nextIndex].getAttribute('src');
    
        // Set the main image's source to the next image
        mainImage.setAttribute('src', nextImageSrc);

        thumbnailImages.forEach((thumbnailImage)=>{  
            thumbnailImage.parentNode.classList.remove('image-container')
        })

        thumbnailImagesZoomed[nextIndex].parentNode.classList.add('image-container')

});

prevButton.addEventListener('click', () => {

    // Find the index of the current image in thumbnailImagesZoomed
    const currentIndex = Array.from(thumbnailImagesZoomed).findIndex(thumbnailImage => {
        return mainImage.getAttribute('src') === thumbnailImage.getAttribute('src');
    });

    // Calculate the index of the next image (increment by 1)
    
    let prevIndex = currentIndex - 1
    if(currentIndex === 0){
        prevIndex = currentIndex
    }
    // Get the next image's source
    const prevImageSrc = thumbnailImagesZoomed[prevIndex].getAttribute('src');

    // Set the main image's source to the next image
    mainImage.setAttribute('src', prevImageSrc);


    thumbnailImages.forEach((thumbnailImage)=>{  
        thumbnailImage.parentNode.classList.remove('image-container')
    })

    thumbnailImagesZoomed[prevIndex].parentNode.classList.add('image-container')
});

/********  Mobile Menu ********/
const menuButton = document.getElementById('menu-button')
const closeMenuButton =  document.getElementById('close-menu-button')
const menuItems = document.querySelector('.nav-toggler-items')

menuButton.addEventListener('click', ()=>{
    menuItems.style.display = 'flex'
})

closeMenuButton.addEventListener('click', ()=>{
    menuItems.style.display = 'none'
})