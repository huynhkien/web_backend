const Product = require('../models/product.model');
const asyncHandler = require('express-async-handler');

const getProduct = asyncHandler(async(req, res) => {
  const  {slug} = req.params;
  const product = await Product.findOne({slug});
  return res.status(200).json({
    success: product ? true : false,
    data: product ? product : 'Không tìm thấy sản phẩm'
  });
});
const getProducts = asyncHandler(async(req, res) => {
  const queries = {...req.query};
  const excludeFields = ['limit', 'sort', 'page', 'fields'];
  excludeFields.forEach(el => delete queries[el])
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, matchedEl => `$${matchedEl}`);
  const  formatQueries = JSON.parse(queryString);
  
  if (queries.price__gte || queries.price__lte) {
    formatQueries.price = {}; 
    if (queries.price__gte) formatQueries.price.$gte = Number(queries.price__gte);
    if (queries.price__lte) formatQueries.price.$lte = Number(queries.price__lte);
    
    delete formatQueries.price__gte;
    delete formatQueries.price__lte;
  } else {
    delete formatQueries.price;
  }
  
  let queryObject = {}
  if(queries?.q){
    delete formatQueries.q;
    queryObject = {
      $or: [
        {name: {$regex: queries.q, $options: 'i'}},
        {category: {$regex: queries.q, $options: 'i'}},
        {color: {$regex: queries.q, $options: 'i'}},
      ]
    }
  }
  const qr = {...formatQueries, ...queryObject};

  let queryCommand = Product.find(qr);

  if(req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    queryCommand = queryCommand.sort(sortBy);
  }
  if(req.query.fields){
    const fields = req.query.fields.split(',').join(' ');
    queryCommand = queryCommand.select(fields);
  }
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 100;
  const skip = (page - 1) * limit;
  queryCommand = queryCommand.skip(skip).limit(limit);

  const queryExecute = await queryCommand.exec();
  const counts = await Product.countDocuments(formatQueries);
  return res.status(200).json({
      success: queryExecute.length > 0,
      data: queryExecute,
      counts
  });
});
module.exports = {
    getProduct,
    getProducts
}  
  