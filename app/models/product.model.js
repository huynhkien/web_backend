const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    mileage: { type: Number, required: true }, 
    fuel_type: { type: String, required: true },
    transmission: { type: String, required: true },
    engine_capacity: { type: Number, required: true }, 
    horsepower: { type: Number, required: true }, 
    color: { type: String, trim: true },
    thumb: { type: String, trim: true },
    images: [
      {
        url: { type: String, required: true }, 
      },
    ],
    price: { type: Number, required: true },
    slug: { type: String, slug: 'name', unique: true },
  },
  {
    timestamps: true,
  }
);

// Add plugins
mongoose.plugin(slug);

module.exports = mongoose.model('Product', ProductSchema);
