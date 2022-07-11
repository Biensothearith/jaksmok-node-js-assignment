const express = require("express");
const { books } = require("../../data");
const router = express.Router();
router.get("/:page/:size", (req, res, next) => {
  var page = req.params.page || 0;
  var size = req.params.size || 4;
  paginate(books,size,page,rs_paginate=>{
    if(rs_paginate && rs_paginate.length>0){
      res.status(200).json({
        results:{
          size: size,
          page:page,
          totalPages:Math.ceil(books.length/size),
          content:rs_paginate
        },
        message:'success',
      })
    }else{
      res.status(400).json({
        error:"empty_array",
        message:'empty_array'
      })
    }
  })
});
router.get("/:id", (req, res, next) => {
  var id=req.params.id;
  id=JSON.parse(id)
  if(id){
    var rs=books.find((x) =>x.id===id);
    console.log(rs)
    if(rs){
      res.status(200).json({
        results:rs,
        message:'success'
      })
    }else{
      res.status(400).json({
        error:"empty",
        message:'empty'
      })
    }
  }else{
    res.status(400).json({
      error:"empty",
      message:'empty'
    })
  }
});

function paginate(array, page_size, page_number,callback) {
  var rs=array.slice((page_number - 1) * page_size, page_number * page_size);
  callback(rs)
}


module.exports = router;
