const mongoose=require('mongoose');
const review= require('./reviewModel');
const Schema=mongoose.Schema;

const imageSchema= new Schema({
        url:String,
        filename:String
});

imageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload','/upload/w_200');
});
const opts = { toJSON: { virtuals: true } };

const campgroundSchema= new Schema({
    title:{
        type:String,
        // required:true
    },
    location:{
        type:String
    },
    geometry:{
        type: {
            type: String,
            enum: ['Point'],
            required: true
          },
          coordinates: {
            type: [Number],
            required: true
          }
    },
    price:{
        type:Number,
        min:0,
        // required:true
    },
    description:{
        type:String,
        // required:true
    },
    images:[imageSchema],
    author:[{
        type:Schema.Types.ObjectId,
        ref:'User'
    }],
    review:[{
         type:Schema.Types.ObjectId,
         ref: 'review'
}]
},opts);


campgroundSchema.virtual('properties.popup').get(function() {
    return `<a href='campgrounds/${this._id}'>${this.title}</a>`;
});

campgroundSchema.post('findOneAndDelete',async function(doc){
    if(doc){
        await review.deleteMany({
            _id:{
                $in:doc.review
            }
        })
    }
})


const campground=mongoose.model('campground',campgroundSchema);
module.exports=campground;

