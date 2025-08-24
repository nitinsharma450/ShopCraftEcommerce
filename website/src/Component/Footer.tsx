import { Facebook, Linkedin, Twitter, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-amber-50 text-gray-700 pt-10 ">
      {/* Grid Sections */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 px-10 py-10">
        
        {/* Brand Info */}
        <div>
          <h1 className="text-2xl font-bold text-amber-600 mb-2">WEIBOON</h1>
          <p className="text-sm">Sold in the information and experience. We provide quality with passion.</p>
        </div>

        {/* About Us */}
        <div>
          <h2 className="text-lg font-semibold mb-2">About Us</h2>
          <p className="text-sm leading-relaxed">
            Weiboons is built for customers like you. Connect with us anytime.
          </p>
          <button className="mt-3 inline-block text-amber-600 font-medium hover:underline">Get in Touch</button>
        </div>

        {/* Information */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Information</h2>
          <ul className="space-y-1 text-sm">
            <li>About</li>
            <li>FAQs</li>
            <li>Checkout</li>
            <li>Art</li>
          </ul>
        </div>

        {/* My Account */}
        <div>
          <h2 className="text-lg font-semibold mb-2">My Account</h2>
          <ul className="space-y-1 text-sm">
            <li>Profile</li>
            <li>Orders</li>
            <li>Wishlist</li>
            <li>Settings</li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Get Newsletter</h2>
          <p className="text-sm">Subscribe now and get 10% off!</p>
          <input
            type="email"
            placeholder="Enter email address"
            className="mt-3 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <button className="mt-3 w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-lg transition">
            Subscribe
          </button>
        </div>
      </div>

      {/* Divider */}
      <hr className="border-t border-gray-300 mx-10" />

      {/* Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 px-10 py-6 text-center md:text-left text-sm">
        
        {/* Social Icons */}
        <div className="flex justify-center md:justify-start gap-3">
          {[Facebook, Youtube, Twitter, Linkedin].map((Icon, idx) => (
            <div
              key={idx}
              className="p-3 bg-white rounded-full shadow hover:scale-105 transition transform cursor-pointer"
            >
              <Icon size={16} className="text-gray-800" />
            </div>
          ))}
        </div>

        {/* Center Text */}
        <div className="font-medium text-gray-700">
          Order faster with our app
        </div>

        {/* Payment Icons */}
        <div className="flex justify-center md:justify-end gap-4">
          <img src="/image.png" alt="payment1" className="w-10 h-10 object-contain" />
          <img src="/payoneer.png" alt="payment2" className="w-10 h-10 object-contain" />
          <img src="/google.png" alt="payment3" className="w-10 h-10 object-contain" />
        </div>
      </div>
    </footer>
  );
}
