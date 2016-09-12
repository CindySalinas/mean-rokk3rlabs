var mongoose=require('mongoose'),
		Schema=mongoose.Schema;

var tasks = new Schema({
	name : String,
	priority: Number,
	due_date: { type: String },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
},{
  versionKey: false
});

var task = mongoose.model('Tasks', tasks);

module.exports = task;
