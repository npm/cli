export default function ClothingBrandWebsite() { const products = [ { name: "Urban Oversized Tee", price: "$39", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop", }, { name: "Minimal Hoodie", price: "$69", image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop", }, { name: "Streetwear Jacket", price: "$89", image: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?q=80&w=1200&auto=format&fit=crop", }, ];

return ( <div className="min-h-screen bg-black text-white font-sans"> {/* Navbar */} <header className="flex items-center justify-between px-8 py-6 border-b border-white/10 sticky top-0 bg-black/80 backdrop-blur z-50"> <h1 className="text-2xl font-bold tracking-[0.3em]">VELORA</h1> <nav className="hidden md:flex gap-8 text-sm uppercase tracking-wide text-white/80"> <a href="#home" className="hover:text-white transition"> Home </a> <a href="#collection" className="hover:text-white transition"> Collection </a> <a href="#about" className="hover:text-white transition"> About </a> <a href="#contact" className="hover:text-white transition"> Contact </a> </nav> </header>

{/* Hero */}
  <section
    id="home"
    className="relative h-[90vh] flex items-center justify-center text-center overflow-hidden"
  >
    <img
      src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1400&auto=format&fit=crop"
      alt="Fashion Hero"
      className="absolute inset-0 w-full h-full object-cover opacity-50"
    />

    <div className="relative z-10 px-6 max-w-4xl">
      <p className="uppercase tracking-[0.4em] text-sm text-white/70 mb-4">
        New Season Collection
      </p>
      <h2 className="text-5xl md:text-7xl font-black leading-tight mb-6">
        Wear Your Identity
      </h2>
      <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
        Premium streetwear and timeless essentials crafted for modern style.
      </p>
      <button className="px-8 py-4 rounded-full bg-white text-black font-semibold hover:scale-105 transition-transform">
        Shop Now
      </button>
    </div>
  </section>

  {/* Featured Products */}
  <section id="collection" className="px-8 py-24 max-w-7xl mx-auto">
    <div className="flex items-end justify-between mb-12">
      <div>
        <p className="uppercase tracking-[0.3em] text-white/50 text-sm mb-2">
          Featured
        </p>
        <h3 className="text-4xl font-bold">Latest Collection</h3>
      </div>
      <button className="hidden md:block border border-white/20 px-5 py-2 rounded-full hover:bg-white hover:text-black transition">
        View All
      </button>
    </div>

    <div className="grid md:grid-cols-3 gap-8">
      {products.map((product, index) => (
        <div
          key={index}
          className="bg-white/5 rounded-3xl overflow-hidden border border-white/10 hover:-translate-y-2 transition duration-300"
        >
          <img
            src={product.image}
            alt={product.name}
            className="h-96 w-full object-cover"
          />

          <div className="p-6">
            <div className="flex justify-between items-center">
              <h4 className="text-xl font-semibold">{product.name}</h4>
              <span className="text-white/70">{product.price}</span>
            </div>
            <button className="mt-6 w-full py-3 rounded-xl bg-white text-black font-medium hover:bg-gray-200 transition">
              Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  </section>

  {/* About */}
  <section
    id="about"
    className="px-8 py-24 bg-white text-black rounded-t-[3rem]"
  >
    <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
      <img
        src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop"
        alt="Fashion"
        className="rounded-3xl shadow-2xl"
      />

      <div>
        <p className="uppercase tracking-[0.3em] text-black/50 text-sm mb-3">
          About Brand
        </p>
        <h3 className="text-5xl font-black mb-6 leading-tight">
          Fashion Built For Expression
        </h3>
        <p className="text-lg text-black/70 mb-6 leading-relaxed">
          VELORA blends minimal luxury with modern street culture. Every
          piece is designed to make a statement while staying comfortable
          and timeless.
        </p>
        <p className="text-lg text-black/70 mb-8 leading-relaxed">
          Designed for creators, dreamers, and trendsetters.
        </p>
        <button className="px-8 py-4 rounded-full bg-black text-white font-semibold hover:opacity-90 transition">
          Learn More
        </button>
      </div>
    </div>
  </section>

  {/* Newsletter */}
  <section className="px-8 py-24 text-center bg-neutral-950">
    <div className="max-w-3xl mx-auto">
      <p className="uppercase tracking-[0.3em] text-white/50 text-sm mb-3">
        Stay Updated
      </p>
      <h3 className="text-4xl md:text-5xl font-bold mb-6">
        Join Our Newsletter
      </h3>
      <p className="text-white/70 mb-8 text-lg">
        Get updates on new drops, exclusive offers, and upcoming releases.
      </p>

      <div className="flex flex-col md:flex-row gap-4 justify-center">
        <input
          type="email"
          placeholder="Enter your email"
          className="px-6 py-4 rounded-full bg-white/10 border border-white/10 text-white w-full md:w-[420px] outline-none"
        />
        <button className="px-8 py-4 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition">
          Subscribe
        </button>
      </div>
    </div>
  </section>

  {/* Contact */}
  <footer
    id="contact"
    className="px-8 py-10 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4"
  >
    <div>
      <h4 className="text-xl font-bold tracking-[0.3em]">VELORA</h4>
      <p className="text-white/50 mt-2">Premium Clothing Brand</p>
    </div>

    <div className="text-white/60 text-sm">
      © 2026 VELORA. All rights reserved.
    </div>
  </footer>
</div>

); }
