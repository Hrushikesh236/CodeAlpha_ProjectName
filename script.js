class ImageGallery {
  constructor() {
    this.gallery = document.getElementById("gallery")
    this.lightbox = document.getElementById("lightbox")
    this.lightboxImage = document.getElementById("lightbox-image")
    this.lightboxClose = document.getElementById("lightbox-close")
    this.lightboxPrev = document.getElementById("lightbox-prev")
    this.lightboxNext = document.getElementById("lightbox-next")
    this.lightboxCounter = document.getElementById("lightbox-counter")

    this.images = []
    this.currentIndex = 0

    this.init()
  }

  init() {
    this.collectImages()
    this.bindEvents()
  }

  collectImages() {
    const galleryItems = this.gallery.querySelectorAll(".gallery-item")
    this.images = Array.from(galleryItems).map((item, index) => ({
      src: item.dataset.src,
      alt: item.querySelector("img").alt,
      index: index,
    }))
  }

  bindEvents() {
    // Gallery item clicks
    this.gallery.addEventListener("click", (e) => {
      const galleryItem = e.target.closest(".gallery-item")
      if (galleryItem) {
        const index = Array.from(this.gallery.children).indexOf(galleryItem)
        this.openLightbox(index)
      }
    })

    // Lightbox controls
    this.lightboxClose.addEventListener("click", () => this.closeLightbox())
    this.lightboxPrev.addEventListener("click", () => this.prevImage())
    this.lightboxNext.addEventListener("click", () => this.nextImage())

    // Overlay click to close
    this.lightbox.querySelector(".lightbox-overlay").addEventListener("click", () => {
      this.closeLightbox()
    })

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (!this.lightbox.classList.contains("active")) return

      switch (e.key) {
        case "Escape":
          this.closeLightbox()
          break
        case "ArrowLeft":
          this.prevImage()
          break
        case "ArrowRight":
          this.nextImage()
          break
      }
    })

    // Touch/swipe support for mobile
    let startX = 0
    let endX = 0

    this.lightbox.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX
    })

    this.lightbox.addEventListener("touchend", (e) => {
      endX = e.changedTouches[0].clientX
      this.handleSwipe()
    })

    this.handleSwipe = () => {
      const swipeThreshold = 50
      const diff = startX - endX

      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          this.nextImage()
        } else {
          this.prevImage()
        }
      }
    }

    // Prevent body scroll when lightbox is open
    this.lightbox.addEventListener("wheel", (e) => {
      if (this.lightbox.classList.contains("active")) {
        e.preventDefault()
      }
    })
  }

  openLightbox(index) {
    this.currentIndex = index
    this.lightbox.classList.add("active")
    document.body.style.overflow = "hidden"

    // Set the image immediately
    const currentImage = this.images[this.currentIndex]
    this.lightboxImage.src = currentImage.src
    this.lightboxImage.alt = currentImage.alt

    // Update counter
    this.lightboxCounter.textContent = `${this.currentIndex + 1} / ${this.images.length}`

    // Update navigation buttons
    this.updateNavigationButtons()

    // Focus management for accessibility
    this.lightboxClose.focus()
  }

  closeLightbox() {
    this.lightbox.classList.remove("active")
    document.body.style.overflow = ""

    // Return focus to the gallery item that was clicked
    const galleryItems = this.gallery.querySelectorAll(".gallery-item")
    if (galleryItems[this.currentIndex]) {
      galleryItems[this.currentIndex].focus()
    }
  }

  prevImage() {
    this.currentIndex = this.currentIndex === 0 ? this.images.length - 1 : this.currentIndex - 1
    this.updateLightboxImage()
  }

  nextImage() {
    this.currentIndex = this.currentIndex === this.images.length - 1 ? 0 : this.currentIndex + 1
    this.updateLightboxImage()
  }

  updateLightboxImage() {
    const currentImage = this.images[this.currentIndex]

    // Directly set the image source - no need for complex preloading with placeholder images
    this.lightboxImage.src = currentImage.src
    this.lightboxImage.alt = currentImage.alt

    // Update counter
    this.lightboxCounter.textContent = `${this.currentIndex + 1} / ${this.images.length}`

    // Update navigation button states
    this.updateNavigationButtons()
  }

  updateNavigationButtons() {
    // Show/hide navigation buttons based on current position
    if (this.images.length <= 1) {
      this.lightboxPrev.style.display = "none"
      this.lightboxNext.style.display = "none"
    } else {
      this.lightboxPrev.style.display = "flex"
      this.lightboxNext.style.display = "flex"
    }
  }

  // Method to add new images dynamically
  addImage(src, alt) {
    const galleryItem = document.createElement("div")
    galleryItem.className = "gallery-item"
    galleryItem.dataset.src = src

    galleryItem.innerHTML = `
            <img src="${src}" alt="${alt}" loading="lazy">
            <div class="overlay">
                <span class="view-text">View Image</span>
            </div>
        `

    this.gallery.appendChild(galleryItem)
    this.collectImages() // Refresh the images array
  }

  // Method to remove image
  removeImage(index) {
    if (index >= 0 && index < this.images.length) {
      this.gallery.children[index].remove()
      this.collectImages() // Refresh the images array
    }
  }
}

// Initialize the gallery when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const gallery = new ImageGallery()

  // Add some smooth loading animation
  const galleryItems = document.querySelectorAll(".gallery-item")
  galleryItems.forEach((item, index) => {
    item.style.opacity = "0"
    item.style.transform = "translateY(20px)"

    setTimeout(() => {
      item.style.transition = "opacity 0.6s ease, transform 0.6s ease"
      item.style.opacity = "1"
      item.style.transform = "translateY(0)"
    }, index * 100)
  })
})

// Add some performance optimizations
// Lazy loading for images (already implemented with loading="lazy")
// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.animationPlayState = "running"
    }
  })
}, observerOptions)

// Observe gallery items for scroll animations
document.addEventListener("DOMContentLoaded", () => {
  const galleryItems = document.querySelectorAll(".gallery-item")
  galleryItems.forEach((item) => {
    observer.observe(item)
  })
})
