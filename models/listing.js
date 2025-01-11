const mongoose =require("mongoose");
const Schema=mongoose.Schema;

const listingSchema=new Schema({
    title:String,
    description:String,
    Image:{
        type:String,
        default:
            "https://img.freepik.com/free-vector/book-wiith-lighbulb-cartoon-vector-icon-illustration-object-education-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-4009.jpg?t=st=1735458093~exp=1735461693~hmac=1068e1f7919f1bb017ff6da247e6c53f2f44a14a265fb1b82620c1e61ebeb4d1&w=740",
            set:(v)=>
                v === ""
            ?"https://img.freepik.com/free-vector/book-with-lighbulb-cartoon-vector-icon-illustration-object-education-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-4009.jpg?t=st=1735458093~exp=1735461693~hmac=1068e1f7919f1bb017ff6da247e6c53f2f44a14a265fb1b82620c1e61ebeb4d1&w=740"
            : v,

 

    },
    price:Number,
    location:String,
    Country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        },
    ],
});

module.exports=mongoose.model("Listing",listingSchema);